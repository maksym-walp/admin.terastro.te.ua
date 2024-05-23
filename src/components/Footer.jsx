import React from "react";
import { FaFacebook } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { SiBlogger } from "react-icons/si";
import { IoIosMail } from "react-icons/io";
import "./stylles/Footer.css"

export default function Footer(){
    return(
        <div className="footer-container">
            <div className="footer-headline">
                <h1>
                    Клуб любителів астрономії “ТерАстро”. Астрономічне товариство Тернопільського району “Небозвід”.
                </h1>
            </div>
            <div className="footer_social_network">
                <a href="https://facebook.com/groups/astroTernopil/" target="_blank"><FaFacebook/></a>
                <a href="https://instagram.com/astroternopil/" target="_blank"><GrInstagram/></a>
                <a href="https://nebozvid.blogspot.com/" target="_blank"><SiBlogger/></a>
                <a href="mailto:terastro2017@gmail.com" target="_blank"><IoIosMail/></a>
            </div>
           
        </div>
    )
}
