import style from "./RandomButton.module.css";

export default function RandomButton({ onButtonClick }) {
  return (
    <button className={style.RandomButton} onClick={onButtonClick}>
      ランダムな文を生成
    </button>
  );
}
