import React, { useContext } from 'react'
import { noteContext } from './contexts/NoteContext'
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { categoryIcons } from './NoteDisplay';
import { uicontext } from './contexts/UIContext';
import EditMode from './EditMode';
import ReadOnlyMode from './ReadOnlyMode';
const NoteViewMain = (props) => {
  let {editingMode,selectedNoteId,localNote,setLocalNote,setEditingMode,handleLocalNoteChange,resetLocalNote,handleDiscard}=props
  let noteData=useContext(noteContext)
  let {noteList,handleImp,deleteNote,setNoteList}=noteData
  
  let selectedNote=noteList.find(v=>v.id==selectedNoteId)
  
  let handleLocalNoteSave=(e)=>{
    e.preventDefault()
    let updatedList=noteList.map(v=>{
      if(v.id==selectedNoteId)
        {
          return {...localNote,draft:false,updatedAt:new Date()}
        }
      return v
    })
    setNoteList(updatedList)
    resetLocalNote()
    setEditingMode(prev=>!prev)
    
  }
  
 
  
  
  if(!selectedNote)
  {
    return (
      <main className='fullViewEmptyState'>
        <div className="emptyState" >
          <p>This note is no longer available.</p>
        </div>
      </main>
    )
  }
  let {category,title,altTitle,customCat}=selectedNote
  let handelEditingMode=()=>{
    setEditingMode(!editingMode)
    setLocalNote(selectedNote)
  }
  let finalCategory =
            (!category?.trim() || 
            (category === 'custom' && !customCat?.trim()))
              ? 'uncategorised'
              : category
  let displayTitle=title.trim()==''?altTitle:title
 
  console.log(selectedNote)
  return (
       
        <main>
          {editingMode?
          <EditMode 
          finalCategory={finalCategory} 
          displayTitle={displayTitle} 
          localNote={localNote} 
          handleLocalNoteChange={handleLocalNoteChange} 
          handleImp={handleImp}
          handleDiscard={handleDiscard} 
          handleLocalNoteSave={handleLocalNoteSave}
          selectedNote={selectedNote} />
          :
          <ReadOnlyMode selectedNote={selectedNote} finalCategory={finalCategory} displayTitle={displayTitle} handelEditingMode={handelEditingMode} deleteNote={deleteNote} handleImp={handleImp}/>}
        </main>
       
  )
}

export default NoteViewMain


