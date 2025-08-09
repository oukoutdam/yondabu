
import {useState} from 'react'
import Result from  "./Components/Result"
import Button from "./Components/RandomButton"
import Toukou from "./Components/toukou"
import RankingTable from "./Components/RankingTable";
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
          <RankingTable />
      </div>
    </>
  );
}

export default App;
