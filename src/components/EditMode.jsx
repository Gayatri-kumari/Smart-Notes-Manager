import React, { useContext, useState } from 'react'
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { uicontext } from './contexts/UIContext';
import { noteContext } from './contexts/NoteContext';
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCheckCircle,MdRadioButtonUnchecked } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { v4 as idGen } from 'uuid';

const EditMode = (props) => {
    let {theme,openConfirm}=useContext(uicontext)
    let {localNote,handleLocalNoteChange,handleImp,handleLocalNoteSave,handleDiscard,selectedNote}=props
    
    const [todoItem,setTodoItem]=useState('')
    const [todoSelectedForEdit,setToDoSelectedForEdit]=useState({})
    const [todoEdited,setToDoEdited]=useState('')
    const [todoEditMode,setTodoEditMode]=useState(false)
    
    console.log(localNote)
    let {id,title, altTitle,description,category,imp,customCat,draft,createdAt,todoList=[]}=localNote
    let strokeColor=theme=='dark'?'white':'black'
    
    const commitTodoEdit=()=>{
        if(!todoEditMode || !todoSelectedForEdit?.id) return
        const trimmedText = todoEdited.trim()
        if(trimmedText && trimmedText !== todoSelectedForEdit.text){
            const newTodoList = todoList.map((v)=>{
                if(v.id===todoSelectedForEdit.id){
                    return {...v,text:trimmedText}
                }
                return v
            })
            handleLocalNoteChange({target:{name:'todoList',value:newTodoList}})
        }
        setTodoEditMode(false)
        setTodoEdited('')
        setToDoSelectedForEdit({})
    }
    
    const handleAddTodoItem=(e)=>{
        e.preventDefault()
        if(todoItem.trim()){
            const newTodoList = [...todoList, {id:idGen(), text:todoItem, completed:false}]
            handleLocalNoteChange({target:{name:'todoList',value:newTodoList}})
            setTodoItem('')
        }
    }
    
    const handleDeleteTodo=(todoId)=>{
        const newTodoList = todoList.filter(v=>v.id!==todoId)
        handleLocalNoteChange({target:{name:'todoList',value:newTodoList}})
    }
    
    const handleMarkComplete=(todoId)=>{
        const newTodoList = todoList.map(v=>{
            if(v.id===todoId){
                return {...v, completed:!v.completed}
            }
            return v
        })
        handleLocalNoteChange({target:{name:'todoList',value:newTodoList}})
    }
    
    const handleTodoItemSave=(todoId,todoEdited)=>{
        const newTodoList = todoList.map((v)=>{
            if(v.id==todoId){
                return {...v,text:todoEdited}
            }
            return v
        })
        handleLocalNoteChange({target:{name:'todoList',value:newTodoList}})
        setTodoEditMode(false)
        setTodoEdited('')
        setToDoSelectedForEdit({})
    }
    
    let saveButtonCond=false
    if(title!=selectedNote.title || description!=selectedNote.description ||
       category!=selectedNote.category || customCat!=selectedNote.customCat || imp!=selectedNote.imp ||
       JSON.stringify(todoList) !== JSON.stringify(selectedNote.todoList || [])){
       if(title || description || (category=='todo' && todoList.length>0)){
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
        {category=='todo' ? <>
        <div className='todoList'>
            <div className='todoHeader'>
                <input type='text' name='todoItem' value={todoItem} 
                    onChange={(e)=>setTodoItem(e.target.value)}
                    placeholder='Enter todo item'/>
                <button disabled={todoItem.trim()==''} className={`${todoItem.trim()==''?'disable':''}`}
                    onClick={handleAddTodoItem}><IoMdAdd /></button>
            </div>
            <div className='todoItems'>
                {todoList.length>0 ? 
                todoList.map((v)=><div className='todoItem' key={v.id}>
                    {todoEditMode && todoSelectedForEdit.id==v.id ? <input type='text' value={todoEdited}  
                        onChange={(e)=>setToDoEdited(e.target.value)}
                        onBlur={commitTodoEdit}
                        className='todoTextEditMode'/>
                    :<div className={`todoText ${v.completed?'line-through':''}`}>{v.text}</div>  
                    }
                    <div className='todoActions'>
                        <span onClick={()=>handleMarkComplete(v.id)}>
                            {v.completed ? <MdCheckCircle title='uncheck'/> : <MdRadioButtonUnchecked title='mark as complete'/>}
                        </span>
                        <span onClick={() => {
                            if(todoEditMode && todoSelectedForEdit?.id && todoSelectedForEdit.id !== v.id){
                                commitTodoEdit()
                            }
                            if(!todoEditMode || todoSelectedForEdit?.id !== v.id){
                                setToDoEdited(v.text)
                                setToDoSelectedForEdit(v)
                                setTodoEditMode(true)
                            }
                        }}>
                            {todoEditMode && v.id==todoSelectedForEdit.id ? <FaSave disabled={todoEdited.trim()===''} onClick={(e)=>{e.stopPropagation(); handleTodoItemSave(v.id,todoEdited)}}/> : <MdOutlineEdit />}
                        </span>
                        <span title='delete' onClick={()=>handleDeleteTodo(v.id)}>
                            <RiDeleteBin6Line/>
                        </span>
                    </div>
                </div>)
                : <p>No todo items</p>}
            </div>
        </div>
        </> : 
        <textarea name='description' value={description} onChange={handleLocalNoteChange} placeholder='write your notes here'></textarea>
        }
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
