import React from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from 'antd';
import Images from "../../../assets/img/Images/Images";

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="content animated fadeIN home">
        <Carousel className='slider' autoplay={true} dotPosition={'right'}>
          <div className='slide'>
            <h1>
                {t('slide1')}
            </h1>
            <p>
               <span>
                   {t('subslide1')}
              </span>
            </p>
          </div>
          <div className='slide'>
              <h1>
                  {t('slide2')}
              </h1>
              <p>
               <span>
                   {t('subslide2')}
              </span>
              </p>
          </div>
          <div className='slide'>
              <h1>
                  {t('slide3')}
              </h1>
              <p>
               <span>
                   {t('subslide3')}
              </span>
              </p>
          </div>
        </Carousel>

        <div className="footer">
            <div className="social">
               <div className='flex flex-align-center dir-column flex-between'>
                   <a href="/">
                       <img src={Images.fb} alt=""/>
                   </a>
                   <a href="/">
                       <img src={Images.tw} alt=""/>
                   </a>
                   <a href="/">
                       <img src={Images.yt} alt=""/>
                   </a>
               </div>
            </div>
            <div className="flex flex-align-center povered">
                <span className='mr-10'>powered by</span>
                <img src={Images.whiteTimesoft} alt=""/>
            </div>
        </div>
    </div>
  );
};

export default Home;
