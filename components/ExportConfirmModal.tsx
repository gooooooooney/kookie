import { Button, Group, Modal, Text } from "@mantine/core"
import type { CookieData } from "~types/cookie"

interface ExportConfirmModalProps {
  opened: boolean
  onClose: () => void
  onConfirm: (cookies: CookieData[]) => void
  onEdit: (cookies: CookieData[]) => void
  cookies: CookieData[]
}

export function ExportConfirmModal({
  opened,
  onClose,
  onConfirm,
  onEdit,
  cookies
}: ExportConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Export Cookies">
      <Text size="sm" mb="md">
        Do you want to edit the cookies before copying?
      </Text>
      <Group justify="flex-end">
        <Button variant="light" onClick={() => onConfirm(cookies)}>
          Copy Directly
        </Button>
        <Button onClick={() => onEdit(cookies)}>
          Edit First
        </Button>
      </Group>
    </Modal>
  )
} 