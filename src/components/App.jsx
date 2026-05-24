import React from 'react'
import NoteNav from './NoteNav'
import NoteDisplay from './NoteDisplay'
import NoteContext from './contexts/NoteContext'
import AppProvider from './AppProvider'
import { BrowserRouter,Route,Routes } from 'react-router'
import NoteView from './NoteView'

const App = () => {
  
  return (
    <>
     
    <AppProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<><NoteNav/><NoteDisplay/></>}/>
        <Route path="/note/:id" element={<NoteView/>}/>
      </Routes>
      </BrowserRouter>
    </AppProvider>
    </>
  )
}

export default App
