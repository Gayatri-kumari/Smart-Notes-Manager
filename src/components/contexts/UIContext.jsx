import React, { createContext,useContext,useRef,useState } from 'react'

export const uicontext=createContext()
const UIContext = (props) => {
      
    const [theme,setTheme]=useState('dark')
    const [searchmodal,setSearchModal]=useState(false)
    const [openModal,setOpenModal]=useState(false)
    const [todoEditMode,setToDoEditMode]=useState(false)
    const toggleToDoEditMode=(value)=>{
        if(typeof value === 'boolean'){
            setToDoEditMode(value)
        } else {
            setToDoEditMode(prev=>!prev)
        }
    }
    const [confirmModal,setConfirmModal]=useState({
        show:false,
        title:'',
        message:"",
        type:"",
        confirmText:"",
        cancelText:'',
        onConfirm:null
    })
    const [modalState,setModalState]=useState({
        opening:false,
        closing:false
    })
    const [shake,setShake]=useState(false)
    const [isSidebarOpen,setIsSidebarOpen]=useState(false)
    const handleSidebarToggle=()=>{
        setIsSidebarOpen(prev=>!prev)
    }

    const handleOverlayClick = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
    }
    let openConfirm=(data,fn)=>{
        setConfirmModal({...confirmModal,...data,show:true,onConfirm:fn})
        setModalState({opening:true,closing:false})
        setTimeout(()=>{
            setModalState({opening:false,closing:false})
        },200)
    }
    let actionOnConfirm=()=>{
        console.log(confirmModal.onConfirm)
        handleCancel()
        if(confirmModal.onConfirm)
        {
            setTimeout(()=>{confirmModal.onConfirm()},200)
        }
       
    }
    let handleCancel=()=>{
        setModalState({opening:false,closing:true})
        setTimeout(()=>{
            setConfirmModal({
            show:false,
            title:'',
            message:"",
            type:"",
            confirmText:"",
            cancelText:'',
            onConfirm:null
            })
            setModalState({opening:false,closing:false})
        },200)
        
    }
    console.log(confirmModal)
     let handleModal=()=>{
        setOpenModal(prev=>!prev) 
    }

    let handleSearchModal=()=>{
       // console.log("search modal")
        setSearchModal(prev=>!prev)
         
        
    }
    let handleTheme=()=>{
    const rootEle=document.documentElement.classList;
     
         if(rootEle.contains("dark"))
    {
        rootEle.remove('dark')
        setTheme('')
        
    }
    else{
        rootEle.add('dark')
        setTheme('dark')
    }
    }

 
  return (
     <uicontext.Provider value={{theme,handleTheme,searchmodal,
     handleSearchModal,modal,handleModal,openModal,confirmModal,
     openConfirm,handleCancel,actionOnConfirm,handleOverlayClick,
     shake,modalState,isSidebarOpen,handleSidebarToggle,
     toggleToDoEditMode,todoEditMode}}>
     {props.children}
     </uicontext.Provider>
  )
}

export default UIContext
