import style from "./TouhyouKaishiButton.module.css";
import { Link } from "react-router";

export default function TouhyouKaishiButton({ onButtonClick }) {
  return (
    <Link
      to={"/touhyou"}
      className={style.RandomButton}
      onClick={onButtonClick}
    >
      投票開始
    </Link>
  );
}
