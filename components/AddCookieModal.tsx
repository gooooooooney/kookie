import { Button, Group, Modal, TextInput } from "@mantine/core"
import { useState } from "react"

interface AddCookieModalProps {
  opened: boolean
  close: () => void
  reload: () => void
}

export function AddCookieModal({ opened, close, reload }: AddCookieModalProps) {
  const [name, setName] = useState("")
  const [value, setValue] = useState("")

  const addCookie = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tabs[0]?.url) {
      const url = new URL(tabs[0].url)
      await chrome.cookies.set({
        url: tabs[0].url,
        name,
        value,
        domain: url.hostname,
        path: "/"
      })
      close()
      reload()
      setName("")
      setValue("")
    }
  }

  return (
    <Modal opened={opened} onClose={close} title="Add Cookie">
      <TextInput
        label="Name"
        placeholder="Cookie name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        mb="md"
      />
      <TextInput
        label="Value"
        placeholder="Cookie value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        mb="md"
      />
      <Group justify="flex-end">
        <Button variant="light" onClick={close}>
          Cancel
        </Button>
        <Button onClick={addCookie}>Add</Button>
      </Group>
    </Modal>
  )
} 