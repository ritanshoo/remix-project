import React, { ChangeEventHandler, useContext, useEffect, useRef, useState } from 'react' // eslint-disable-line
import { FormattedMessage, useIntl } from 'react-intl'
import { PermissionHandlerProps } from '../interface'
import './permission-dialog.css'

const PermissionHandlerDialog = (props: PermissionHandlerProps) => {
  const { from, to, remember, method, message, sensitiveCall } = props.value
  const [feedback, setFeedback] = useState<string>('')
  const theme = props.theme
  const intl = useIntl()

  const switchMode = (e: any) => {
    props.plugin.switchMode(from, to, method, e.target.checked)
  }

  const rememberSwitch = () => {
    return <input type="checkbox" onChange={switchMode} className='form-check-input' id='remember' data-id={remember ? 'permissionHandlerRememberChecked' : 'permissionHandlerRememberUnchecked'}/>
  }
  const reset = () => {
    props.plugin.clear()
    setFeedback(intl.formatMessage({ id: 'permissionHandler.allPermissionsReset' }))
  }

  const imgFrom = () => { return <img className={`${theme === 'dark' ? 'invert' : ''}`} alt='' id='permissionModalImagesFrom' src={from.icon} /> }
  const imgTo = () => { return <img className={`${theme === 'dark' ? 'invert' : ''}`} alt='' id='permissionModalImagesTo' src={to.icon} /> }
  const pluginsImages = () => {
    return (
      <article className='images'>
        {imgFrom()}
        <i className="fas fa-arrow-right"></i>
        {imgTo()}
      </article>
    )
  }

  const text = () => {
    return <FormattedMessage id='permissionHandler.permissionHandlerMessage' values={{ from: from.displayName, to: to.displayName, method, rememberText: remember ? intl.formatMessage({ id: 'permissionHandler.rememberText' }) : '' }} />
  }

  const pluginMessage = () => {
    return message
      ? <div>
        <h6><FormattedMessage id='permissionHandler.description' /></h6>
        <p>{message}</p>
      </div> : null
  }

  return (<section className="permission">
    {pluginsImages()}
    <article>
      <h4 data-id="permissionHandlerMessage">{text()} :</h4>
      <h6>{from.displayName}</h6>
      <p> {from.description || <i><FormattedMessage id='permissionHandler.noDescriptionProvided' /></i>}</p>
      <h6>{to.displayName} :</h6>
      <p> {to.description || <i><FormattedMessage id='permissionHandler.noDescriptionProvided' /></i>}</p>
      {pluginMessage()}
      { sensitiveCall ? <p className='text-warning'><i className="fas fa-exclamation-triangle mr-2" aria-hidden="true"></i><FormattedMessage id='permissionHandler.makeSureYouTrustThisPlugin' /></p> : '' }
    </article>
    <article className='remember'>
      { !sensitiveCall && <div className='form-check'>
        {rememberSwitch()}
        <label htmlFor='remember' className="form-check-label" data-id="permissionHandlerRememberChoice"><FormattedMessage id='permissionHandler.rememberThisChoice' /></label>
        </div>
      }
      <button className="btn btn-sm" onClick={reset}><FormattedMessage id='permissionHandler.resetAllPermissions' /></button>
    </article>
    <div>{feedback}</div>
  </section>)
}

export default PermissionHandlerDialog
