import {useState} from 'react'
import Result from  "./Components/Result"
import Button from "./Components/RandomButton"
import Toukou from "./Components/toukou"
import "./App.css"

function App() {
  return (
    <>
      <div className="container">
        <div className="contentGroup">
          <Result />
          <Button />
        </div>
          <Toukou />
      </div>
    </>
  )
}

export default App
