import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core"
import { useState } from "react"
import type { CookieData } from "~types/cookie"

interface EditCookiesModalProps {
  opened: boolean
  onClose: () => void
  onSave: (cookies: CookieData[]) => void
  cookies: CookieData[]
}

export function EditCookiesModal({
  opened,
  onClose,
  onSave,
  cookies: initialCookies
}: EditCookiesModalProps) {
  const [newDomain, setNewDomain] = useState("localhost")

  const handleSave = () => {
    if (!newDomain) {
      onSave(initialCookies)
      return
    }

    // 修改所有 cookies 的域名
    const updatedCookies = initialCookies.map(cookie => ({
      ...cookie,
      domain: newDomain.startsWith('.') ? newDomain : `.${newDomain}`
    }))
    onSave(updatedCookies)
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Domain" size="md">
      <Stack>
        <Text size="sm" color="dimmed">
          Enter a new domain to update all cookies. The domain will be automatically prefixed with a dot if not provided.
        </Text>
        <TextInput
          autoFocus
          label="New Domain"
          placeholder="e.g. example.com or .example.com"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
        />
      </Stack>
      <Group justify="flex-end" mt="xl">
        <Button variant="light" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save and Copy
        </Button>
      </Group>
    </Modal>
  )
} 