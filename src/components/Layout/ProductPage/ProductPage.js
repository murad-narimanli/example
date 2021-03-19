import React from 'react';
import Images from "../../../assets/img/Images/Images";
import { Row, Col } from 'antd';
import { useTranslation } from "react-i18next";
import Product from "./ProductComponent/Product";

function ProductPage(props) {
    const { t } = useTranslation();
    return (
        <div className="animated fadeIn products">
           <div className="content">
               <div className="mainBg flex all-center">
                   <img src={Images.product} alt=""/>
               </div>
           </div>

            <Product
                number={1}
                direction={'left'}
                name={t('hr')}
                about={t('aboutHr')}
                image={Images.products1}
            />

            <Product
                number={2}
                direction={'right'}
                name={t('manegment')}
                about={t('aboutManagement')}
                image={Images.products2}
            />

            <Product
                number={3}
                direction={'left'}
                name={t('warehouse')}
                about={t('aboutWarehouse')}
                image={Images.products3}
            />

        </div>
    );
}


export default ProductPage;
