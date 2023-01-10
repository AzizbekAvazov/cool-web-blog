import style from "./footer.module.css";
import {Link} from "@mui/material";
import {Facebook, LinkedIn, Mail, Phone} from "@mui/icons-material";

const Footer = () => {

    return (
        <div className={style.wrapper}>
            <Link className={style.link} target="_blank" href="https://www.facebook.com/azizbekavazov.d">
                <Facebook className={style.img}/>
                <span>Facebook</span>
            </Link>
            <Link className={style.link} target="_blank" href="https://www.linkedin.com/">
                <LinkedIn className={style.img}/>
                <span>Linkedin</span>
            </Link>
            <div>
                <Phone className={style.img}/>
                <span>+44 7775217759</span>
            </div>
            <div>
                <Mail className={style.img}/>
                <span>avazovturin@gmail.com</span>
            </div>
        </div>
    )
}

export default Footer;