 import React, { useContext,useEffect,useRef } from 'react'
import { createPortal } from 'react-dom'
import '../css/searchmodal.css'
import { noteContext } from './contexts/NoteContext'
import { IoIosSearch } from "react-icons/io";
import { searchContext } from './contexts/SearchContext';
import { uicontext } from './contexts/UIContext';
import { FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { categoryIcons } from './NoteDisplay';
import { useNavigate } from 'react-router';
export const highlightText = (search,text) => {
    if (!search) return text
    const parts = text.split(new RegExp(`(${search})`, "gi"))
    // console.log(parts)
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase()
        ? <mark key={index}>{part}</mark>
        : part
    )
}
const SearchModal = () => {
  let uiData=useContext(uicontext)
  let searchData=useContext(searchContext)
  let noteData=useContext(noteContext)
  let {handleSearchModal}=uiData
  let {search,resultList,handleSearchContent,searchmodal,openSearchNote,recentSearch,removeFromRecent,handleModalClosing}=searchData
  let untitledCount = 0
 

//to get the input field of the search form focussed when opened
let searchRef=useRef(null)
useEffect(()=>{
  searchRef.current?.focus()
})
let navigate=useNavigate()

return createPortal(
     <div className="outerSearchModal" id="outer"  onClick={handleModalClosing}>
      <div className="innerSearchModal" onClick={(e)=>e.stopPropagation()}>
        <form onSubmit={(e)=>e.preventDefault()}>
          <div className='searchNav'>
            <input type="text" ref={searchRef} name="search" value={search} placeholder='search notes' onChange={handleSearchContent}/>
            <button type='reset' className='close' onClick={handleModalClosing}>close</button>
          </div>
        </form>
        <div className='searchResult'>
            { search==''? (
              <div className='recentDiv'>
                <h2>RECENT</h2>
                {recentSearch.length==0 ?
                <>
                <h3>No recent searches</h3>
                </>
                :(
               <div className="recentList">
                  {recentSearch.map(v => (
                    <div className="recentItem" key={v.id} onClick={() => {
                      openSearchNote(v.id)
                      navigate(`/note/${v.id}`)
                      handleModalClosing()
                      }}>
                      <span className="icon">⏱</span>
                      <div className='main'>
                        <p className="title">{!v.title?v.altTitle:v.title}</p>
                        <p className="desc">{v.description.slice(0, 40)}</p>
                      </div>
                      <div className='close'>
                      <button onClick={()=>
                        {
                          e.stopPropagation()
                          removeFromRecent(v.id)
                        }
                      }>x</button> 
                      </div>
                    </div>
                  ))}
              </div>
              )}
              </div>
            )
            :resultList.length> 0 && resultList.map(v=>{

                let finalCategory =(!v.category?.trim() || (v.category === 'custom' && v.customCat === ''))
                        ? 'uncategorised'
                        : v.category === 'custom'
                        ? 'custom'
                        : v.category

                let displayTitle =!v.title.trim()?v.altTitle:v.title

                return(

                  <div className='searchCard' key={v.id} onClick={()=>
                  {    openSearchNote(v.id)

                       navigate(`/note/${v.id}`)
                       handleModalClosing()

                  }
                  }>
                      {
                      v.draft==true&&<span className="draftBadge">
                      <span className="dot"></span> Draft
                      </span>
                      }
                    <div className='header'>
                      <h2>{highlightText(search,displayTitle)}</h2>
                      <span className={`category ${finalCategory}`}  >
                        {  
                          <span className="catIcon">{categoryIcons[finalCategory]}</span>
                        }
                        {
                          finalCategory=='custom'?v.customCat:finalCategory
                        }
                      </span>
                      { v.imp && <FaStar style={{ 
                                                color: "#FFD700",      // Gold fill
                                                stroke: "black",       // Black border
                                                strokeWidth: "20px",   // Thickness of the border
                                                fontSize: "1.2rem"     // Adjust size as needed
                                              }} 
                                              />
                      }
                    </div> 
                    <p>{highlightText(search,v.description)} </p>
                    <span className='doc'>
                        {
                        new Date(v.createdAt).toLocaleDateString('en-GB', 
                            {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                            }
                        )
                        }
                    </span>
                  </div>
                )
              })
            }
        </div>

        <div className="searchFooter">
  <span>ESC to close</span>
</div>
      </div>
    </div>
   
     
   ,document.getElementById("searchModal"))
 }
 
 export default SearchModal
 
 