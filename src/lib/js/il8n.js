import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    // here we will place our translations...
                    general: {
                        cancel: "Cancel",
                        confirm: "Confirm"
                    },
                    auth: {
                        fullname: "Enter full name",
                        email: "E-mail",
                        password: "Password"
                    },
                    navbar: {
                        home: "Home",
                        login: "Login",
                        register: "Registration",
                        profile: "My profile",
                        logout: "Logout",
                        search: "Search"
                    },
                    profile: {
                        your_blogs: "Your blogs",
                        create_new_blog: "Create new blog",
                        save: "Save",
                        title: "Title",
                        blogs: " blogs",
                        delete_post: "Do you really want to delete this post?",
                        tags: "Tags"
                    }
                }
            },
            uz: {
                translation: {
                    // here we will place our translations...
                    general: {
                        cancel: "Bekor qilish",
                        confirm: "Tasdiqlash"
                    },
                    auth: {
                        fullName: "Ism sharif",
                        email: "E-mail",
                        password: "Parol"
                    },
                    navbar: {
                        home: "Asosiy",
                        login: "Login",
                        register: "Rōyhatdan ōtish",
                        profile: "Mening profilim",
                        logout: "Chiqish",
                        search: "Izlash"
                    },
                    profile: {
                        your_blogs: "Sizning postlaringiz",
                        create_new_blog: "Yangi post yaratish",
                        save: "Saqlash",
                        title: "Sarlavha",
                        blogs: " postlari",
                        delete_post: "Haqiqatan ham bu postni o'chirmoqchimisiz?",
                        tags: "Teglar"
                    },
                }
            }
        }
    });

export default i18n;