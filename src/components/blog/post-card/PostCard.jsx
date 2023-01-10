import style from "./post-card.module.css";
import parse from "html-react-parser";

const PostCard = (props) => {

    return (
        <div onClick={props.iOnClick} className={style.wrapper}>
            <div className={style.post}>
                {/*TITLE*/}
                <h3>{props.title}</h3>
                {/*CONTENT*/}
                {parse(props.source_code)}
            </div>
        </div>
    )
}

export default PostCard;