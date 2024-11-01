import { useEffect, useState } from "react";

import {
  Accordion,
  ActionIcon,
  Button,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp, IconClipboard, IconCopy, IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";

import { AddCookieModal } from "~components/AddCookieModal";
import { AlertModal } from "~components/AlertModal";
import { EditCookieModal } from "~components/EditCookieModal";
import { EditCookiesModal } from "~components/EditCookiesModal";
import { ExportConfirmModal } from "~components/ExportConfirmModal";
import { ImportConfirmModal } from "~components/ImportConfirmModal";
import { ThemeProvider } from "~theme";
import type { CookieData } from "~types/cookie";
import { exportCookies } from "~utils/cookie";

function IndexPopup() {
  const [cookies, setCookies] = useState<CookieData[]>([])
  const [search, setSearch] = useState("")
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false)
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false)
  const [selectedCookie, setSelectedCookie] = useState<CookieData | null>(null)
  const [currentDomain, setCurrentDomain] = useState("")
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>("current")
  const [customDomain, setCustomDomain] = useState("")
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [showMoreMap, setShowMoreMap] = useState<Record<string, boolean>>({})
  const [importConfirmOpened, setImportConfirmOpened] = useState(false)
  const [editCookiesOpened, setEditCookiesOpened] = useState(false)
  const [exportConfirmOpened, setExportConfirmOpened] = useState(false)
  const [cookiesToExport, setCookiesToExport] = useState<CookieData[]>([])
  const [alert, setAlert] = useState<{
    opened: boolean
    title: string
    message: string
    type: 'success' | 'error'
  }>({
    opened: false,
    title: '',
    message: '',
    type: 'success'
  })

  // Get unique top-level domains from cookies
  const getUniqueDomains = () => {
    const domains = new Set<string>()
    cookies.forEach((cookie) => {
      const domainParts = cookie.domain.split('.')
      const topDomain = domainParts.slice(-2).join('.')
      domains.add(topDomain)
    })
    return Array.from(domains)
  }

  // Get domain filter options
  const getDomainOptions = () => {
    return [
      { value: "all", label: "All Domains" },
      { value: "custom", label: "Custom Domain" }
    ]
  }

  // Get cookies for the current tab
  const loadCookies = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tabs[0]?.url) {
      const url = new URL(tabs[0].url)
      console.log(tabs[0].url)
      const currentHostname = url.hostname
      setCurrentDomain(currentHostname)
      setSelectedDomainFilter("all")

      // 获取所有 cookies，不指定 domain 参数
      const allCookies = await chrome.cookies.getAll({
        url: tabs[0].url
      })

      setCookies(allCookies)
    }
  }

  useEffect(() => {
    loadCookies()
  }, [])

  // Delete all visible cookies
  const deleteAllCookies = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tabs[0]?.url) {
      const url = new URL(tabs[0].url)
      for (const cookie of filteredCookies) {
        await chrome.cookies.remove({
          url: `${url.protocol}//${cookie.domain}${cookie.path}`,
          name: cookie.name
        })
      }
      loadCookies()
    }
  }

  // Delete single cookie
  const deleteCookie = async (cookie: CookieData) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tabs[0]?.url) {
      const url = new URL(tabs[0].url)


      await chrome.cookies.remove({
        url: `${url.protocol}//${cookie.domain}${cookie.path}`,
        name: cookie.name
      })
      loadCookies()
    }
  }

  // Handle cookie edit
  const handleEditClick = (cookie: CookieData, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedCookie(cookie)
    openEditModal()
  }

  // 修改 filteredCookies 的过滤逻辑
  const filteredCookies = cookies.filter((cookie) => {
    const nameMatch = cookie.name.toLowerCase().includes(search.toLowerCase())
    let domainMatch = true

    if (selectedDomainFilter === "custom" && customDomain) {
      // 移除可能的前导点号进行比较
      const cleanCustomDomain = customDomain.startsWith('.') ?
        customDomain.substring(1) : customDomain
      const cleanCookieDomain = cookie.domain.startsWith('.') ?
        cookie.domain.substring(1) : cookie.domain

      // 检查域名是否匹配（包括子域名）
      domainMatch = cleanCookieDomain.includes(cleanCustomDomain) ||
        cleanCustomDomain.includes(cleanCookieDomain)
    }

    return nameMatch && domainMatch
  })


  // 添加文件下载函数
  const handleExport = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const url = new URL(tabs[0].url)
    const domain = selectedDomainFilter === "current" ? currentDomain :
      selectedDomainFilter === "custom" ? customDomain :
        selectedDomainFilter

    const exportedCookies = await exportCookies({
      url: tabs[0].url,
      domain: domain === 'all' ? undefined : domain,
      includeSubdomains: true
    })
    console.log(exportedCookies, domain)

    setCookiesToExport(exportedCookies)
    setExportConfirmOpened(true)
  }

  // 修改导入函数
  const handleImport = () => {
    setImportConfirmOpened(true)
  }

  // 修改 handleDirectImport 函数
  const handleDirectImport = async (cookies: CookieData[]) => {
    try {
      // 遍历并添加每个 cookie
      for (const cookie of cookies) {
        // 规范化 sameSite 值
        let sameSite: chrome.cookies.SameSiteStatus = "lax";
        if (cookie.sameSite === "strict" || cookie.sameSite === "lax" || cookie.sameSite === "no_restriction") {
          sameSite = cookie.sameSite as chrome.cookies.SameSiteStatus;
        }

        // 确保必要的属性存在且格式正确
        const cookieData = {
          url: `${cookie.secure ? 'https://' : 'http://'}${cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain}${cookie.path}`,
          name: cookie.name,
          value: cookie.value || "",
          domain: cookie.domain,
          path: cookie.path || "/",
          secure: !!cookie.secure,
          httpOnly: !!cookie.httpOnly,
          sameSite: sameSite,
          // 只在有效期存在且大于当前时间时设置
          ...(cookie.expirationDate && cookie.expirationDate > Date.now() / 1000
            ? { expirationDate: cookie.expirationDate }
            : {})
        }

        try {
          console.log('Setting cookie:', cookieData);
          await chrome.cookies.set(cookieData)
        } catch (err) {
          console.warn(`Failed to set cookie ${cookie.name}:`, err)
          // 继续处理下一个 cookie，而不是中断整个过程
          continue
        }
      }

      setImportConfirmOpened(false)
      showAlert('Success', 'Cookies imported successfully', 'success')
      loadCookies() // 重新加载显示新的 cookies
    } catch (error) {
      showAlert('Error', 'Failed to import cookies', 'error')
      console.error('Error importing cookies:', error)
    }
  }

  const handleEditCookies = (cookies: CookieData[]) => {
    setImportConfirmOpened(false)
    setEditCookiesOpened(true)
  }

  // 修改 handleSaveEditedCookies 函数
  const handleSaveEditedCookies = async (cookies: CookieData[]) => {
    await handleDirectExport(cookies)
    setEditCookiesOpened(false)
  }

  // 添加一个生成一key的函数
  const getCookieKey = (cookie: CookieData) => `${cookie.name}-${cookie.domain}`

  // 修改 toggleShowMore 函数使用新的 key
  const toggleShowMore = (cookie: CookieData, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMoreMap(prev => ({
      ...prev,
      [getCookieKey(cookie)]: !prev[getCookieKey(cookie)]
    }))
  }

  // 修改 handleDirectExport 函数
  const handleDirectExport = async (cookies: CookieData[]) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(cookies, null, 2))
      setExportConfirmOpened(false)
      showAlert('Success', 'Cookies copied to clipboard', 'success')
    } catch (error) {
      showAlert('Error', 'Failed to copy cookies', 'error')
      console.error('Error copying cookies:', error)
    }
  }

  // 修改 handleEditExport 函数
  const handleEditExport = (cookies: CookieData[]) => {
    setExportConfirmOpened(false)
    setEditCookiesOpened(true)
    setCookiesToExport(cookies) // 复用导入时的编辑模态框
  }

  const showAlert = (title: string, message: string, type: 'success' | 'error') => {
    setAlert({
      opened: true,
      title,
      message,
      type
    })
  }

  return (
    <>
      <ThemeProvider>
        <Stack p="md" style={{
          width: 400,
          height: '600px', // 设置固定度
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* 头部内容 */}
          <Stack style={{ flex: 1, overflow: 'auto' }}> {/* 中间可滚动区域 */}
            <Group justify="space-between">
              <Title order={3}>Cookie Manager</Title>
              <Group>
                <ActionIcon variant="filled" onClick={openAddModal}>
                  <IconPlus size={18} />
                </ActionIcon>
                <ActionIcon color="red" variant="filled" onClick={deleteAllCookies}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            </Group>

            <Select
              data={getDomainOptions()}
              value={selectedDomainFilter}
              onChange={(value) => setSelectedDomainFilter(value || "current")}
            />

            {selectedDomainFilter === "custom" && (
              <TextInput
                placeholder="Enter domain filter..."
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
            )}

            <TextInput
              placeholder="Search cookies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSection={<IconSearch size={16} />}
            />

            <Accordion
              multiple
              value={expandedItems}
              onChange={setExpandedItems}
              variant="contained">
              {filteredCookies.map((cookie) => (
                <Accordion.Item
                  key={getCookieKey(cookie)}
                  value={getCookieKey(cookie)}>
                  <Accordion.Control>
                    <Group justify="space-between" wrap="nowrap">
                      <Text fw={500} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cookie.name}
                      </Text>
                      <Group gap="xs" wrap="nowrap">
                        <ActionIcon
                          color="blue"
                          variant="light"
                          onClick={(e) => handleEditClick(cookie, e)}>
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            deleteCookie(cookie)
                          }}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Group justify="space-between" align="center">
                        <Text size="sm" style={{
                          wordBreak: 'break-all',
                          flex: 1
                        }}>
                          <Text span fw={500}>Value: </Text>
                          {cookie.value}
                        </Text>
                      </Group>

                      {showMoreMap[getCookieKey(cookie)] ? (
                        <>
                          <Text size="sm">
                            <Text span fw={500}>Domain: </Text>
                            {cookie.domain}
                          </Text>
                          <Text size="sm">
                            <Text span fw={500}>Path: </Text>
                            {cookie.path}
                          </Text>
                          <Text size="sm">
                            <Text span fw={500}>Secure: </Text>
                            {cookie.secure ? "Yes" : "No"}
                          </Text>
                          <Text size="sm">
                            <Text span fw={500}>HTTP Only: </Text>
                            {cookie.httpOnly ? "Yes" : "No"}
                          </Text>
                          {cookie.expirationDate && (
                            <Text size="sm">
                              <Text span fw={500}>Expires: </Text>
                              {new Date(cookie.expirationDate * 1000).toLocaleString()}
                            </Text>
                          )}
                        </>
                      ) : null}

                      <Button
                        variant="subtle"
                        size="xs"
                        leftSection={showMoreMap[getCookieKey(cookie)] ?
                          <IconChevronUp size={14} /> :
                          <IconChevronDown size={14} />
                        }
                        onClick={(e) => toggleShowMore(cookie, e)}
                      >
                        {showMoreMap[getCookieKey(cookie)] ? "Show Less" : "Show More"}
                      </Button>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Stack>

          {/* 底部固定按钮 */}
          <Group style={{
            borderTop: '1px solid #eee',
            paddingTop: 'md',
            marginTop: 'auto' // 将按钮推到底部
          }}>
            <Button
              leftSection={<IconCopy size={18} />}
              onClick={handleExport}>
              Copy
            </Button>
            <Button
              variant="light"
              leftSection={<IconClipboard size={18} />}
              onClick={handleImport}>
              Import
            </Button>
          </Group>

          <AddCookieModal
            opened={addModalOpened}
            close={closeAddModal}
            reload={loadCookies}
          />

          {selectedCookie && (
            <EditCookieModal
              opened={editModalOpened}
              close={closeEditModal}
              reload={loadCookies}
              cookie={selectedCookie}
            />
          )}

          <ImportConfirmModal
            opened={importConfirmOpened}
            onClose={() => setImportConfirmOpened(false)}
            onConfirm={handleDirectImport}
            onEdit={handleEditCookies}
          />
          <EditCookiesModal
            opened={editCookiesOpened}
            onClose={() => setEditCookiesOpened(false)}
            onSave={handleSaveEditedCookies}
            cookies={cookiesToExport}
          />
          <ExportConfirmModal
            opened={exportConfirmOpened}
            onClose={() => setExportConfirmOpened(false)}
            onConfirm={handleDirectExport}
            onEdit={handleEditExport}
            cookies={cookies}
          />
          <AlertModal
            opened={alert.opened}
            onClose={() => setAlert(prev => ({ ...prev, opened: false }))}
            title={alert.title}
            message={alert.message}
            type={alert.type}
          />
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default IndexPopup
