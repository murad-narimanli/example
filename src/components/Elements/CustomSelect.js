import React , {useState , useEffect} from 'react';
import {changeLanguage} from "../../redux/actions";
import {withTranslation} from "react-i18next";
import { connect } from "react-redux";

function CustomSelect(props) {
    const [lang, setLang] = useState("az");
    const [select , setSelect] = useState(false);

    useEffect(() => {
            setLang(
                localStorage.getItem("locale") ? localStorage.getItem("locale") : "az"
            );
        } , [lang]
    )

    const changeLang = (lang) => {
        const { i18n } = props;
        i18n.changeLanguage(lang);
        localStorage.setItem("locale", lang);
        props.changeLanguage(lang);
        setLang(lang);
    };
    return (
       <div className={`customselect ${props.isWhite ? 'white': ''}`}>
           <div className="select" onClick={()=>{setSelect(!select)}}>
               <div className="selected">
                   <b>
                       <span className='mr-5'>{lang}</span>
                       <svg  className={`transition ${select ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="6.814" height="5.831" viewBox="0 0 6.814 5.831">
                           <path id="arrow-button-down-2" d="M7.014,2.262a.581.581,0,0,0-.506-.3H.856a.581.581,0,0,0-.5.882l2.826,4.67a.581.581,0,0,0,.994,0l2.826-4.67A.581.581,0,0,0,7.014,2.262Z" transform="translate(-0.275 -1.966)" />
                       </svg>
                   </b>
               </div>
               {select &&
                   <div className="choose animated fadeIn">
                       {lang !== 'az' &&
                           <b  onClick={() => changeLang("az")}>
                               <span className='mr-5'>AZ</span>
                           </b>
                       }
                       {lang !== 'en' &&
                       <b  onClick={() => changeLang("en")}>
                           <span className='mr-5'>EN</span>
                       </b>
                       }
                       {lang !== 'ru' &&
                       <b  onClick={() => changeLang("ru")}>
                           <span className='mr-5'>RU</span>
                       </b>
                       }
                   </div>
               }
           </div>
       </div>
    );
}

export default connect(null, { changeLanguage })(withTranslation()(CustomSelect));
