import style from "./navbar.module.css";
import {
    AppBar, Backdrop,
    Box,
    Button, CircularProgress, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    Drawer,
    IconButton, Input, List, ListItem,
    ListItemButton,
    ListItemText, TextField, ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import {Fragment, useEffect, useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {
    getApplicationUrl,
    getRequestNumber,
    printErrorMessage,
    printResponseData
} from "../../lib/js/Utilities";
import {clearAuthRedux, setUserFullnameRdx, setUserId, setUserToken} from "../../redux/AuthSlice";
import {useNavigate} from "react-router-dom";

const drawerWidth = 240;

const theme = createTheme({
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: "var(--blue)"
                }
            }
        }
    }
});

const styles = {
    textColorWhite: {
        color: "white",
        fontWeight: "bold"
    },
    textColorBlack: {
        color: "black"
    }
}

const Navbar = (props) => {
    let navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.user_token);
    const userFullNameStored = useSelector((state) => state.auth.user_fullname);
    const user_id = useSelector((state) => state.auth.user_id);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [regModalOpen, setRegModalOpen] = useState(false);

    const [userFullName, setUserFullName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const [isBackdropOpen, setIsBackdropOpen] = useState(false);

    const [searchText, setSearchText] = useState("");

    // kerakli funksiyalar
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const openLoginModal = () => {
        setLoginModalOpen(true);
    }

    const openRegModal = () => {
        setRegModalOpen(true);
    }

    const onEmailChange = (value) => {
        setUserEmail(value);
    }

    const onFullNameChange = (value) => {
        setUserFullName(value);
    }

    const onPasswordChange = (value) => {
        setUserPassword(value);
    }

    const confirmLogin = () => {
        setIsBackdropOpen(true);

        userSignIn().then(responseData => {
            setIsBackdropOpen(false);

            printResponseData("userSignIn", responseData);
            if (responseData.code == 0) {
                setLoginModalOpen(false);
                dispatch(setUserToken(responseData.token));
                dispatch(setUserFullnameRdx(responseData.data.user_fullname));
                dispatch(setUserId(responseData.data.user_id));
            }
        }).catch(err => {
            printErrorMessage("userSignIn", err);
            setIsBackdropOpen(false);
        });
    }

    const confirmReg = () => {
        setRegModalOpen(false);

        userReg().then(responseData => {
            printResponseData("userReg", responseData);
        }).catch(err => {
            printErrorMessage("userReg", err);
        });
    }

    const isLogged = () => {
        if (token) return true;
        else return false;
    }

    const handleLogout = () => {
        dispatch(clearAuthRedux(""));
        navigate("/");
    }

    const redirectTo = (value) => {
        navigate(`${value}`, {state: {owner_id: user_id}});
    }

    const handleLoginOnEnter = (e) => {
        if (e.key === "Enter") {
            confirmLogin();
        }
    }

    const handleRegOnEnter = (e) => {
        if (e.key === "Enter") {
            confirmReg();
        }
    }

    // api calls
    async function userReg() {
        const requestData = {
            password: userPassword,
            email: userEmail,
            user_fullname: userFullName,
            username: userFullName.replaceAll(" ", "")
        }

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/AUTH/USER_REG", {
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

    async function userSignIn() {
        const requestData = {
            email: userEmail,
            password: userPassword
        }

        let error;

        for (let i = 0; i < getRequestNumber(); i++) {
            try {
                const response = await fetch(getApplicationUrl()+"/AUTH/USER_SIGN_IN", {
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
        if (!loginModalOpen) {
            setUserFullName("");
            setUserEmail("");
            setUserPassword("");
        }
    }, [loginModalOpen]);

    useEffect(()=> {
        if (!regModalOpen) {
            setUserFullName("");
            setUserEmail("");
            setUserPassword("");
        }
    }, [regModalOpen]);

    useEffect(()=> {
        props.handleSearchTextChange(searchText);
    }, [searchText]);

    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2, display: {sm: 'none'}, color: styles.textColorWhite.color}}
                        >
                            <MenuIcon/>
                        </IconButton>

                        <Typography
                            variant="h6"
                            component="div"
                            sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                            className={style.colorBlack}
                        >
                            <span className={style.companyName} onClick={()=>redirectTo("/")}>VAU</span>
                        </Typography>

                        <Input placeholder={t('navbar.search')}
                               disableUnderline={true}
                               className={style.searchBar}
                               inputProps={{'aria-label': 'description'}}
                               onChange={(e)=>setSearchText(e.target.value)}
                               value={searchText}
                        />

                        <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                            <Button sx={styles.textColorWhite} onClick={()=>redirectTo("/")}>
                                {t('navbar.home')}
                            </Button>

                            {
                                isLogged() ?
                                    <Button sx={styles.textColorWhite} onClick={()=>redirectTo(userFullNameStored.replaceAll(" ", ""))}>
                                        {t('navbar.profile')}
                                    </Button>
                                    :
                                    null
                            }

                            {
                                isLogged() ?
                                    <Button sx={styles.textColorWhite} onClick={handleLogout}>
                                        {t('navbar.logout')}
                                    </Button>
                                    :
                                    null
                            }


                            {
                                !isLogged() ?
                                    <Button sx={styles.textColorWhite} onClick={openLoginModal}>
                                        {t('navbar.login')}
                                    </Button>
                                    :
                                    null
                            }

                            {
                                !isLogged() ?
                                    <Button sx={styles.textColorWhite} onClick={openRegModal}>
                                        {t('navbar.register')}
                                    </Button>
                                    :
                                    null
                            }

                        </Box>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>

            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
                        <Typography variant="h6" sx={{my: 2}}>
                            MUI
                        </Typography>
                        <Divider/>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton sx={{textAlign: 'center'}} onClick={()=>redirectTo("/")}>
                                    <ListItemText primary={t('navbar.home')}/>
                                </ListItemButton>
                            </ListItem>
                            {
                                isLogged() ?
                                    <div>
                                        <ListItem disablePadding>
                                            <ListItemButton sx={{textAlign: 'center'}} onClick={()=>redirectTo(userFullNameStored.replaceAll(" ", ""))}>
                                                <ListItemText primary={t('navbar.profile')}/>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton sx={{textAlign: 'center'}}>
                                                <ListItemText primary={t('navbar.logout')}/>
                                            </ListItemButton>
                                        </ListItem>
                                    </div>
                                    :
                                    <div>
                                        <ListItem disablePadding>
                                            <ListItemButton sx={{textAlign: 'center'}}>
                                                <ListItemText primary={t('navbar.login')} onClick={openLoginModal}/>
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton sx={{textAlign: 'center'}}>
                                                <ListItemText primary={t('navbar.register')} onClick={openRegModal}/>
                                            </ListItemButton>
                                        </ListItem>
                                    </div>
                            }
                        </List>
                    </Box>
                </Drawer>
            </Box>

            {/*LOGIN MODAL*/}
            <Dialog
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            >
                <DialogTitle>
                    {t('navbar.login')}
                </DialogTitle>
                <DialogContent>
                    <TextField InputProps={{className: style.marginBottom15}}
                               fullWidth id="standard-basic"
                               label={t('auth.email')}
                               variant="standard"
                               onKeyDown={handleLoginOnEnter}
                               onChange={(e)=>{onEmailChange(e.target.value)}}
                    />


                    <TextField fullWidth id="standard-basic"
                               label={t('auth.password')}
                               variant="standard"
                               type="password"
                               id="password"
                               onKeyDown={handleLoginOnEnter}
                               onChange={(e)=>{onPasswordChange(e.target.value)}}
                    />
                </DialogContent>

                <DialogActions>
                    <Button sx={styles.textColorBlack} onClick={()=>setLoginModalOpen(false)}>{t('general.cancel')}</Button>
                    <Button sx={styles.textColorBlack} onKeyDown={handleLoginOnEnter} onClick={confirmLogin}>{t('general.confirm')}</Button>
                </DialogActions>


                {/*BACKDROP*/}
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isBackdropOpen}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Dialog>

            {/*REG MODAL*/}
            <Dialog
                open={regModalOpen}
                onClose={() => setRegModalOpen(false)}
            >
                <DialogTitle>
                    {t('navbar.register')}
                </DialogTitle>
                <DialogContent>
                    <TextField InputProps={{className: style.marginBottom15}}
                               fullWidth id="standard-basic"
                               label={t('auth.fullname')}
                               onKeyDown={handleRegOnEnter}
                               variant="standard" onChange={(e)=>{onFullNameChange(e.target.value)}}
                    />

                    <TextField InputProps={{className: style.marginBottom15}}
                               fullWidth id="standard-basic"
                               label={t('auth.email')}
                               variant="standard"
                               onKeyDown={handleRegOnEnter}
                               onChange={(e)=>{onEmailChange(e.target.value)}}
                    />

                    <TextField fullWidth id="standard-basic"
                               label={t('auth.password')}
                               variant="standard"
                               onKeyDown={handleRegOnEnter}
                               onChange={(e)=>{onPasswordChange(e.target.value)}}
                    />
                </DialogContent>

                <DialogActions>
                    <Button sx={styles.textColorBlack} onClick={()=>setRegModalOpen(false)}>{t('general.cancel')}</Button>
                    <Button sx={styles.textColorBlack} onKeyDown={handleRegOnEnter} onClick={confirmReg}>{t('general.confirm')}</Button>
                </DialogActions>
            </Dialog>

        </Fragment>
    )
}

export default Navbar;