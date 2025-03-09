//import { useState } from 'react'
import "./css/App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import RegistrationPage from "./pages/RegistrationPage"
import AboutPage from "./pages/AboutPage"
import NotFound from "./pages/NotFound"
import Header from "./components/Header"

function App() {

  return (
    <>

    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/registration" element={<RegistrationPage/>} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
