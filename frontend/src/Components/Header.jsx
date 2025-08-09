import React from "react";
import styles from "./Header.module.css";

export default function Header({title}){
    return <header className={styles.header}>
        <div className={styles.left}>
            <button className={styles.button}>
                <span className={styles.line}></span>
                <span className={styles.line}></span>
                <span className={styles.line}></span>
            </button>
            <h1>{title}</h1>
        </div>
            <h3>Steve株式会社</h3>
        </header>
}