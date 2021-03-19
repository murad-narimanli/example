import React , {useState , useEffect} from 'react';
import {connect} from "react-redux";
import {changeLanguage} from "../../redux/actions";
import {withTranslation} from "react-i18next";

function MobileLangSelect(props) {
    const [lang, setLang] = useState("az");

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
        <div className="flex">
            <span  onClick={() => changeLang("ru")} className={`${lang === 'ru' && 'active'}`}>RU</span>
            <span  onClick={() => changeLang("en")} className={`${lang === 'en' && 'active'}`}>EN</span>
            <span  onClick={() => changeLang("az")} className={`${lang === 'az' && 'active'}`}>AZ</span>
        </div>
    );
}

export default connect(null, { changeLanguage })(withTranslation()(MobileLangSelect));


