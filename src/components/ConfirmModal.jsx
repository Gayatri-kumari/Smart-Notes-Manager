import React, { useContext } from 'react'
import { createPortal } from 'react-dom'
import '../css/confirm.css'
import { uicontext } from './contexts/UIContext'
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiAlertTriangle } from "react-icons/fi";


const ConfirmModal =  () => {
    const {confirmModal,handleCancel,actionOnConfirm,handleOverlayClick,shake,modalState}=useContext(uicontext)
    const{title,message,type,confirmText,cancelText}=confirmModal
     
  return createPortal(
    <div className={`outerDiv`} onClick={handleOverlayClick}>
        <div className={`innerDiv ${shake?'shake':''} ${modalState.closing?'fadeOut':''} ${modalState.opening?'fadeIn':''}`} onClick={(e)=>e.stopPropagation()}>
            <div className={`icon ${type}`}>{type=='danger'&&<RiDeleteBin5Line/> || type=='warning'&&<FiAlertTriangle/>}

            </div>
            <h1>{title}</h1>
            <p>{message}</p>
            <div className='actions'>
                <button className='cancel' onClick={handleCancel}>{cancelText}</button>
                <button className={type} onClick={actionOnConfirm}>{confirmText}</button>
            </div>
        </div>
      
    </div>
  ,document.getElementById('confirmModal'))
}

export default ConfirmModal
