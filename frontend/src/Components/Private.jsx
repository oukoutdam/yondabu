import style from "./Private.module.css";
import KeyIcon from "../assets/lock_24.svg";

export default function Private(){

    return(
        <>
        <div className={style.title}>
            <img className={style.KeyIcon} src={KeyIcon} alt="Key" />
            <h2 className={style.h2}>プライベートルーム</h2>
        </div>
        <div className={style.table}>
            <table>
                <thead>
                    <tr>
                        <th>名前</th>
                        <th>部屋の名前</th>
                        <th>人数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>はな</td>
                        <td>〇年〇組</td>
                        <td>5 人</td>
                    </tr>
                    <tr>
                        <td>ここあ</td>
                        <td>ここあの部屋</td>
                        <td>3 人</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </>
    );
}