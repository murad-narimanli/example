import React from 'react';
import {
    EyeTwoTone,
    EyeInvisibleOutlined
} from "@ant-design/icons";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, DatePicker, Input, Row, Select } from "antd";
const { Option } = Select;

function PersonlInfoStep(props) {
    const {  getFieldDecorator } = props.form;
    function selectHandleChange(value) {
        // do something
    }
    return (
        <div className='animated zoomIn border mt-15 mb-15'>
            <div className="p-2 ">
                <Form layout="vertical">
                    <div className="commontask">
                        <Row gutter={[16,16]}>

                            <Col lg={8} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("nameFull", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input placeholder='Adı Soyadı Ata adı'/>)}
                                </Form.Item>
                            </Col>

                            <Col lg={8} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("nickName", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input placeholder='İstifadəçi adı'/>)}
                                </Form.Item>
                            </Col>

                            <Col lg={8} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("borthDate", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                            },
                                        ],
                                    })(<DatePicker placeholder='Doğum tarixi' className='w-100'/>)}
                                </Form.Item>
                            </Col>

                            <Col lg={8} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("sex", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                            },
                                        ],
                                    })(
                                        <Select  placeholder='Cinsi' onChange={selectHandleChange}>
                                            <Option value="1">Kişi</Option>
                                            <Option value="2">Qadın</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>


                            <Col lg={8} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("email", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input placeholder='Email'/>)}
                                </Form.Item>
                            </Col>

                            <Col lg={8} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("phoneNumber", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input placeholder='Əlaqə Nömrəsi    '/>)}
                                </Form.Item>
                            </Col>

                            <Col  xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("adress", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input placeholder='Ünvan'/>)}
                                </Form.Item>
                            </Col>

                            <Col  sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("password", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(
                                        <Input.Password
                                            placeholder="Şifrə"
                                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col  sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("retryPadd", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(
                                        <Input.Password
                                            placeholder="Təkrar şifrə"
                                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                    </div>
                </Form>
            </div>
        </div>
    );
}
const WrappedPersonlInfoStep = Form.create({ name: "PersonlInfoStep" })(
    PersonlInfoStep
);
export default WrappedPersonlInfoStep;

