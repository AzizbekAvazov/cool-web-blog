import style from "./home.module.css";
import {useSelector} from "react-redux";
import {
    getApplicationUrl,
    getRequestNumber,
    getUniqueKey,
    printErrorMessage,
    printResponseData
} from "../../lib/js/Utilities";
import {useEffect, useState} from "react";
import parse from "html-react-parser";
import {Link, useNavigate} from "react-router-dom";
import PostCard from "../blog/post-card/PostCard";

const Home = (props) => {
    let navigate = useNavigate();

    const token = useSelector((state) => state.auth.user_token);
    const userFullNameStored = useSelector((state) => state.auth.user_fullname);

    const [postsListSaved, setPostsListSaved] = useState([]);
    const [postsList, setPostsList] = useState([]);

    // kerakli funksiyalar
    // Function checks whether two arrays have common elements
    function findCommonElement(array1, array2) {

        // Loop for array1
        for(let i = 0; i < array1.length; i++) {

            // Loop for array2
            for(let j = 0; j < array2.length; j++) {

                // Compare the element of each and
                // every element from both of the
                // arrays
                if(array1[i] === array2[j]) {

                    // Return if common element found
                    return true;
                }
            }
        }

        // Return if no common element exist
        return false;
    }

    const handlePostCardClick = (author, post_id) => {
        navigate(author.replaceAll(" ", "") + "/" + post_id, {state: {author: author, post_id: post_id}});
        //navigate(`${value}`, {state: {owner_id: user_id}});
    }

    // calls to API
    async function getAllPosts() {
        const requestData = {}

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/PUBLIC/GET_ALL_POSTS", {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=UTF-8"
                    },
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
        getAllPosts().then(responseData => {
            printResponseData("getAllPosts", responseData);

            if (responseData.posts) {
                // sort the retrieved posts descending by date (the newest first)
                const unsortedPosts = responseData.posts;
                const sorted = [...unsortedPosts].sort((a, b) => {
                    return a.post_id < b.post_id ? 1 : -1
                });
                setPostsList(sorted);
                setPostsListSaved(sorted);
            }
        }).catch(err => {
            printErrorMessage("getAllPosts", err);
        });
    }, []);

    useEffect(()=> {
        if (props) {
            //setSearchText(props.searchText);
            let text = props.searchText;
            let postsListCopy = [];

            postsListSaved.forEach((el)=> {
                let title = el.title;
                let tags =  el.tags;

                let textArr = text.split(" ");

                if (title.includes(text) || findCommonElement(textArr, tags)) {
                    postsListCopy.push(el);
                }
            });

            setPostsList(postsListCopy);
        }

        if (!props.searchText) {
            getAllPosts().then(responseData => {
                printResponseData("getAllPosts", responseData);

                if (responseData.posts) {
                    // sort the retrieved posts descending by date (the newest first)
                    const unsortedPosts = responseData.posts;
                    const sorted = [...unsortedPosts].sort((a, b) => {
                        return a.post_id < b.post_id ? 1 : -1
                    });
                    setPostsList(sorted)
                }
            }).catch(err => {
                printErrorMessage("getAllPosts", err);
            });
        }
    }, [props]);

    return (
        <div className={style.wrapper}>
            <div>
                {/*PROJECTS*/}
         {/*       <div className={style.displayFlex}>
                    <h2>My Projects</h2>
                </div>*/}

                <div className={style.displayFlex}>
                    <h2>Latest Blogs</h2>
                </div>

                {/*PROJECTS*/}
                <div>
                    {/*LISTS OF ALL POSTS GOES HERE*/}
                    <div className={style.postsContainer}>
                        {
                            postsList ?
                                postsList.map(function (post) {
                                    return (
                                        <div key={getUniqueKey()} className={style.postCardContainer}>
                                            <PostCard iOnClick={()=>handlePostCardClick(post.owner_fullname, post.post_id)} source_code={post.source_code} title={post.title}/>
                                            {/*<div className={style.post}>
                                                TITLE
                                                <h3>{post.title}</h3>
                                                CONTENT
                                                {parse(post.source_code)}
                                            </div>*/}
                                            <Link to={post.owner_fullname.replaceAll(" ", "")} state={{ owner_id: post.owner_id }} className={style.author}>
                                                {post.owner_fullname}
                                            </Link>
                                        </div>

                                    )
                                })
                                :
                                null
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home;