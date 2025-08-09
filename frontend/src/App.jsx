import { useState } from "react";
import Result from "./Components/Result";
import Toukou from "./Components/toukou";
import RankingTable from "./Components/RankingTable";
import "./App.css";
import TouhyouKaishiButton from "./Components/TouhyouKaishiButton";

function App() {
  return (
    <>
      <div className="container">
        <div className="contentGroup">
          <Result />
          <TouhyouKaishiButton />
        </div>
        <Toukou />
        <RankingTable />
      </div>
    </>
  );
}

export default App;
