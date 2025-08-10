import React, { useState } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router";

export default function Header({ title }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
    // <div className={`${styles.pageContent} ${isOpen ? styles.shifted : ''}`}>
        <header className={styles.header}>
            <div className={styles.left}>
                <button className={styles.button} onClick={toggleMenu}>
                    <span className={`${styles.line} ${isOpen ? styles.line1 : ''}`}></span>
                    <span className={`${styles.line} ${isOpen ? styles.line2 : ''}`}></span>
                    <span className={`${styles.line} ${isOpen ? styles.line3 : ''}`}></span>
                </button>
                <Link to="/" className={styles.homelink}>
                    <h1>{title}</h1>
                </Link>
            </div>
            <h3 className={`${styles.h3} ${isOpen ? styles.h3Open: ''}`}>Steve株式会社</h3>
            <nav className={`${styles.menuContent} ${isOpen ? styles.menuContentOpen : ''}`}>
              <Link to="private" className={styles.menuLinkPrivate}>プライベートルーム</Link>
              <Link to="vote" className={styles.menuLinkVote}>投票</Link>
              {/* <Link to="/contact" className={styles.menuLink}></Link> */}
            </nav>
        </header>
    // </div>
    );
}
