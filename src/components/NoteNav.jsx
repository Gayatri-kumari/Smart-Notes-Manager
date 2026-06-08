import React, { useContext, useEffect, useRef } from 'react'
import '../css/nav.css'
import { GoMoon } from "react-icons/go";
import { IoSunnyOutline } from "react-icons/io5";
import { noteContext } from './contexts/NoteContext';
import SearchModal from './SearchModal';
import { searchContext } from './contexts/SearchContext';
import { uicontext } from './contexts/UIContext';
import { IoIosSearch } from "react-icons/io";


const NoteNav = () => {
  // let data=useContext(noteContext)
  let searchData=useContext(searchContext)
  let uiData=useContext(uicontext)
  console.log(uiData)
  let {theme,handleTheme,handleSearchModal,searchmodal}=uiData
   // let {searchmodal}=searchData


    useEffect(() => {
           
           const handleKeyDown = (event) => {
               if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                 
                event.preventDefault()
               handleSearchModal()
               }
           }
           window.addEventListener("keydown", handleKeyDown)
           return () => {
               window.removeEventListener("keydown", handleKeyDown)
           }
       },[searchmodal])


  return (<>
   <nav>
  <h2>SmartNotes Manager</h2>

  <div className='searchField'>
    <div className='searchWrapper' onClick={handleSearchModal}>
      <IoIosSearch className='searchIcon' />
      <span className='placeholder'>Search Notes</span>
      <div className='kbdHint'>
        <kbd>Ctrl</kbd>
        <kbd>k</kbd>
      </div>

    </div>
  </div>

  <div className='rightActions'>

    <div
      className='searchIcon'
      onClick={handleSearchModal}
    >
      <IoIosSearch />
    </div>

    <div
      className="theme"
      onClick={handleTheme}
    >
      {theme === 'dark'
        ? <IoSunnyOutline />
        : <GoMoon />
      }
    </div>

  </div>
</nav>
     {searchmodal && <SearchModal/>}
    </>
  )
}

export default NoteNav
