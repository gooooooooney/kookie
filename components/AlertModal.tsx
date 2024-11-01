import { Button, Group, Modal, Text } from "@mantine/core"

interface AlertModalProps {
  opened: boolean
  onClose: () => void
  title: string
  message: string
  type: 'success' | 'error'
}

export function AlertModal({
  opened,
  onClose,
  title,
  message,
  type
}: AlertModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size="sm">
      <Text mb="md" color={type === 'success' ? 'green' : 'red'}>
        {message}
      </Text>
      <Group justify="flex-end">
        <Button onClick={onClose}>
          OK
        </Button>
      </Group>
    </Modal>
  )
} 