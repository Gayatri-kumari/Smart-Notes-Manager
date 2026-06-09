import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import '../css/noteview.css' 
import { v4 as idGen} from 'uuid';
import NoteViewMain from './NoteViewMain';
import NoteViewNav from './NoteViewNav';
import { useNavigate, useParams } from 'react-router';
import { uicontext } from './contexts/UIContext';
import Noteform from './Noteform';
import ConfirmModal from './ConfirmModal';
import { noteContext } from './contexts/NoteContext';
export const formatSmartDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  
  // Day with Suffix (1st, 2nd, 3rd, 4th...)
  const day = d.getDate();
  const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];
  
  // Month and Year
  const month = d.toLocaleString('en-IN', { month: 'long' });
  const year = d.getFullYear();
  
  // Time in 12-hour format
  const time = d.toLocaleString('en-IN', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  }).toLowerCase();

  return `${day}${suffix} ${month} ${year} at ${time}`;
};

const NoteView = () => {
  //states
  //states for sidebar category and search
  const [sideBarCategory,setSideBarCategory]=useState('all')
  const [sideBarSearch,setSideBarSearch]=useState('')
  const {handleDrafts,resetNote,noteList,noteRef,markTodoComplete}=useContext(noteContext)
  //state for edit mode
  const [editingMode,setEditingMode]=useState(false)
  //state to handle local changes in edit mode and used in creating new note before actually saving it to the main list
  const [localNote,setLocalNote]=useState({
        id:idGen(),
        title:'',
        altTitle:'',
        description:'',
        category:'',
        imp:false,
        customCat:'',
        draft:false,
        createdAt:new Date(),
        updatedAt:null,
        todoList:[]
      })

  //context data
   
  let {openModal,confirmModal,openConfirm,handleModal}=useContext(uicontext)

  //get selected note id from url
  let parameters=useParams()
  let {id:selectedNoteId}=parameters

  //find the selected note from the list using the id
  let selectedNote=noteList.find(v=>v.id==selectedNoteId)

  //reset edit mode when switching between notes
  useEffect(()=>{
    
    setEditingMode(false)
  },[selectedNoteId])

  //function to check if there are unsaved changes
  // alert(selectedNoteId)
  const calculateDirtyState = (local, selected) => {
    
      return local.title !== selected.title || 
           local.description !== selected.description ||
           local.imp !== selected.imp || 
           local.category !== selected.category || 
           local.customCat !== selected.customCat ||
           JSON.stringify(local.todoList || []) !== JSON.stringify(selected.todoList || [])
    
  }
  let dirtyState = selectedNote?calculateDirtyState(localNote, selectedNote) : false;
  


  let handleLocalNoteChange=(e)=>{
    let {name,value,checked}=e.target
    if(name=='imp')
        {
            setLocalNote({...localNote,[name]:checked})
        }
    else{
        setLocalNote({
            ...localNote,
            [name]:value
        })
        }
  }

 

  let resetLocalNote=()=>{
    setLocalNote({
        id:idGen(),
        title:'',
        altTitle:'',
        description:'',
        category:'',
        imp:false,
        customCat:'',
        draft:false,
        createdAt:new Date(),
        updatedAt:null,
        todoList:[]
      })
  }

  // Wrap handleDiscard in useCallback so it doesn't change on every render
  const handleDiscard = useCallback((onDiscardComplete = () => {}) => {
    console.log(localNote)
    console.log(selectedNote)
    if(dirtyState) {
      console.log(dirtyState)
      openConfirm({
        title:'Discard Changes ?',
        message:"You have unsaved changes in this note . Are you sure you want to exit ? Your progress will be lost",
        type:"warning",
        confirmText:"Discard",
        cancelText:'Keep Editing',
      }, () => {
        resetLocalNote()
        setEditingMode(p => !p)
        onDiscardComplete()
      })
    }
    else {
      resetLocalNote()
      setEditingMode(p => !p)
      onDiscardComplete()
    }
  }, [dirtyState, openConfirm, resetLocalNote, setEditingMode])

// useEffect(()=>{
//   return()=>{
//     if(openModal)
//     {
//       handleDrafts()
//     }
//     setEditingMode(false)
//     resetLocalNote()
//    }
// },
// [window.location.pathname])



useEffect(() => {
  // 1. Determine if we should even set the trap
  const isProtected = (editingMode && dirtyState) || openModal;
  if (!isProtected) return;

  const handleBrowserBack = (e) => {
    // 2. YANK back to current URL
    window.history.pushState(null, '', window.location.pathname);

    // 3. Access the LIVE data from the Ref
    const { title, description } = noteRef.current;
    const hasContent = title.trim() !== '' || description.trim() !== '';

    if (openModal) {
      if (hasContent) {
        // alert("You have unsaved changes. Please save or discard your note before leaving.");
        handleDrafts(); // Saves the live content
      } else {
        handleModal(); // Just close it
        resetNote();
      }
    } else if (editingMode && dirtyState) {
      handleDiscard(() => {
        // Remove listener so we don't trap the ACTUAL back action
        window.removeEventListener('popstate', handleBrowserBack);
        window.history.back(); 
      });
    }
  };

  // 4. Set the initial trap
  window.history.pushState(null, '', window.location.pathname);
  window.addEventListener('popstate', handleBrowserBack);

  return () => {
    window.removeEventListener('popstate', handleBrowserBack);
  };
}, [editingMode, dirtyState, openModal]); // Ref doesn't need to be here

 return (<>
    <div className='noteview'>
      <NoteViewNav sideBarCategory={sideBarCategory} 
      setSideBarCategory={setSideBarCategory} 
      selectedNoteId={selectedNoteId}
      sideBarSearch={sideBarSearch} 
      editingMode={editingMode}
      dirtyState={dirtyState}
      handleDiscard={handleDiscard}
      setSideBarSearch={setSideBarSearch}/>
      
      <NoteViewMain editingMode={editingMode} selectedNoteId={selectedNoteId} 
      localNote={localNote} setLocalNote={setLocalNote} 
      setEditingMode={setEditingMode} 
      handleLocalNoteChange={handleLocalNoteChange}
      resetLocalNote={resetLocalNote}
      handleDiscard={handleDiscard}
      markTodoComplete={markTodoComplete}/>
   
    </div>
    {openModal==true && <Noteform/>}
    {confirmModal.show&&<ConfirmModal/>}
    </>
  )
}

export default NoteView

