import React, { useContext } from 'react'
import { noteContext } from './contexts/NoteContext'
import Noteform from './Noteform'
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { uicontext } from './contexts/UIContext';
import ConfirmModal from '../components/ConfirmModal'
import { useNavigate } from 'react-router';
import { FaBriefcase, FaLightbulb, FaUser, FaBook } from "react-icons/fa";
import { MdChecklist } from "react-icons/md";

import { FaTag, FaQuestionCircle } from "react-icons/fa";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify/unstyled';
import { CgNotes } from "react-icons/cg";

import '../css/global.css'
export const categoryIcons = {
  personal: <FaUser />,
  work: <FaBriefcase />,
  study: <FaBook />,
  ideas: <FaLightbulb />,
  todo: <MdChecklist />,
  custom: <FaTag />,
  uncategorised: <FaQuestionCircle />
};
export const categories=["all","important","drafts","personal","work","study","ideas","todo","uncategorised","custom"]

const NoteDisplay = () => {
    let categoryCheck=''
    let data=useContext(noteContext)
    let {handleNoteModal,handleImp,noteList,handleCategory,selectedCategory,deleteNote,editNote}=data
    let uiData=useContext(uicontext)
    let {openModal,handleModal,confirmModal,openConfirm}=uiData
    let selectedNotes=[]
    if(noteList.length>0){
    selectedNotes=noteList.filter((v)=>{
        if(selectedCategory=='all') return true
        if(selectedCategory=='drafts') return v.draft
        if(selectedCategory=='important') return v.imp && !v.draft
        if(selectedCategory=='uncategorised') return (v.category=='' || (v.category=='custom' && v.customCat=='')) && !v.draft
        if(selectedCategory=='custom') return v.category=='custom' && v.customCat && !v.draft
        return v.category==selectedCategory && !v.draft
         
    })
    }

let navigate=useNavigate()
return(
    <>
    <main>
    {noteList.length==0?(
        <div className='createNoteDiv'>
    <div className="emptyIcon"><CgNotes /></div>
    <h3>Your notes live here</h3>
    <p>Capture ideas, tasks, and thoughts — all in one place</p>
    <button onClick={handleModal} className='createNoteButton'>+ Create Note</button>
</div>
    )
    :
    (
        <>
        <button onClick={handleModal} className='createNoteButton'>+ Create Note</button>
         
        <div name='category' className='categoryMainDiv' onChange={handleCategory} value={selectedCategory} >
             {
                 categories.map((v,i)=>{
                     return (
                        <label className={`category ${selectedCategory==v ? "activeCat": ''}`} key={i}>
                        <input type='radio' value={v} name="selectedCategory"/>{v=="custom"?'others':v} 
                       </label>
                    )
                })
            }   
        </div>  
        
        <div className='noteContainer'>    
        { 
            selectedNotes.map(value=>{
            let finalCategory =(!value.category?.trim() || 
                            (value.category === 'custom' && !value.customCat?.trim()))
                                ? 'uncategorised'
                                : value.category

            let displayTitle=!value.title.trim()?value.altTitle:value.title;
          
            return(
                <div key={value.id} className={`noteCard ${(value.draft&&'drafts')||finalCategory}`} 
                onClick={(e)=>{ 
                                if(e.target.closest('.cardBtns')) return
                                navigate(`/note/${value.id}`)
                        }} 
                >
                    <div className='cardHeader'>
                        <div>
                            {value.draft && <span className="draftBadge"><span className="dot"></span> Draft</span>}
                            <h2>{displayTitle}</h2>
                        </div>
                        <div className='cardBtns'>
                            <span onClick={(e)=>{e.stopPropagation();
                                                handleImp(value.id)
                                        }}
                                className={`${value.imp==true ? 'opacity':''}`}>{value.imp == false ?<FaRegStar />:
                                <FaStar 
                                    style={{ 
                                    color: "#FFD700",      // Gold fill
                                    stroke: "black",       // Black border
                                    strokeWidth: "20px",   // Thickness of the border
                                    fontSize: "1.2rem"     // Adjust size as needed
                                    }} 
                                />}
                            </span>
                            <span onClick={(e)=>{
                                    e.stopPropagation()
                                    editNote(value.id)}}>
                                    <MdOutlineEdit/>
                            </span>
                            <span onClick={(e)=>{
                                    e.stopPropagation()
                                    openConfirm(
                                        {
                                        title:'Delete note ?',
                                        message:"Your note will be permanently deleted and cannot be recovered",
                                        type:"danger",
                                        confirmText:"Delete",
                                        cancelText:'Cancel',
                                    },()=>deleteNote(value.id))
                                    
                                    }
                                    }>
                                        <RiDeleteBin6Line />
                            </span>
                        </div>
                    </div> 
                    <div className={`category ${finalCategory}`}>
                        <span className="catIcon">
                            {categoryIcons[finalCategory]}
                        </span>

                        {
                            finalCategory === 'custom'
                            ? value.customCat
                            : finalCategory
                        }
                    </div>
                    <p className="description">{value.description}</p>
                    <span className='doc'>
                            {
                            new Date(value.updatedAt || value.createdAt).toLocaleDateString('en-GB', 
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
        </>
    )
    }
    </main>
    {openModal==true && <Noteform/>}
    {confirmModal.show&&<ConfirmModal/>}
    </>
)
}
export default NoteDisplay
   