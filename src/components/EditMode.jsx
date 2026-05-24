import React, { useContext } from 'react'
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { uicontext } from './contexts/UIContext';
import { noteContext } from './contexts/NoteContext';
const EditMode = (props) => {
    let {theme,openConfirm}=useContext(uicontext)
    let {localNote,handleLocalNoteChange,handleImp,handleLocalNoteSave,handleDiscard,selectedNote}=props
    console.log(localNote)
    let {id,title, altTitle,description,category,imp,customCat,draft,createdAt}=localNote
    let strokeColor=theme=='dark'?'white':'black'
    let saveButtonCond=false
    if(title!=selectedNote.title || description!=selectedNote.description ||
       category!=selectedNote.category || customCat!=selectedNote.customCat || imp!=selectedNote.imp){
       if(title || description){
        saveButtonCond=true
      }
      else{
        saveButtonCond=false
      }
    }
    return (
    <div className="editMain">
        <div className="editingIndicator">
        <span className="pulseDot"></span>
        Editing
        </div>

       <form>
        <div className='topRow'>
        <input type='text' name='title' value={title} placeholder={altTitle} onChange={handleLocalNoteChange} className='title'/>
        <label>
        <input type="checkbox" name='imp' value={imp} onChange={handleLocalNoteChange}/>
        <span className={`EditImp ${imp ? 'active':''}`} 
         >
          {!imp?<FaRegStar />:<FaStar  style={{ 
                                               color: "#FFD700",      // Gold fill
                                               stroke: `${strokeColor}`,       // Black border
                                               strokeWidth: "20px",   // Thickness of the border
                                              }} 
                              />}
       </span>
        </label>
        
        </div>
        
        <div className={`categoryDiv ${category==="custom"?'withCustomCat':''}`}>
            <select className={`${category==="custom"?'selectwithCustomCat':''}`}
            name='category' title="categories" value={category} onChange={handleLocalNoteChange}>
                <option value="">Select</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="ideas">Ideas</option>
                <option value="todo">To-Do</option>
                <option value="custom">Custom</option>
            </select>
         {category=='custom' &&<input type='text' name='customCat' value={customCat} onChange={handleLocalNoteChange} placeholder={!customCat?'uncategorised':''}/>}

        </div>
           <textarea name='description' value={description} onChange={handleLocalNoteChange}>
            
        </textarea>
        <div className='btns'>
        <button className={`${saveButtonCond?'save':'disable'}`} onClick={handleLocalNoteSave} disabled={!saveButtonCond}>Save</button>
        <button className='cancel' onClick={(e)=>
        { e.preventDefault()
          handleDiscard()
        }}>Discard</button>
        </div>
        
       </form>
       
    </div>
  )
}

export default EditMode
