import style from "./post-card.module.css";
import parse from "html-react-parser";
import {getUniqueKey} from "../../../lib/js/Utilities";

const PostCard = (props) => {

    return (
        <div onClick={props.iOnClick} className={style.wrapper}>
            <div className={style.post}>
                {/*TITLE*/}
                <h3>{props.title}</h3>
                {/*CONTENT*/}
                {parse(props.source_code)}
            </div>

           {/* <div className={style.tags}>
                {
                    props && props.tags && props.tags.length !== 0 ?
                        props.tags.map(function (tag) {
                            return (
                                <span key={getUniqueKey()} className={style.tag}>{tag}</span>
                            )
                        })
                        :
                        null
                }
            </div>*/}
        </div>
    )
}

export default PostCard;