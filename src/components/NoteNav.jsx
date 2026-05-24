import React, { useContext, useEffect, useRef } from 'react'
import '../css/nav.css'
import { GoMoon } from "react-icons/go";
import { IoSunnyOutline } from "react-icons/io5";
import { noteContext } from './contexts/NoteContext';
import SearchModal from './searchModal';
import { searchContext } from './contexts/SearchContext';
import { uicontext } from './contexts/UIContext';

const NoteNav = () => {
  // let data=useContext(noteContext)
  let searchData=useContext(searchContext)
  let uiData=useContext(uicontext)
  console.log(uiData)
  let {theme,handleTheme,handleSearchModal,searchmodal}=uiData
   // let {searchmodal}=searchData

  return (<>
    <nav>
      <h2>SmartNotes Manager</h2>
      <div className='searchField' onClick={handleSearchModal}>
        <input type="search" 
        name="search" 
       placeholder='Search Notes' />
 
      </div>
      <div className="theme" onClick={handleTheme}>
        {/* <GoMoon /> */}
        {theme=='dark'?<IoSunnyOutline />:<GoMoon />}

      </div>
    </nav>
     {searchmodal && <SearchModal/>}
    </>
  )
}

export default NoteNav
