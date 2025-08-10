import style from "./Result.module.css"
import { useState } from "react";


export default function Home(){
    const [text, setText] = useState('');

    const handleClick = () => {
    //text更新
    //ここに抽選結果をいれる
        setText('a');
    }
    return (
        <>
            <h1 className={style.result} onClick={handleClick}>{text}</h1>
        </>
    )
}