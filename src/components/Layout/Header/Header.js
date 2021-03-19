import React, {useEffect,useState} from 'react';
import {NavLink, Link} from "react-router-dom";
import CustomSelect from "../../Elements/CustomSelect";
import Images from "../../../assets/img/Images/Images";
import Login from "../Login/Login";
import MobileLangSelect from "../../Elements/MobileLangSelect";
import {useTranslation} from "react-i18next";
function Header(props) {
    const { t } = useTranslation();
    const [scroll , setScroll] = useState(false)
    const [showLogin , setShowLogin] = useState(false)
    const [showHeader, setShowHeader] = useState(false)
    const [mobile , setMobile ] =  useState(false)
    const scrollFunc  = () => {
        window.onscroll = function() {
            if (window.pageYOffset >= 10) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        };
    }
    const dedectwidth = () =>{
        if (window.innerWidth <= 1016) {
            setMobile(true)
        }
        else {
            setMobile(false)
            setShowHeader(false)
        }
    }
    useEffect(()=>{
         scrollFunc()
        dedectwidth()
    })

    return (
        <>
        <div  id='navbar' className={`header  ${props.isWhite ? 'white' : ''} ${scroll ? 'active' : ''}  `}>
            {(showLogin || showHeader) && <div onClick={()=>{setShowLogin(false); setShowHeader(false)}} className="overlay"></div>}
            <nav>
               <div className="logo">
                  <Link to='/'>
                      {props.isWhite && !scroll ?
                          <img src={Images.whitelogo} alt=""/>
                          :<img src={Images.blacklogo} alt=""/>
                      }
                  </Link>
               </div>
               <div className={`nav-menu ${showHeader && 'show'}`}>
                   <NavLink onClick={()=>{setShowHeader(false)}} exact className='nav-link'  activeClassName="active" to="/"><span>{t('layoutLinks.home')}</span></NavLink>
                   <NavLink onClick={()=>{setShowHeader(false)}}  exact className='nav-link'   activeClassName="active" to="/about"><span>{t('layoutLinks.about')}</span></NavLink>
                   <NavLink onClick={()=>{setShowHeader(false)}}  exact className='nav-link'   activeClassName="active" to="/products"><span>{t('layoutLinks.products')}</span></NavLink>
                   <NavLink onClick={()=>{setShowHeader(false)}} exact className='nav-link'   activeClassName="active" to="/packs"><span>{t('layoutLinks.packs')}</span></NavLink>
                   {mobile &&
                   <div className="mobileElements">
                       <div className="lists">
                           <img src={Images.list11} alt=""/>
                           <img src={Images.list12} alt=""/>
                       </div>
                       <div className="lang">
                           <MobileLangSelect/>
                       </div>
                       <div  onClick={()=>{setShowHeader(false) } }  className="closeIcon">
                           <img src={Images.close} alt=""/>
                       </div>
                   </div>
                   }
               </div>
                <div className='flex flex-end flex-align-center'>
                    {!mobile &&
                    <div className="lang pr-1">
                        <CustomSelect isWhite={props.isWhite}/>
                    </div>
                    }
                    <div  onClick={()=>{setShowLogin(true)}} className="button transition">
                        <button className="btm-warning">
                            {
                                mobile ?
                                    <img src={Images.signIn} alt=""/>
                                    : <span>{t('login')}</span>
                            }
                        </button>

                    </div>
                    {mobile &&
                    <div onClick={()=>{setShowHeader(true) } } className="toggler">
                        <button className="btm-warning">
                            <img src={Images.menu} alt=""/>
                        </button>
                    </div>
                    }
                </div>
           </nav>
        </div>
           <>
               <div className={`loginsidebar  ${showLogin ? 'show' : ''}  ${!props.isWhite && 'black'}`}>
                   {showLogin && <Login setShowLogin={setShowLogin}/>}
               </div>
           </>
        </>
    );
}

export default Header;
