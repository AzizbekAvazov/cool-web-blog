import CustomEditor from "./editor/CustomEditor";
import style from "./newpost.module.css";
import {TextField} from "@mui/material";
import {useTranslation} from "react-i18next";

const NewPost = () => {
    const {t} = useTranslation();

    return (
        <div className={style.wrapper}>
            <CustomEditor/>
        </div>
    )
}

export default NewPost;