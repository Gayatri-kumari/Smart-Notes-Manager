import React, { useContext, useRef } from 'react'
import { createPortal } from 'react-dom'
import '../css/modal.css'
import { noteContext } from './contexts/NoteContext'
import { FaRegStar } from 'react-icons/fa'
import { FaStar } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCheckCircle,MdRadioButtonUnchecked } from "react-icons/md";
import { uicontext } from './contexts/UIContext'
import { MdOutlineEdit } from "react-icons/md";

const Noteform = () => { 
    let data=useContext(noteContext)
    const [todoItem,setTodoItem]=React.useState('')
    let {note,noteList,handleNoteModal,handleDrafts,handleNoteChange,handleSubmit,handleCancel,editMode,handleSave,noteRef,markTodoComplete,deleteTodoItem}=data
    let {title,description,category,customCat,imp,altTitle,todoList}=note
    let uiData=useContext(uicontext)
    let {handleModal}=uiData
    let CreateButtonCond=false
    if(title || description || (category=='todo' && todoList.length>0)){
      CreateButtonCond=true
    }
    let saveButtonCond=false
    if(editMode){
    let currentNote=noteList.find(v=>v.id==note.id)
    let todoMatches=currentNote.todoList.length==todoList.length && currentNote.todoList.every((v,i)=>v.text==todoList[i].text && v.completed==todoList[i].completed)
    console.log(todoMatches)
    if(currentNote.title!=title || currentNote.description!=description || 
      currentNote.category!=category || currentNote.customCat!=customCat||
       currentNote.imp!=imp || !todoMatches)
    {
      if(title || description || (category=='todo' && todoList.length>0)){
        saveButtonCond=true
      }
      else{
        saveButtonCond=false
      }
     }
  }
 

// Update the ref every time the note changes

  return createPortal(
    <div className='modalOuter' onClick={editMode?handleNoteModal:handleDrafts}>
      <div className="modalInner"   onClick={(e)=>e.stopPropagation()}>
        <div className="modalHeader">
          <h2>{editMode ? "Edit Note" : "Create Note"}</h2>
          <button className='closeModal' onClick={handleNoteModal}>X</button>
        </div>
        <form>
          <div className='inputFirstRow'>
            
            <input type="text" name="title" value={title} onChange={handleNoteChange} placeholder={`${editMode?altTitle:'title'}`}/>
           <div className='selectAndImp' >
            <div className='selectCategory' >
            <select name='category' title="categories" value={category} onChange={handleNoteChange}
            className={category=="custom"?'customSelect':''}>
                <option value="">Select</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="ideas">Ideas</option>
                <option value="todo">To-Do</option>   
                <option value="custom">Custom</option>
            </select>
            {category=="custom" &&<div className='customCategory' ><input type="text" value={customCat} onChange={handleNoteChange} name="customCat"/></div>} 
              </div>
            <div className='imp' >
              <label >
                {!imp?<FaRegStar/>
                            :
                            <FaStar id='starFilled'
                                    style={{ 
                                    color: "#FFD700",      // Gold fill
                                    stroke: "black",       // Black border
                                    strokeWidth: "30px",   // Thickness of the border
                                    }} 
                            />
                      } 
                <input type="checkbox" onChange={handleNoteChange} name='imp' value={imp} />
              </label>
            </div>
            </div>
          </div>
           {category=="todo"?<> 
           <div className='todoList'>
           
           <div className='todoHeader'>
             <input type='text' name='todoItem' value={todoItem} 
              onChange={(e)=>setTodoItem(e.target.value)}
              placeholder='Enter todo item'/>
              <button  disabled={todoItem.trim()==''} className={`${todoItem.trim()==''?'disable':''}`}
              onClick={(e)=>{e.preventDefault(); 
                  handleNoteChange({target:{name:'todoItem',value:todoItem}});
                  setTodoItem('');}}
                  ><IoMdAdd /></button>
           </div>
           <div className='todoItems'>
              {todoList.length>0 ? 
              todoList.map((v)=><div className='todoItem' key={v.id}>
                <div className={`todoText ${v.completed?'line-through':''}`}>{v.text}</div>
                <div className='todoActions'>
                  {editMode ?<span onClick={()=>markTodoComplete(v.id)}>
                  {v.completed ? <MdCheckCircle title='uncheck'/> : <MdRadioButtonUnchecked title='mark as complete'/>}
                  </span>:
                  <span><MdOutlineEdit /></span>}
                 
                  <span title='delete' onClick={()=>deleteTodoItem(v.id)}>
                     <RiDeleteBin6Line/>
                  </span>
                </div>
              </div>) 
              : <p >No todo items</p>}
           </div>

           </div>
           </>: <textarea name="description"  value={description} onChange={handleNoteChange} id="" placeholder='write your notes here'></textarea>
}
 
          <div className='btns'>
            {
            editMode?
            <> 
            <button className={`${saveButtonCond?'save':'disable'}`} onClick={handleSave} disabled={saveButtonCond==false}>Save</button>
            {/* <button className='cancel' onClick={(e)=>{e.preventDefault()
            handleNoteModal()}}>Discard</button> */}
            </>
            :
            <>
            <button className={`${CreateButtonCond==false?'disable':'submit'}`} onClick={handleSubmit} disabled={CreateButtonCond==false}>Create Note</button>
            {/* <button className='cancel' onClick={handleCancel}>Cancel</button> */}
            </>
            }
            <button className='cancel' onClick={(e)=>{e.preventDefault()
            handleNoteModal()}}>Discard</button>
          </div>
        </form>
      </div>
    </div> 
    ,document.getElementById("modal")
  )
}

export default Noteform
