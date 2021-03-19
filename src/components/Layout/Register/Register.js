import React from 'react';
import { Steps, Button, message ,  Row, Col} from 'antd';
import {
    ArrowRightOutlined ,
    DollarOutlined ,
    ArrowLeftOutlined
} from "@ant-design/icons";
import mainBg from "./../../../assets/img/mainbg.jpg";
import PricePlanStep from "./Steps/PricePlanStep";
import PersonlInfoStep from "./Steps/PersonlInfoStep";
import CompanyInfoStep from "./Steps/CompanyInfoStep";
import PaymentStep from "./Steps/PaymentStep";
import './style/register.css'
import {Link} from "react-router-dom";
const { Step } = Steps;

function Register(props) {

    const [current , setCurrent] = React.useState(0)

    const next = () => {
        setCurrent(current + 1);
    }

    const prev = () => {
        setCurrent(current - 1);
    }

    const onChange = (current) =>{
        setCurrent(current);
    }

    const steps = [
        {
            title: 'Qiymət planı',
            content: <PricePlanStep current={current}  setCurrent={setCurrent} />
        },
        {
            title: 'Şəxsi məlumatlar',
            content: <PersonlInfoStep current={current}  setCurrent={setCurrent} />
        },
        {
            title: 'Şirkət məlumatları',
            content: <CompanyInfoStep current={current}  setCurrent={setCurrent} />
        },
        {
            title: 'Ödəniş',
            content: <PaymentStep current={current}  setCurrent={setCurrent} />
        },
    ];



    return (
        <Row className="register-page w-100 h-100vh">
            <Col lg={13} md={15} >
                <div className="flex all-center register-container">
                    <div className="register-box">
                        <div className="register-row mb-15 ">
                            <h1 className="text-center">Agros.az</h1>
                        </div>
                        <div>
                            <Steps onChange={onChange}  current={current}>
                                {steps.map(item => (
                                    <Step  key={item.title} title={item.title} />
                                ))}
                            </Steps>
                            <div className="steps-content">{steps[current].content}</div>
                            <div className="steps-action">
                                {current === 0 && (
                                    <Link to='/'>
                                        <Button className='animated fadeIn'  style={{ margin: '0 8px' }} onClick={prev}>
                                            <ArrowLeftOutlined /> Ana səhifə
                                        </Button>
                                    </Link>
                                )}
                                {current > 0 && (
                                    <Button className='animated fadeIn'  style={{ margin: '0 8px' }} onClick={prev}>
                                        <ArrowLeftOutlined /> Geri
                                    </Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button className='animated fadeIn'  type="primary" onClick={() => message.success('Processing complete!')}>
                                        <DollarOutlined /> Ödəniş
                                    </Button>
                                )}
                                {current < steps.length - 1 && (
                                <Button className='animated fadeIn'  type="primary" onClick={next}>
                                    İrəli <ArrowRightOutlined />
                                </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col  lg={11} md={9} sm={0} xs={0}>
                <div
                    className="b-100 h-100vh"
                    style={{
                            backgroundImage: `url(${mainBg})`,
                            backgroundSize:'cover',
                            backgroundRepeat:'no-repeat'
                        }}
                ></div>
            </Col>
        </Row>
    );
}



export default Register;
