import style from "./Toukou.module.css"
import {Link} from "react-router"

export default function Toukou(){
    return (
        <div>
            <Link to="toukou" className={style.toukou}>
                投稿する
            </Link>
        </div>
    );
}