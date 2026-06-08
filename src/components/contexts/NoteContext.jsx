import React, { createContext, useContext, useEffect, useState ,useRef} from 'react'
import { v4 as idGen} from 'uuid';
import { uicontext } from './UIContext';
import { Bounce, toast } from 'react-toastify';
export const noteContext=createContext();

// Use a factory function here so we get a fresh object each time.
// If this were a plain object variable, idGen() and new Date() would run once
// when the component initializes, and later resets would reuse the same object.
export const emptyNote = () => ({
    id:idGen(),
    title:'',
    altTitle:'',
    description:'',
    todoList:[],
    category:'',
    imp:false,
    customCat:'',
    draft:false,
    createdAt:new Date(),
    updatedAt:''
})

const NoteContext = (props) => {
    const uiData=useContext(uicontext)
    let {handleModal,openConfirm}=uiData
    let getDataItem=()=>{
        let dataFetched=localStorage.getItem("dataList")
        if(dataFetched)
        {
            return JSON.parse(dataFetched)
        }
        else{
            return []
        }
    }
     const [note,setNote]=useState(emptyNote())
    
    const [noteList,setNoteList]=useState(getDataItem()) 
    useEffect(()=>{
        localStorage.setItem("dataList",JSON.stringify(noteList))
        
    },[noteList])


let resetNote=()=>{
    // console.log("reseet note")
    setNote(emptyNote())
}
 

let handleSubmit=(e)=>{
        e.preventDefault()
        let untitledCount=noteList.filter((v)=>v.title.trim()==='').length+1;
        console.log(untitledCount)
        let finalTitle=!note.title.trim()?`Untitled ${untitledCount}`:''
        let finalToDoList=note.category=="todo"?note.todoList:[]
        let finalCustomCat=note.category=="custom"?note.customCat:''
        let finaldescription=note.category!='todo'?note.description:''
        setNoteList([...noteList,{...note,altTitle:finalTitle,todoList:finalToDoList,customCat:finalCustomCat,description:finaldescription}])
        resetNote()
        handleModal()
    }

let handleCancel=(e)=>{
        e.preventDefault()
        resetNote()
    }

    console.log(note)
   
let handleNoteChange=(e)=>{
    
        let {name,value,checked}=e.target
       
        if(name=='todoItem' )
        {
            console.log(note)
            const todoList=note.todoList || [];
            setNote({...note, todoList:[...note.todoList,{id:idGen(),text:value,completed:false}]})
        }
        else{

             if(name=='imp')
        {
            setNote({...note,[name]:checked})
        }
        else{
        setNote({
            ...note,
            [name]:value
        })
        }

        }
       
    }

    const [selectedCategory,setCategory]=useState('all')
    let handleCategory=(e)=>{
        setCategory(e.target.value)
    }

    let handleImp=(id)=>{
        let newList=noteList.map((v,i)=>{
            if(v.id==id)
            {
                console.log(v)
                return {...v,imp:!v.imp}
            }
            return v

        })
        console.log(newList)
        setNoteList(newList)
        
    }

    let deleteNote=(id)=>{
       console.log(id)
       console.log("deleting")
       let newNoteList =noteList.filter((v)=>v.id!=id)
       setNoteList(newNoteList)
       localStorage.setItem("dataList",JSON.stringify(newNoteList))
    }

    const [editMode,setEditMode]=useState(false)

  

    let editNote=(id)=>{
            // setOpenModal(true)
            handleModal()
            setEditMode(true)
            let selected=noteList.find(v=>v.id==id)
            //console.log(selected)
            setNote(selected)
             
        }

    let handleSave=(e)=>{
        e.preventDefault()

        let updatedList = noteList.map((v)=>{
            if(v.id === note.id){
                note.draft= false
                note.updatedAt=new Date()
                return note
            }
            return v 
        })

        setNoteList(updatedList)
        handleModal()
        setEditMode(false)
        resetNote()
        }

//for proper X functionality during new note creation and edit mode
let handleNoteModal=()=>{  
    //handles the discard confirmation popup for edit mode (triggered for x discard and outside click)
        if(editMode==true)
        {
            let currentNote=noteList.find(v=>v.id==note.id)
            let {title,description,category,imp,customCat}=currentNote
            // setEditMode(prev=>!prev)
           if(note.title!=title || note.description!=description 
            || note.category!=category || note.customCat!=customCat 
            || note.imp!=imp || note.todoList.length!=currentNote.todoList.length)
            {
                 
                openConfirm({
                title:'Discard Changes ?',
                message:"You have unsaved changes in this note . Are you sure you want to exit ? Your progress will be lost",
                type:"warning",
                confirmText:"Discard",
                cancelText:'Keep Editing',
            },()=>{ 
                handleModal()
                resetNote()
                setEditMode(prev=>!prev)
                  
                    } )
            }
            else{
            handleModal()
            resetNote()
            setEditMode(prev=>!prev)
            }
        }
        //handles the discard ,X or outside click when user is creating a new note
        else{
            
        if(note.title||note.description || note.todoList.length>0)
        {
            
            openConfirm({
                title:'Discard Changes ?',
                message:"You have unsaved changes. If you leave now,your progress will be lost.",
                type:"warning",
                confirmText:"Discard",
                cancelText:'Keep Editing',
            },()=>{setTimeout(()=>{
                handleModal()
                resetNote()
                 
                    },200)
                    } )
        }
        else{
        handleModal()
        resetNote()
        }
        }
        
         
    }

 const noteRef = useRef(note);
 useEffect(() => {
   noteRef.current = note;
 }, [note]);

//for drafts
let handleDrafts=()=>{
    console.log("drafts")
    if(!editMode)
    {
        const latestNote = noteRef.current; 
 
        if (latestNote.title || latestNote.description || latestNote.todoList.length > 0) 
        {
             
            console.log("inside inner if")

                let untitledCount=noteList.filter((v)=>v.title.trim()==='').length+1;
                let finalAltTitle = !latestNote.title.trim() ? `Untitled ${untitledCount}` : '';

                console.log(untitledCount)

                  setNoteList(prevList => [
                                        ...prevList, 
                                        { ...latestNote, altTitle: finalAltTitle, draft: true }
                                        ]);
                toast.info("Note added to Drafts !",{ position: "top-left",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        closeOnClick: false,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: "colored",
                                                        transition: Bounce,
                                                                
                                                            })

        }
    }
    handleModal()
    resetNote()
     
}

let markTodoComplete=(id)=>{
    console.log("marking complete",id)
    let newTodoList=[];
    
         newTodoList=note.todoList.map((v)=>{
        if(v.id==id)
        {
            return {...v,completed:!v.completed}
        }
        return v   
    })
    setNote({...note,todoList:newTodoList})
 
   
    console.log(newTodoList)

}
let deleteTodoItem=(id)=>{
    setNote({...note,todoList:note.todoList.filter((v)=>v.id!=id)})

}

  return (
    <noteContext.Provider value={{handleNoteModal,handleDrafts,note,
    handleNoteChange,handleSubmit,handleCancel,
    noteList,selectedCategory,setNoteList,
    handleCategory,deleteNote,editNote,deleteTodoItem,
    editMode,handleSave,handleImp,resetNote,noteRef,markTodoComplete}}>
      {props.children}
      
    </noteContext.Provider>
  )
}

export default NoteContext
