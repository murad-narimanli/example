import React , {useState , useEffect} from 'react';
import {Col , Row ,  List, Checkbox, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import Images from "../../../../assets/img/Images/Images";
function SelectModuls(props) {
    const { t } = useTranslation();
    const [taskm , setTaskm] = useState(false);
    const [finance , setFinance] = useState(false);
    const [storageSum , setStorageSum] = useState(1)
    const [warehouse , setWarehouse] = useState(false);
    const [garage , setGarage] = useState(false);
    const [user , setUser] = useState(1)
    const [finished , setFinished] = useState(0)
    const [sum , setSumm] = useState(0)
    const additional = 4000
    const getQuantiy = () =>{
        let s = (taskm && 50) +  (finance && 100 ) +  (warehouse && 100) + (garage && 100) + (100*storageSum)  + (user*10)
        setFinished(s);
        setSumm(s +  additional)
    }

    useEffect(()=>{
        getQuantiy()
    })

    return (
        <div className='selectModule animated fadeIn'>
            <Row gutter={[48, 48]}>
                <Col xl={12} sm={24} >
                    <div className="card white mb-15">
                        <List
                            size="small"
                        >
                            <List.Item>
                                <div className="w-100">
                                    <Row gutter={[8 , 0]} className='flex flex-align-center  ' >
                                        <Col lg={13} md={13}><span className='name'>{t('humanResources')}</span></Col>
                                        <Col lg={11} md={11}>
                                            <div className="flex flex-align-center flex-between ">
                                                <span>
                                                    <InputNumber  type="number" min={1} defaultValue={user} onChange={(value) => {setUser(value)}} />
                                                    <span className='mr-10 ml-15 '>{t('user')}</span>
                                                </span>
                                                <div className='quantity'>
                                                    <span>{user*10} <sup><img src={Images.manatgreen} alt=""/></sup></span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </List.Item>
                            <List.Item>
                                <div className="w-100">
                                    <Row gutter={[8 , 0]} className='flex flex-align-center flex-between' >
                                        <Col lg={13} md={13}><span className='name'>{t('storage')}</span></Col>
                                        <Col lg={11} md={11}>
                                            <div className="flex flex-align-center flex-between ">
                                                <span>
                                                     <InputNumber type="number" min={1} defaultValue={user} onChange={(value) => {setStorageSum(value)  }} />
                                                    <span className='font-weight-bold ml-15 f-10'>gb</span>
                                                </span>
                                                <div className='quantity'>
                                                    <span>{storageSum*100} <sup><img src={Images.manatgreen} alt=""/></sup></span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </List.Item>
                        </List>
                    </div>
                    <div className="card white">
                        <div>
                            <List
                                size="small"
                            >
                                <List.Item>
                                    <div className="w-100">
                                        <Row gutter={[8 , 0]} className='flex flex-align-center' >
                                            <Col  sm={14} span={14}><span className='name'>{t('manegment')}</span></Col>
                                            <Col lg={2} sm={3} span={3}>
                                                <Checkbox
                                                    checked={taskm}
                                                    onChange={(e)=>{setTaskm(e.target.checked)}}
                                                />
                                            </Col>
                                            <Col sm={5} span={6}>
                                                <div>
                                                    <div className='quantity'>
                                                        <span>50 <sup><img src={Images.manatgreen} alt=""/></sup></span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <div className="w-100">
                                        <Row gutter={[8 , 0]} className='flex flex-align-center' >
                                            <Col  sm={14} span={14}><span className='name'>{t('financeAdmin')}</span></Col>
                                            <Col lg={2} sm={3} span={3}>
                                                <Checkbox
                                                    checked={finance}
                                                    onChange={(e)=>{setFinance(e.target.checked)}}
                                                />
                                            </Col>
                                            <Col sm={5} span={6}>
                                                <div>
                                                    <div className='quantity'>
                                                        <span>100 <sup><img src={Images.manatgreen} alt=""/></sup></span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <div className="w-100">
                                        <Row gutter={[8 , 0]} className='flex flex-align-center' >
                                            <Col sm={14} span={14}><span className='name'>{t('warehouse')}</span></Col>
                                            <Col lg={2} sm={3} span={3}>
                                                <Checkbox
                                                    checked={warehouse}
                                                    onChange={(e)=>{setWarehouse(e.target.checked)}}
                                                />
                                            </Col>
                                            <Col sm={5} span={6}>
                                                <div>
                                                    <div className='quantity'>
                                                        <span>100 <sup><img src={Images.manatgreen} alt=""/></sup></span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <div className="w-100">
                                        <Row gutter={[8 , 0]} className='flex flex-align-center' >
                                            <Col  sm={14} span={14}><span className='name'>{t('garage')}</span></Col>
                                            <Col lg={2} sm={3}  span={3}>
                                                <Checkbox
                                                    checked={garage}
                                                    onChange={(e)=>{setGarage(e.target.checked)}}
                                                />
                                            </Col>
                                            <Col sm={5} span={6}>
                                                <div>
                                                    <div className='quantity'>
                                                        <span>100 <sup><img src={Images.manatgreen} alt=""/></sup></span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </List.Item>

                            </List>
                        </div>
                       <div className="img">
                           <div className="relative">
                               <img src={Images.bottomimg} alt=""/>
                           </div>
                       </div>
                    </div>
                </Col>
                <Col xl={12} sm={24} >
                    <div className="card green">
                        <div>
                            {/*<p className='text-white text-center mb-15' >*/}
                            {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta enim exercitation*/}
                            {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta enim exercitation*/}
                            {/*</p>*/}
                            <List
                                size="large"
                                className='mt-15'
                            >
                                <List.Item>
                                    <div className="w-100">
                                        <Row gutter={[8 , 8]} className='flex flex-align-center ' >
                                            <Col md={8}><span className='heading'>{t('userCost')}:</span></Col>
                                            <Col md={16}>
                                                <div className="flex all-center">
                                                    <div className="quantity">
                                                        <span className="mr-5">
                                                            {user*10}
                                                        </span>
                                                        <sup>
                                                            <img src={Images.manatwhite} alt=""/>
                                                        </sup>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <div className="w-100">
                                        <Row gutter={[8 , 8]} className='flex flex-align-center ' >
                                            <Col md={8}><span className='heading'>{t('storageCost')}:</span></Col>
                                            <Col md={16}>
                                                <div className="flex all-center">
                                                    <div className="quantity">
                                                        <span className='mr-5'>{storageSum*100}</span>
                                                        <sup>
                                                            <img src={Images.manatwhite} alt=""/>
                                                        </sup>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={8}><span className='heading'>{t('packCost')}:</span></Col>
                                            <Col md={16}>
                                                <div className="flex all-center">
                                                    <div className="quantity">
                                                        <span className='mr-5'>{finished}</span>
                                                        <sup>
                                                            <img src={Images.manatwhite} alt=""/>
                                                        </sup>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md={8}><span className='heading'>{t('additionalCost')}:</span></Col>
                                            <Col md={16}>
                                                <div className="flex all-center">
                                                    <div className="quantity">
                                                        <span className='mr-5'>{additional}</span>
                                                        <sup>
                                                            <img src={Images.manatwhite} alt=""/>
                                                        </sup>
                                                    </div>
                                                </div>
                                            </Col>

                                        </Row>
                                    </div>
                                </List.Item>
                                <List.Item>
                                    <div className="w-100">
                                        <Row gutter={[8 , 0]} className='flex flex-align-center ' >
                                            <Col md={8}><span className='heading'>{t('finalCost')}:</span></Col>
                                            <Col md={16}>
                                                <div className="flex all-center">
                                                    <div className="quantity">
                                                        <span className='mr-5'>{sum}</span>
                                                        <sup>
                                                            <img src={Images.manatwhite} alt=""/>
                                                        </sup>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </List.Item>
                            </List>
                        </div>
                        <div className="flex mt-20 pt-15 all-center">
                            <button
                                onClick={()=>{props.setCurrent(1)}}
                                className="btm-warning  shadow">
                                {t('continue')}
                            </button>
                        </div>
                        <div className="list">
                            <img src={Images.list11} alt=""/>
                            <img src={Images.list12} alt=""/>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}


export default SelectModuls;
