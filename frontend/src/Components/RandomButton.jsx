import style from "./RandomButton.module.css";
import { Link } from "react-router";

export default function RandomButton({ onButtonClick }) {
  return (
    <Link
      to={"/touhyou"}
      className={style.RandomButton}
      onClick={onButtonClick}
    >
      ランダムな文を生成
    </Link>
  );
}
