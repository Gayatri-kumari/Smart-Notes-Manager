import React, { useContext } from 'react'
import { noteContext } from './contexts/NoteContext'
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { categoryIcons } from './NoteDisplay';
import { uicontext } from './contexts/UIContext';
import { formatSmartDate } from './NoteView';

const ReadOnlyMode = (props) => {
   
  let {selectedNote,finalCategory,displayTitle,handelEditingMode,deleteNote,handleImp,markTodoComplete}=props
  let {theme,openConfirm}=useContext(uicontext)
  let strokeColor=theme=='dark'?'white':'black'
  let {id,title, altTitle,description,category,imp,customCat,draft,createdAt,updatedAt,todoList}=selectedNote
   return (
    <div className='noteMain' >
              <div className='header' >
                <div className='titleMetaData'>
                  <h1>{displayTitle}</h1>
                  <div className='meta'>
                    <div className={`category ${finalCategory}`}>
                      <span>{categoryIcons[finalCategory]}</span>
                      {finalCategory=='custom'?customCat:finalCategory}
                    </div>
                    <span className='doc'>
                      <span>Created : {formatSmartDate(createdAt)}</span>
                      {updatedAt && <span className='updatedAt'>Last Updated: {formatSmartDate(updatedAt)}</span> }
                    </span>
                  </div>
                </div>
                <div className='noteIcons'>
                  <span className={`${imp ? 'active':''}`} onClick={()=>handleImp(id)}>{!imp?<FaRegStar />:
                                                  <FaStar 
                                                      style={{ 
                                                      color: "#FFD700",      // Gold fill
                                                      stroke: `${strokeColor}`,       // Black border
                                                      strokeWidth: "20px",   // Thickness of the border
                                                       }} 
                                                  />}
                  </span>
                  <span onClick={handelEditingMode}>
                    <MdOutlineEdit/>
                  </span>
                  <span onClick={()=>openConfirm({
                    title:'Delete note ?',
                    message:"Your note will be permanently deleted and cannot be recovered",
                    type:"danger",
                    confirmText:"Delete",
                    cancelText:'Cancel',
                  },()=>deleteNote(id))}><RiDeleteBin6Line/></span>

                </div>
              </div>
               
              <div className='noteBody'>
                {
                 category=='todo' ? todoList.map((v)=>{
                    return(
                      <div key={v.id} className='todoItem'>
                        <span className={`todoCircle ${v.completed?'done':''}`} onClick={()=>markTodoComplete(v.id,id)}/>
                        <span className={v.completed?'strikethrough':''}>{v.text}</span>

                      </div>
                    )
                  }
                  )
                

    :<p>{description}</p>
                }
              </div>
          </div>
  )
}

export default ReadOnlyMode
