import style from "./custom-editor.module.css";
import "./custom-editor.css";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {useState} from "react";
import MenuBar from "./MenuBar";
import Image from "@tiptap/extension-image";
import {useTranslation} from "react-i18next";
import {
    getApplicationUrl,
    getRequestNumber, getUniqueKey,
    isDebuggingMode,
    printErrorMessage,
    printResponseData
} from "../../../lib/js/Utilities";
import {useSelector} from "react-redux";
import {TextField} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";

Image.configure({
    allowBase64: true,
    // inline: true,
  /*  HTMLAttributes: {
        class: 'uploadedImageSize',
    },*/
});

const CustomEditor = ()=> {
    let navigate = useNavigate();
    const { t } = useTranslation();
    const token = useSelector((state) => state.auth.user_token);
    const userFullNameStored = useSelector((state) => state.auth.user_fullname);
    const user_id = useSelector((state) => state.auth.user_id);
    const titleFontSize = 22;

    const [postTitle, setPostTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [tagsInput, setTagsInput] = useState("");

    const [isKeyReleased, setIsKeyReleased] = useState(false);

    const onPostTitleChange = (e) => {
        setPostTitle(e.target.value);
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image
        ],
        content: '',
        onUpdate: ({editor}) => {
           /* const json = editor.getText();
            console.log(json);*/
         },
    });

    const savePost = () => {
        // check if post title is empty
        if (postTitle && tags.length !== 0) {
           if (editor) {
                //const post = JSON.stringify(editor.view.state.toJSON(), null , 2);
                //console.log("HTML: ", editor.getHTML())
                const post = editor.getHTML();

                savePostRequest(post).then(responseData => {
                    printResponseData("savePostRequest", responseData);

                    if (responseData.code == 0) {
                        navigate("/" + userFullNameStored.replaceAll(" ", ""), {state: {owner_id: user_id}});
                    }
                }).catch(err => {
                    printErrorMessage("savePostRequest", err);
                });
            }
        }
    }

    const onTagsInputChange = (e) => {
       /* const result = e.target.value.replace(/[^a-zA-Z,]/gi, '');
        setTags(result);*/
        setTagsInput(e.target.value);
    }

    const handleTagsInputKeyDown = (e) => {
        const key = e.key;

        const trimmedInput = tagsInput.trim();

        if (key === ',' && trimmedInput.length && !tags.includes(trimmedInput)) {
            e.preventDefault();
            setTags(prevState => [...prevState, trimmedInput]);
            setTagsInput('');
        }

        if (key === "Backspace" && !tagsInput.length && tags.length) {
            e.preventDefault();
            const tagsCopy = [...tags];
            const poppedTag = tagsCopy.pop();

            setTags(tagsCopy);
            setTagsInput(poppedTag);
        }

        setIsKeyReleased(false);
    }

    const handleTagsInputKeyUp = () => {
        setIsKeyReleased(true);
    }

    const deleteTag = (index) => {
        setTags(prevState => prevState.filter((tag, i) => i !== index))
    }

    // send image to rest service
    async function savePostRequest(sourceCode) {
        const requestData = {
            source_code: sourceCode,
            title: postTitle,
            tags: tags
        }

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/OBJECT/SAVE_POST", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=UTF-8",
                        "Authorization": token
                    }, body: JSON.stringify(requestData)
                });
                const responseData = await response.json();
                return responseData;
            } catch (err) {
                error = err;
            }
        }
        throw error;
    }

    return (
        <div>
            <TextField InputProps={{className: `${style.marginBottom15} ${style.titleInput}`, style: {fontSize: 22}}}
                       fullWidth id="standard-basic"
                       /*
                            label={t('profile.title')}
                        */
                       variant="outlined"
                       onChange={onPostTitleChange}
                       error={!postTitle}
                       placeholder={t('profile.title')}
            />

            <MenuBar editor={editor} />
            <EditorContent editor={editor} className={style.editorContent}/>

{/*            <TextField InputProps={{className: `${style.marginBottom15} ${style.titleInput} ${style.marginTop15}`, style: {fontSize: 18}}}
                       fullWidth id="standard-basic"
                       variant="outlined"
                       onChange={onTagsInputChange}
                       error={!tags}
                       value={tags}
                       placeholder={t('profile.tags')}
            />*/}

            <div className={`${style.tagInputContainer} ${style.marginTop15} ${style.marginBottom15}`}>
                {tags.map((tag, index) => (
                    <div key={getUniqueKey()} className={style.tag}>
                        {tag}
                        <button onClick={() => deleteTag(index)}>x</button>
                    </div>
                ))}
                <input
                    value={tagsInput}
                    placeholder="Enter a tag"
                    onKeyDown={handleTagsInputKeyDown}
                    onChange={onTagsInputChange}
                    onKeyUp={handleTagsInputKeyUp}
                />
            </div>

            <button type="button" className={style.saveButton} onClick={savePost}>
                {t("profile.save")}
            </button>
            {/*  <div>
                editor content:
            </div>
            <div>
                {editor ? JSON.stringify(editor.view.state.toJSON(), null, 2)
                    : "NO DATA"}
            </div>*/}
        </div>
    )
}

export default CustomEditor;