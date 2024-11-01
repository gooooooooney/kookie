import { Button, Group, Modal, Stack, Textarea } from "@mantine/core"
import { useState } from "react"
import type { CookieData } from "~types/cookie"

interface ImportConfirmModalProps {
  opened: boolean
  onClose: () => void
  onConfirm: (cookies: CookieData[]) => void
  onEdit: (cookies: CookieData[]) => void
}

export function ImportConfirmModal({
  opened,
  onClose,
  onConfirm,
  onEdit
}: ImportConfirmModalProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = () => {
    try {
      const cookies = JSON.parse(jsonInput)
      if (!Array.isArray(cookies)) {
        setError("Invalid JSON format. Must be an array of cookies.")
        return
      }
      onConfirm(cookies)
      setJsonInput("")
      setError("")
    } catch (e) {
      setError("Invalid JSON format")
    }
  }

  const handleEdit = () => {
    try {
      const cookies = JSON.parse(jsonInput)
      if (!Array.isArray(cookies)) {
        setError("Invalid JSON format. Must be an array of cookies.")
        return
      }
      onEdit(cookies)
      setJsonInput("")
      setError("")
    } catch (e) {
      setError("Invalid JSON format")
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Import Cookies">
      <Stack>
        <Textarea
          placeholder="Paste your cookies JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.currentTarget.value)}
          error={error}
          minRows={10}
          autosize
        />
        <Group justify="flex-end">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="light" onClick={handleEdit}>
            Edit
          </Button>
          <Button onClick={handleConfirm}>Import</Button>
        </Group>
      </Stack>
    </Modal>
  )
} 