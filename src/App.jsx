import LightningEffect from '../components/LightningEffect'
import Navbar from '../components/Navbar'
import Section from '../components/Section'
import MagicCursor from '../components/MagicCursor'
import React from 'react'
import './App.css'

const showLightningEffect = true

function App() {
  return (
    <>
      {showLightningEffect && <LightningEffect />}
      <MagicCursor />
      <Navbar />
      <Section />
    </>
  )
}

export default App