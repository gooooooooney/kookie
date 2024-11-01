import { Button, Group, Modal, Switch, TextInput } from "@mantine/core"
import { useState } from "react"
import type { CookieData } from "~types/cookie"

interface EditCookieModalProps {
  opened: boolean
  close: () => void
  reload: () => void
  cookie: CookieData
}

export function EditCookieModal({ opened, close, reload, cookie }: EditCookieModalProps) {
  const [value, setValue] = useState(cookie.value)
  const [domain, setDomain] = useState(cookie.domain)
  const [path, setPath] = useState(cookie.path)
  const [secure, setSecure] = useState(cookie.secure)
  const [httpOnly, setHttpOnly] = useState(cookie.httpOnly)
  const [expirationDate, setExpirationDate] = useState(
    cookie.expirationDate
      ? new Date(cookie.expirationDate * 1000).toISOString().slice(0, 16)
      : ""
  )

  const updateCookie = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tabs[0]?.url) {
      await chrome.cookies.set({
        url: `${new URL(tabs[0].url).protocol}//${domain}${path}`,
        name: cookie.name,
        value: value,
        domain: domain,
        path: path,
        secure: secure,
        httpOnly: httpOnly,
        sameSite: cookie.sameSite,
        expirationDate: expirationDate
          ? new Date(expirationDate).getTime() / 1000
          : undefined
      })
      close()
      reload()
    }
  }

  return (
    <Modal opened={opened} onClose={close} title={`Edit Cookie: ${cookie.name}`}>
      <TextInput
        label="Value"
        placeholder="Cookie value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        mb="md"
      />
      <TextInput
        label="Domain"
        placeholder="Cookie domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        mb="md"
      />
      <TextInput
        label="Path"
        placeholder="Cookie path"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        mb="md"
      />
      <Group mb="md">
        <Switch
          label="Secure"
          checked={secure}
          onChange={(e) => setSecure(e.target.checked)}
        />
        <Switch
          label="HTTP Only"
          checked={httpOnly}
          onChange={(e) => setHttpOnly(e.target.checked)}
        />
      </Group>
      <TextInput
        type="datetime-local"
        label="Expiration Date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
        mb="md"
      />

      <Group justify="flex-end">
        <Button variant="light" onClick={close}>
          Cancel
        </Button>
        <Button onClick={updateCookie}>Save</Button>
      </Group>
    </Modal>
  )
} 