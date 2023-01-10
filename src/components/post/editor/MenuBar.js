import "./menu-bar.css";
import style from "./menu-bar.module.css";
import {useRef, useState} from "react";
import {byteaToBase64, getApplicationUrl, getRequestNumber, isDebuggingMode} from "../../../lib/js/Utilities";
import {useSelector} from "react-redux";
import {BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsCodeSlash, BsParagraph, BsImage} from "react-icons/bs";
import {BiCodeBlock, BiHeading} from "react-icons/bi";
import {GoListUnordered, GoListOrdered} from "react-icons/go";
import {MdOutlineHorizontalRule} from "react-icons/md";
import {FaRedo, FaUndo} from "react-icons/fa";

const MenuBar = ({ editor }) => {
    const fileInput = useRef(null);
    const token = useSelector((state) => state.auth.user_token);

    let base64String = "";
//    const [image, setImage] = useState(null);
//    const [imageUrl, setImageUrl] = useState(null);

    if (!editor) {
        return null
    }

    // keraekli funksiyalar
    const uploadImage = (image) => {
        //const base64Image = byteaToBase64(image);
        editor.commands.insertContent({
            type: "image",
            attrs: {
                src: image,//base64Image
                alt: "image",
                width: 300,
                height: 300,
                title: "random image",
            }
        });
        editor.chain().focus().run();
    }

    const triggerFileInput = () => {
        // trigger file input
        fileInput.current.click();
    }

    const onLoad = (fileString) => {
        base64String = fileString;
    }

    const convertToBase64 = (file) => {
        //const file = e.target.files[0];

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            uploadImage(reader.result);
            onLoad(reader.result);
        }

        /*const reader = new FileReader();
        let baseString = "";
        reader.onloadend = function () {
            baseString = reader.result;
            console.log(baseString);
        };
        reader.readAsDataURL(file)*/
    }

    const onImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            //     setImageUrl(URL.createObjectURL(e.target.files[0]));
            //     setImage(e.target.files[0]);
            //const file = window.URL.createObjectURL(e.target.files[0]);

            /**
             * Use this one to send image to database
             */
            /*sendImageToServer(e.target.files[0]).then(response => {
                if (isDebuggingMode()) {
                    console.log("sendImageToServer response: ", response);
                }

                //uploadImage(response.image);
            }).catch(err => {
                if (isDebuggingMode()) {
                    console.log("Error inside onImageChange: ", err);
                }
            });*/

            //const base64Image = byteaToBase64(e.target.files[0]);


            convertToBase64(e.target.files[0]);
            //uploadImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    // send image to rest service
    async function sendImageToServer(image) {
        console.log("Sending image ...");

        const formData = new FormData();
        formData.append('file', image);

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/OBJECT/IMAGE_UPLOAD_DB", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": token,
                    }, body: formData
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
        <div className={style.menuBarContainer}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            >
                <BsTypeBold className={style.iconSize}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            >
                <BsTypeItalic className={style.iconSize}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
            >
                <BsTypeStrikethrough className={style.iconSize}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'is-active' : ''}
            >
                <BsCodeSlash className={style.iconSize}/>
            </button>
    {/*        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                clear marks
            </button>
            <button onClick={() => editor.chain().focus().clearNodes().run()}>
                clear nodes
            </button>*/}
            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive('paragraph') ? 'is-active' : ''}
            >
                <BsParagraph className={style.iconSize}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            >
                <BiHeading className={style.iconSize}/><span className={style.iconSize}>1</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
                <BiHeading className={style.iconSize}/><span className={style.iconSize}>2</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
            >
                <BiHeading className={style.iconSize}/><span className={style.iconSize}>3</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
            >
                <BiHeading className={style.iconSize}/><span className={style.iconSize}>4</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
            >
                <BiHeading className={style.iconSize}/><span className={style.iconSize}>5</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
            >
                <BiHeading className={style.iconSize}/><span className={style.iconSize}>6</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
                <GoListUnordered className={style.iconSize}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
            >
                <GoListOrdered className={style.iconSize}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'is-active' : ''}
            >
                <BiCodeBlock className={style.iconSize}/>
            </button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
               <MdOutlineHorizontalRule className={style.iconSize}/>
            </button>
            <button onClick={() => editor.chain().focus().undo().run()}>
                <FaUndo className={style.iconSize}/>
            </button>
            <button onClick={() => editor.chain().focus().redo().run()}>
                <FaRedo className={style.iconSize}/>
            </button>
            <button onClick={triggerFileInput}>
                <BsImage className={style.iconSize}/>
            </button>
            <input hidden type="file" ref={fileInput} accept=".jpg,.png," onChange={onImageChange}/>
        </div>
    )
};

export default MenuBar;
