import './App.css';
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import Home from "../home/Home";
import Login from "../authorization/Login";
import Profile from "../profile/Profile";
import PostsList from "../post/PostsList";
import NewPost from "../post/NewPost";
import Navbar from "../navbar/Navbar";
import "../../lib/js/il8n";
import {useDispatch, useSelector} from "react-redux";
import PostDetailed from "../post/post-detail/PostDetailed";
import {useIdleTimer} from "react-idle-timer";
import {getIdleTimeoutMinutes} from "../../lib/js/Utilities";
import {clearAuthRedux} from "../../redux/AuthSlice";
import Footer from "../footer/Footer";
import {useState} from "react";

function App() {
    const token = useSelector((state) => state.auth.user_token);
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");

    const handleOnIdle = () => {
        dispatch(clearAuthRedux(""));
    }

    const searchTextChange = (e) => {
        setSearchText(e);
    }

    useIdleTimer({
        timeout: 1000 * 60 * getIdleTimeoutMinutes(),
        onIdle: handleOnIdle,
        debounce: 500,
    })

    return (
        <div className="app">
            <Router>
                <Navbar handleSearchTextChange={searchTextChange}/>
                <Routes>
                    <Route path="/" element={<Home searchText={searchText}/>}/>
                    <Route path="/:username" element={<Profile/>}>
                        <Route index element={<PostsList/>}/>
                        <Route path="newpost" element={<NewPost/>}/>
                    </Route>
                    {/*TO MAKE SOME PAGES ACCESSIBLE ONLY TO LOGGED USERS*/}
                    {/* { token ?
                    <Route path="/:username" element={<Profile/>}>
                        <Route index element={<PostsList/>}/>
                        <Route path="newpost" element={<NewPost/>}/>
                    </Route>
                    :
                    <Route path="*" element={<Navigate to="/" />} />
                }*/}

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/:username/:postid" element={<PostDetailed/>}/>
                    {/*    <Route path="/profile" element={<Profile/>}>
              <Route index element={<PostsList/>}/>
              <Route path="postslist" element={<PostsList/>}/>
              <Route path="newpost" element={<NewPost/>}/>
          </Route>*/}
                </Routes>
            </Router>
            <Footer/>
        </div>
    );
}

export default App;
