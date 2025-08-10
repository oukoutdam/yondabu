import style from "./Result.module.css";
import { useState } from "react";

export default function Home({ text }) {
  return (
    <>
      <h1 className={style.result}>{text}</h1>
    </>
  );
}
