import React from "react";
import styles from "./Header.module.css";
import { Link } from "react-router";

export default function Header({ title }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.button}>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </button>
        <Link to="/" className={styles.homelink}>
          <h1>{title}</h1>
        </Link>
      </div>
      <h3>Steve株式会社</h3>
    </header>
  );
}
