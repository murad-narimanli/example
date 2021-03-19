import React from 'react';
import Images from "../../../../assets/img/Images/Images";
import {Col, Row} from "antd";

function Product(props) {
    return (
        <div className={`product`}>
            <div  className={`heading  ${props.direction}`}>
                <div className="circle">
                    <img src={Images.circle} alt=""/>
                    <span>{props.number}</span>
                </div>
                <div className='name'>
                    <p>
                        {props.name}
                    </p>
                </div>
                <div className='list'>
                    <img src={Images.list11} alt=""/>
                    <img src={Images.list12} alt=""/>
                </div>
            </div>
            <div className="content">
                <Row gutter={[16, 16]}>
                    {
                        props.direction === 'left' ?
                            <>
                                <Col span={17} >
                                    <p>
                                        {props.about}
                                    </p>
                                </Col>
                                <Col span={7}>
                                    <div className="flex all-center">
                                        <img src={props.image} alt=""/>
                                    </div>
                                </Col>
                            </> :
                            <>
                                <Col span={7}>
                                    <div className="flex all-center">
                                        <img src={props.image} alt=""/>
                                    </div>
                                </Col>
                                <Col span={17} >
                                    <p>
                                        {props.about}
                                    </p>
                                </Col>
                            </>
                    }
                </Row>
            </div>
        </div>
    );
}


export default Product;
