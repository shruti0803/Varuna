import { useState } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './pages/Dashboard.jsx'
function App() {
  

  return (
   <>
    <div className="min-h-screen">
      <Navbar/>
      <div className="pt-16 text-center text-3xl font-semibold">
        Welcome to Varuna 🌊
        <Dashboard/>
      </div>
      <Footer/>
    </div></>
  )
}

export default App
