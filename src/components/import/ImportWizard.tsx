import { useState, useCallback } from 'react'
import { useFileImport } from '../../hooks/useFileImport'
import { FileUploader } from './FileUploader'
import { ValidationReport } from './ValidationReport'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface ImportWizardProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportWizard({ isOpen, onClose }: ImportWizardProps) {
  const [step, setStep] = useState<'upload' | 'review'>('upload')
  const { importFromFile, importFromText, acceptImport, cancelImport, importResult, isImporting } = useFileImport()

  const handleFileSelect = useCallback(async (file: File) => {
    await importFromFile(file)
    setStep('review')
  }, [importFromFile])

  const handleTextPaste = useCallback(async (text: string) => {
    await importFromText(text)
    setStep('review')
  }, [importFromText])

  const handleAccept = useCallback(() => {
    acceptImport()
    onClose()
    setStep('upload')
  }, [acceptImport, onClose])

  const handleCancel = useCallback(() => {
    cancelImport()
    setStep('upload')
  }, [cancelImport])

  const handleClose = useCallback(() => {
    cancelImport()
    onClose()
    setStep('upload')
  }, [cancelImport, onClose])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Configuration">
      {step === 'upload' && (
        <FileUploader
          onFileSelect={handleFileSelect}
          onTextPaste={handleTextPaste}
          isLoading={isImporting}
        />
      )}

      {step === 'review' && importResult && (
        <div className="space-y-6">
          <ValidationReport result={importResult} />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            {importResult.success && (
              <Button variant="primary" onClick={handleAccept}>
                {importResult.schemaWarnings?.length
                  ? 'Import with Warnings'
                  : 'Import'}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
