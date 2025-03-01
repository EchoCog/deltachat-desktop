import React, { useState, useEffect, useCallback } from 'react'

import { DeltaProgressBar } from '../Login-Styles'
import { runtime } from '@deltachat-desktop/runtime-interface'
import { getLogger } from '../../../../shared/logger'
import { BackendRemote } from '../../backend-com'
import { selectedAccountId } from '../../ScreenController'
import SettingsButton from './SettingsButton'
import Dialog, {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FooterActionButton,
  FooterActions,
} from '../Dialog'
import useTranslationFunction from '../../hooks/useTranslationFunction'
import useDialog from '../../hooks/dialog/useDialog'
import useConfirmationDialog from '../../hooks/dialog/useConfirmationDialog'

import type { DcEventType } from '@deltachat/jsonrpc-client'
import { LastUsedSlot, rememberLastUsedPath } from '../../utils/lastUsedPaths'
import { RuntimeOpenDialogOptions } from '@deltachat-desktop/shared/shared-types'
import { DialogProps } from '../../contexts/DialogContext'

const log = getLogger('renderer/Settings/Backup')

export default function Backup() {
  const tx = useTranslationFunction()
  const accountId = selectedAccountId()
  const { openDialog, closeDialog } = useDialog()
  const openConfirmationDialog = useConfirmationDialog()

  const onBackupExport = useCallback(async () => {
    const userFeedback = window.__userFeedback

    const confirmed = await openConfirmationDialog({
      message: tx('pref_backup_export_explain'),
      confirmLabel: tx('ok'),
    })

    if (confirmed) {
      const { defaultPath, setLastPath } = rememberLastUsedPath(
        LastUsedSlot.Backup
      )
      const opts: RuntimeOpenDialogOptions = {
        title: tx('export_backup_desktop'),
        defaultPath,
        buttonLabel: tx('save'),
        properties: ['openDirectory', 'createDirectory'],
      }
      const [destination] = await runtime.showOpenFileDialog(opts)
      if (!destination) {
        return
      }
      setLastPath(destination)

      const listenForOutputFile = ({
        path: filename,
      }: DcEventType<'ImexFileWritten'>) => {
        userFeedback({
          type: 'success',
          text: tx('pref_backup_written_to_x', filename),
        })
      }

      const emitter = BackendRemote.getContextEvents(selectedAccountId())
      emitter.once('ImexFileWritten', listenForOutputFile)

      const dialogId = openDialog(ExportProgressDialog)
      try {
        await BackendRemote.rpc.exportBackup(accountId, destination, null)
      } catch (error) {
        // TODO/QUESTION - how are errors shown to user?
        log.error('backup-export failed:', error)
      } finally {
        emitter.off('ImexFileWritten', listenForOutputFile)
        closeDialog(dialogId)
      }
    }
  }, [accountId, closeDialog, openConfirmationDialog, openDialog, tx])

  return (
    <SettingsButton onClick={onBackupExport}>
      {tx('export_backup_desktop')}
    </SettingsButton>
  )
}

function ExportProgressDialog({ onClose }: DialogProps) {
  const tx = useTranslationFunction()
  const [progress, setProgress] = useState(0.0)

  const onImexProgress = ({ progress }: DcEventType<'ImexProgress'>) => {
    setProgress(progress)
  }
  const accountId = selectedAccountId()

  const cancel = () => {
    BackendRemote.rpc.stopOngoingProcess(accountId).then(onClose)
  }

  useEffect(() => {
    const emitter = BackendRemote.getContextEvents(accountId)
    emitter.on('ImexProgress', onImexProgress)
    return () => {
      emitter.off('ImexProgress', onImexProgress)
    }
  }, [accountId])

  return (
    <Dialog onClose={() => {}} canOutsideClickClose={false}>
      <DialogHeader title={tx('export_backup_desktop')} />
      <DialogBody>
        <DialogContent>
          <DeltaProgressBar progress={progress} />
        </DialogContent>
        <DialogFooter>
          <FooterActions align='end'>
            <FooterActionButton onClick={cancel}>
              {tx('cancel')}
            </FooterActionButton>
          </FooterActions>
        </DialogFooter>
      </DialogBody>
    </Dialog>
  )
}
