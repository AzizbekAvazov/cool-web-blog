import style from "./post-detailed.module.css";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {
    getApplicationUrl,
    getRequestNumber,
    getUniqueKey,
    printErrorMessage,
    printResponseData
} from "../../../lib/js/Utilities";
import {useSelector} from "react-redux";
import parse from "html-react-parser";
import {Link} from "@mui/material";
import iBackButton from "../../../lib/img/navbar/back-button.svg";

const PostDetailed = (props) => {
    const location = useLocation();
    let navigate = useNavigate();

    const token = useSelector((state) => state.auth.user_token);

    const [postId, setPostId] = useState(-1);
    const [author, setAuthor] = useState("");
    const [selectedPost, setSelectedPost] = useState({});

    const handleBackButton = ()=> {
        navigate(-1);
    }

    //calls to API
    async function getPostById() {
        const requestData = {
            post_id: postId
        }

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/PUBLIC/GET_POST_BY_ID", {
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

    useEffect(()=> {
        if (location.pathname) {
            const output = location.pathname.split('/');
            const id = output[output.length - 1];
            setPostId(parseInt(id));
        }
        /*if (location && location.state) {
            setPostId(location.state.post_id);
            setAuthor(location.state.author);
        }*/
    }, [location]);

    useEffect(()=> {
        if (postId !== -1) {
            getPostById().then(responseData => {
                printResponseData("getPostById", responseData);
                setSelectedPost(responseData.post);
            }).catch(err => {
                printErrorMessage("getPostById", err);
            });
        }
    }, [postId]);

    return (
        <div>
            <Link className={style.backButton} onClick={handleBackButton}>
                <img src={iBackButton} alt="back" />
            </Link>
            <div className={style.wrapper}>
                {/*TITLE*/}
                <h2 className={style.textAlignCenter}>{selectedPost.title}</h2>

                {/*POST ITSELF*/}
                <div className={style.sourceCode}>
                    {
                        selectedPost && selectedPost.source_code ?
                            parse(selectedPost.source_code)
                            :
                            null
                    }
                </div>
            </div>

            <div className={style.tagsParent}>
                <div className={style.tagTitle}>Tags: </div>

                {
                    selectedPost && selectedPost.tags && selectedPost.tags.length !== 0 ?
                        <div className={style.tags}>
                            {
                                selectedPost.tags.map(function (tag) {
                                    return (
                                        <span key={getUniqueKey()} className={style.tag}>{tag}</span>
                                    )
                                })
                            }
                        </div>
                        :
                        null
                }
            </div>



        </div>
    )
}

export default PostDetailed;