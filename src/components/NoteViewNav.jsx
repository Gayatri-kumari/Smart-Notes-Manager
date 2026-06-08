import React, { useContext, useRef } from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { noteContext } from './contexts/NoteContext';
import { GoMoon } from 'react-icons/go';
import { IoSunnyOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router';
import { categoryIcons } from './NoteDisplay';
import { categories } from './NoteDisplay';
import { uicontext } from './contexts/UIContext';
import { highlightText } from './SearchModal';
import { IoMdMenu } from "react-icons/io";

const NoteViewNav = (props) => {
  const {noteList}=useContext(noteContext)
  const {handleTheme,theme,handleModal,isSidebarOpen,handleSidebarToggle}=useContext(uicontext)
  const navigate=useNavigate()
  let {sideBarCategory,setSideBarCategory,
    selectedNoteId,sideBarSearch,dirtyState,
    setSideBarSearch,editingMode,handleDiscard}=props

  let search=sideBarSearch.toLowerCase()
  let searchResult=noteList.filter((v)=>{ 
    let todoTextsMatch=v.todoList.some(todo=>todo.text.toLowerCase().includes(search))
    return v.title.toLowerCase().includes(search) || v.altTitle.toLowerCase().includes(search) || v.description.toLowerCase().includes(search) || todoTextsMatch  
 
  })
  let arrayToFilterBasedOnCat=!sideBarSearch.trim() ? noteList : searchResult
  let filteredNotes=arrayToFilterBasedOnCat.filter((v)=>{
        if (sideBarCategory=='all') return true
        if(sideBarCategory=='important') return v.imp && !v.draft
        if(sideBarCategory=='drafts') return v.draft
        if(sideBarCategory=='uncategorised') return !v.draft && (v.category=='' || (v.category=='custom' && v.customCat==''))
        if(sideBarCategory=='custom') return v.category=='custom' && !v.draft && v.customCat
        return sideBarCategory==v.category && !v.draft
  })

  return (
    <>
       <section>
            <div className='icons'>
              <div className='toggle' onClick={handleSidebarToggle}><IoMdMenu /></div>
             <div onClick={()=>{
               if(!editingMode || !dirtyState)
                { 
                  navigate('/')
                }
                else{
                  handleDiscard(() => navigate('/'))
                }
              
             
             }
             }><IoHomeOutline /></div> 
             <div onClick={handleTheme}>{theme=='dark'?<IoSunnyOutline />:<GoMoon />}</div>
            </div>
            <div className={`sidebar ${isSidebarOpen?'open':''}`} onClick={handleSidebarToggle}>
              <div className="sidebarContents" onClick={(e)=>e.stopPropagation()}>
            <div className='actions'>
                <h2>My Notes</h2> 
                <div className='addNote'> 
                    <button onClick={()=>{
                      if(isSidebarOpen) handleSidebarToggle()
                       handleModal()
                    }}><IoAddSharp /></button> 
                </div>
            </div>
             <input value={sideBarSearch} onChange={(e)=>setSideBarSearch(e.target.value)}
  type="text"
  placeholder="Search notes..."
  className="sidebarSearch"
/>

            <div className='noteCards'>
              
              { filteredNotes.length>0 ? 
              filteredNotes.map((note)=>{

                let finalCategory =
                (!note.category?.trim() || (note.category === 'custom' && note.customCat === ''))
                    ? 'uncategorised'
                    : note.category === 'custom'
                    ? 'custom'
                    : note.category

                let displayTitle=!note.title.trim()?note.altTitle:note.title
                
                return(
                <div className={`note ${note.draft?'noteDraft':''} ${selectedNoteId==note.id?'current':''}`} 
                key={note.id} 
                onClick={
                  ()=>{
                      if(isSidebarOpen) handleSidebarToggle()
                      if(!editingMode || !dirtyState)
                      {
                        navigate(`/note/${note.id}`)
                      }
                      else{
                        handleDiscard(() => navigate(`/note/${note.id}`))
                      }
                  }
                  
                  // ()=>navigate(`/note/${note.id}`)
                  }  > 
                {note.draft && <span className="draftBadge"><span className="dot"></span> Draft</span>}
 
                <div className="topRow">
                  
                    <h4>{highlightText(sideBarSearch,displayTitle)}</h4>
                    <span>{note.imp &&  <FaStar 
                                 style={{ 
                                  color: "#FFD700",      // Gold fill
                                   stroke: "black",       // Black border
                                   strokeWidth: "30px",   // Thickness of the border
                                 }} 
                              />}</span>
                </div>
                {note.todoList.length>0 ? <div className='todoPreview'>
                        {
                        note.todoList.slice(0,2).map((v)=> (
                            <div key={v.id} className='todoPreviewItem'>
                                <span className={`previewCircle ${v.completed?'done':''}`}/>
                                <span className={v.completed?'strikethrough':''}>{highlightText(sideBarSearch, v.text)}</span>
                            </div>
                        ))
                      }
                        {note.todoList.length > 2 && <span className='moreItems'>+{note.todoList.length-2} more</span>}
                        </div>
                   :<p>{highlightText(sideBarSearch,note.description)}</p>}
                
               
                <div className="meta">
                  <div className={`category ${finalCategory}`}>
                    <span className="catIcon">
                      {categoryIcons[finalCategory]}
                    </span>
                    {
                     finalCategory=='custom'?note.customCat:finalCategory
                    }

                  </div>
                   
                  <div className="date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
                </div>
                )
              }):<div className="emptyState">
    {sideBarSearch.trim()?"No matching notes found":'No saved notes in this category'}
  </div>
            }
            </div>
            <div className='categoriesFilter'>
              <h3>Categories</h3>
              <div className='categories'>
              {categories.map((v)=>{
                return(<div key={v} className={`categoryPill ${sideBarCategory==v&&'active'}`} onClick={()=>setSideBarCategory(v)}> {v} </div>)})}
              </div>
            </div>
           </div>
           </div>
          </section>
    </>
  )
}

export default NoteViewNav
