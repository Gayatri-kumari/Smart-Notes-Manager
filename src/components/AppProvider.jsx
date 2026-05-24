import React from 'react'
import UIContext from './contexts/UIContext'
import SearchContext from './contexts/SearchContext'
import NoteContext from './contexts/NoteContext'
import { Bounce, ToastContainer } from 'react-toastify'

const AppProvider = (props) => {
  return (
    <UIContext>
        <NoteContext>
            <SearchContext>
               <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
         />
                {props.children}
            </SearchContext>
        </NoteContext>
    </UIContext>
  )
}

export default AppProvider
