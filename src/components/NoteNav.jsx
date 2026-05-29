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

  return (<>
   <nav>
  <h2>SmartNotes Manager</h2>

  <div className='searchField'>
    <input
      type="search"
      placeholder='Search Notes'
      onClick={handleSearchModal}
      readOnly
    />
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
