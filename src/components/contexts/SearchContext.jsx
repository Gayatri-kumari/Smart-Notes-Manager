import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { noteContext } from './NoteContext'
import SearchModal from '../SearchModal'
import { uicontext } from './UIContext'
import { useNavigate } from 'react-router'

export const searchContext=createContext() 
const SearchContext = (props) => {
    let uiData=useContext(uicontext)
    let {searchmodal,handleSearchModal}=uiData
    const noteData=useContext(noteContext)
    console.log(noteData)
    let {noteList}=noteData
    console.log(noteList)
    const [search,setSearch]=useState("")
    let handleModalClosing=()=>{
        handleSearchModal()
        setSearch('')
    }

    let getRecentSearch=()=>{
        let data=localStorage.getItem('recentSearch')
        if(data)
            return JSON.parse(data)
        return []
    } 
    let [recentSearch,setrecentSearch]=useState(getRecentSearch())//store in localstorage

   // to handle esc keyboard action
    useEffect(() => {
        if (!searchmodal) return
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
            handleModalClosing()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [searchmodal])

    let [resultList,setResultList]=useState([])

    let handleSearchContent=(e)=>{
        let {value}=e.target
        setSearch(value)
    }

    
   //for search results
    useEffect(()=>{
       if(search!='')
       { 

        // let todoString=noteList[noteList.length - 2].todoList.text.join("")//to check if the search is working for todo list as well
        // console.log(todoString)
         
        let arr=noteList.filter(v=>{
             
            let todoTextsCheck=v.todoList.map(t=>t.text).join("").toLowerCase().includes(search.toLowerCase())
            
           // console.log(v.todoList.forEach(t=>t.text.toLowerCase().includes(search.toLowerCase())))
            return v.title.toLowerCase().includes(search.toLowerCase()) || 
            todoTextsCheck ||
            v.altTitle.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase())
            })
        // console.log(arr)//search result
        setResultList(arr)
        }
        else{
            setResultList([])
        }
    },[search])
    
    useEffect(()=>{
        localStorage.setItem("recentSearch",JSON.stringify(recentSearch))
    },[recentSearch])

    // let navigate=useNavigate()
    let openSearchNote=(id)=>{
        console.log("opening"+id)
        let clickedNote=resultList.filter(v=>v.id==id)
        let checkExists=false //checks exists in recent search
        recentSearch.forEach((v)=>{
            // console.log("checking")
            if(v.id==id) {
                checkExists=true
                return
            }
        })
        if(!checkExists){
        setrecentSearch(prev=>[...prev,...clickedNote])
        }
 
    }
    let removeFromRecent=(id)=>{
        let filtered=recentSearch.filter(v=>v.id!=id)
        console.log(filtered)
        setrecentSearch(filtered)
    }
  
   
  return (
    <searchContext.Provider value={{resultList,search,handleSearchContent,openSearchNote,recentSearch,removeFromRecent,handleModalClosing}} >
        {props.children}
      
    </searchContext.Provider>
  )
}

export default SearchContext
