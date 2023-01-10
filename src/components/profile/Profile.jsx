import style from "./profile.module.css";
import {Link, Route, Routes, Outlet, useParams, useLocation} from "react-router-dom";
import NewPost from "../post/NewPost";
import PostsList from "../post/PostsList";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {getApplicationUrl, getRequestNumber, printErrorMessage, printResponseData} from "../../lib/js/Utilities";

const Profile = (props) => {
    const {t} = useTranslation();
    const location = useLocation();
    const loggedUserId = useSelector((state) => state.auth.user_id);
    let params = useParams();

    const [searchedUserId, setSearchedUserId] = useState(-1);
    const [userFullName, setUserFullName] = useState("");

    // 1 - for "Your blog"; 2 - for "Create new blog". Used to underline chosen option
    const [whichMenu, setWhichMenu] = useState(1);

    // calls to API
    async function getUserByUsername() {
        const requestData = {
            username: location.pathname.replaceAll("/", "").replaceAll("newpost", "")
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
            setSearchedUserId(responseData.data.user_id);
            setUserFullName(responseData.data.user_fullname);
        }).catch(err => {
            printErrorMessage("getUserByUsername", err);
        });
    }, [location]);

    useEffect(()=> {
        if (location.pathname) {
            if (location.pathname.indexOf("newpost") !== -1) {
                setWhichMenu(2);
            } else {
                setWhichMenu(1);
            }
        }
    }, [location]);

    return (
        <div className={style.wrapper}>
            <div>
                <nav>
                    <div className={style.displayFlex}>
                        <Link to={location.pathname.replace("/newpost", "")}
                              state={{ owner_id: searchedUserId }}
                              className={`${style.navLinkStyle} ${whichMenu === 1 ? style.bottomLine : null}`}>
                            {
                                searchedUserId === loggedUserId ?
                                    <h2>{t('profile.your_blogs')}</h2>
                                    :
                                    <h2>{userFullName} {t('profile.blogs')}</h2>
                            }
                        </Link>

                        {
                            searchedUserId === loggedUserId ?
                                <Link to="newpost"
                                      state={{ owner_id: searchedUserId }}
                                      className={`${style.navLinkStyle} ${whichMenu === 2 ? style.bottomLine : null}`}
                                ><h2>{t('profile.create_new_blog')}</h2></Link>
                                :
                                null
                        }
                    </div>

                </nav>

                <Outlet/>
            </div>
        </div>
    )
}

export default Profile;