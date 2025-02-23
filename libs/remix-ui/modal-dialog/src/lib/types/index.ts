export type ValidationResult = {
  valid: boolean,
  message?: string
}

/* eslint-disable no-undef */
export interface ModalDialogProps {
  id: string
  timestamp?: number,
  title?: string | JSX.Element,
  validation?: ValidationResult
  validationFn?: (value: any) => ValidationResult
  message?: string | JSX.Element,
  okLabel?: string | JSX.Element,
  okFn?: (value?:any) => void,
  cancelLabel?: string | JSX.Element,
  cancelFn?: () => void,
  modalClass?: string,
  showCancelIcon?: boolean,
  hide?: boolean,
  handleHide: (hideState?: boolean) => void,
  children?: React.ReactNode,
  resolve?: (value?:any) => void,
  next?: () => void,
  data?: any
}
