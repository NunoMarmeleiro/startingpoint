
import { useState } from "react"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import "./ConfirmDialog.css"

type ConfirmDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => Promise<void>
}

function ConfirmDialog({
                           open,
                           onOpenChange,
                           title,
                           description,
                           confirmLabel = "Delete",
                           cancelLabel = "Cancel",
                           onConfirm,
                       }: ConfirmDialogProps) {
    const [isConfirming, setIsConfirming] = useState(false)

    function handleOpenChange(nextOpen: boolean) {
        if (isConfirming) return
        onOpenChange(nextOpen)
    }

    async function handleConfirm() {
        setIsConfirming(true)

        try {
            await onConfirm()
            onOpenChange(false)
        } catch {
            // Keep the dialog open if the operation fails.
            // The caller is responsible for displaying the error.
        } finally {
            setIsConfirming(false)
        }
    }

    return (
        <AlertDialog.Root
            open={open}
            onOpenChange={handleOpenChange}
        >
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="confirm-dialog__overlay" />

                <AlertDialog.Content className="confirm-dialog__content">
                    <AlertDialog.Title className="confirm-dialog__title">
                        {title}
                    </AlertDialog.Title>

                    <AlertDialog.Description className="confirm-dialog__description">
                        {description}
                    </AlertDialog.Description>

                    <div className="confirm-dialog__actions">
                        <AlertDialog.Cancel asChild>
                            <button
                                type="button"
                                className="button button--secondary"
                                disabled={isConfirming}
                            >
                                {cancelLabel}
                            </button>
                        </AlertDialog.Cancel>

                        <AlertDialog.Action asChild>
                            <button
                                type="button"
                                className="button button--danger"
                                disabled={isConfirming}
                                onClick={(event) => {
                                    event.preventDefault()
                                    void handleConfirm()
                                }}
                            >
                                {isConfirming
                                    ? "Deleting..."
                                    : confirmLabel}
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}

export default ConfirmDialog