import React from 'react';
import Images from "../../../assets/img/Images/Images";
import { useTranslation } from "react-i18next";

function About(props) {
    const { t } = useTranslation();

    return (
        <div className="about fadeIn animated">
            <div className="content words">
                <img src={Images.blackTimesoft} alt=""/>
                <p>
                    {t('aboutCompany')}
                </p>
            </div>
            <div className="content yellow">
                <img className='logo' src={Images.agrosWhite} alt=""/>
                {/*<p>*/}
                {/*    {t('aboutAgros')}*/}
                {/*</p>*/}
                <p>
                    {t('aboutAgros2')}
                </p>
                <div className="lists">
                    <img src={Images.list21} alt=""/>
                    <img src={Images.list11} alt=""/>
                    <img src={Images.list12} alt=""/>
                </div>
            </div>
        </div>
    );
}


export default About;
