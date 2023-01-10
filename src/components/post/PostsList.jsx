import style from "./postslist.module.css";
import {useSelector} from "react-redux";
import {
    getApplicationUrl,
    getRequestNumber,
    getUniqueKey,
    printErrorMessage,
    printResponseData
} from "../../lib/js/Utilities";
import {useEffect, useState} from "react";
import parse from 'html-react-parser';
import {useLocation, useNavigate} from "react-router-dom";
import PostCard from "../blog/post-card/PostCard";
import TrashIc from "../../lib/img/profile/trash.svg";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";

const styles = {
    textColorBlack: {
        color: "black"
    }
}

const PostsList = () => {
    let navigate = useNavigate();
    const {t} = useTranslation();
    const location = useLocation()

    const token = useSelector((state) => state.auth.user_token);
    const loggedUserId = useSelector((state) => state.auth.user_id);

    const [userId, setUserId] = useState(-1);
    const [getUserPostsResponse, setGetUserPostsResponse] = useState({});
    const [userPostsList, setUserPostsList] = useState([]);
    const [deletePostDialog, setDeletePostDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState({});

    const handlePostCardClick = (author, post_id) => {
        navigate("/" + author.replaceAll(" ", "") + "/" + post_id, {state: {author: author, post_id: post_id}});
    }

    const removePostFromArray = () => {
        setUserPostsList(prevState =>
           prevState.filter(prevItem => prevItem.post_id !== postToDelete.post_id)
        );
    }

    const confirmPostDeletion = () => {
        deletePost().then(responseData => {
            printResponseData("deletePost", responseData);
            setDeletePostDialog(false);
            // delete post from postsList
            removePostFromArray();
        }).catch(err => {
            printErrorMessage("deletePost", err);
        });
    }

    const handleTrashClick = (post) => {
        setPostToDelete(post);
        setDeletePostDialog(true);
    }

    // api calls
    async function getUserPosts() {
        const requestData = {
            owner_id: userId
        }

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/PUBLIC/GET_USER_POSTS_BY_ID", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=UTF-8"
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

    async function deletePost() {
        const requestData = {
            post_id: postToDelete.post_id
        }

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/OBJECT/DELETE_POST", {
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

    async function getUserByUsername() {
        const requestData = {
            username: location.pathname.replaceAll("/", "")
        }

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/PUBLIC/GET_USER_BY_USERNAME", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=UTF-8"
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
        getUserByUsername().then(responseData => {
            printResponseData("getUserByUsername", responseData);
            setUserId(responseData.data.user_id);
        }).catch(err => {
            printErrorMessage("getUserByUsername", err);
        });
    }, [location]);

    useEffect(()=> {
        if (userId !== -1) {
            getUserPosts().then(responseData => {
                printResponseData("getUserPosts", responseData);
                setGetUserPostsResponse(responseData);
            }).catch(err => {
                printErrorMessage("getUserPosts", err);
            });
        }
    }, [userId]);

    useEffect(()=> {
        if (getUserPostsResponse && getUserPostsResponse.posts) {
            setUserPostsList(getUserPostsResponse.posts);
        }
    }, [getUserPostsResponse]);

    return (
        <div>
{/*
            POSTS LIST
*/}

            {/*LISTS OF USER'S POSTS GOES HERE*/}
            <div className={style.postsContainer}>
                {
                    Object.keys(getUserPostsResponse).length !== 0 ?
                        userPostsList.map(function (post) {
                            return (
                                <div key={getUniqueKey()}>
                                    <PostCard iOnClick={()=>handlePostCardClick(post.owner_fullname, post.post_id)} source_code={post.source_code} title={post.title}/>
                                    {
                                        post.owner_id == loggedUserId ?
                                            <div className={style.trashContainer}>
                                                <button onClick={() => handleTrashClick(post)}><img src={TrashIc} alt="Delete"/></button>
                                            </div>
                                            :
                                            null
                                    }

                                </div>
                            )
                        })
                        :
                        null
                }
            </div>

            {/*DELETE POST MODAL*/}
            <Dialog
                open={deletePostDialog}
                onClose={() => setDeletePostDialog(false)}
            >
                <DialogTitle>
                    <p className={style.postToDeleteTitle}>{postToDelete.title}</p>
                    {t('profile.delete_post')}
                </DialogTitle>
            {/*    <DialogContent>

                </DialogContent>*/}

                <DialogActions>
                    <Button sx={styles.textColorBlack} onClick={()=>setDeletePostDialog(false)}>{t('general.cancel')}</Button>
                    <Button sx={styles.textColorBlack} onClick={confirmPostDeletion}>{t('general.confirm')}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default PostsList;