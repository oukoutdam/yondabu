import style from "./Result.module.css"
import { useState } from "react";


export default function Home(){
    const [text, setText] = useState('');

    const handleClick = () => {
    //text更新
    //ここに抽選結果をいれる
        setText('');
    }

    return (
        <>
            <h1 className={style.result}>{text}</h1>
        </>
    )
}