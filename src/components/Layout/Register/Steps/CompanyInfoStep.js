import React from 'react';
import {
    MinusOutlined,
    PlusOutlined
} from "@ant-design/icons";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Tooltip, Row } from "antd";
function CompanyInfoStep(props) {
    const {  getFieldDecorator } = props.form;
    return (
        <div className='animated zoomIn border mt-15 mb-15'>
            <div className="p-2 ">
                <Form layout="vertical">
                    <div className="commontask">
                        <Row gutter={[16,16]}>

                            <Col md={12} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("companyName", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input placeholder='Şirkət Adı'/>)}
                                </Form.Item>
                            </Col>

                            <Col md={12} sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("companyEmail", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input placeholder='Şirkət Emaili'/>)}
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("companyAdress", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input placeholder='Şirkətin ünvanı'/>)}
                                </Form.Item>
                            </Col>

                            <Col sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("contactNumber1", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input
                                        placeholder='Əlaqə nömrəsi'
                                        addonAfter={
                                            <Tooltip placement='bottom' title='Əlavə et'>
                                                <Button className='border-none addButton' size='small'><PlusOutlined /></Button>
                                            </Tooltip>
                                        }
                                    />)}
                                </Form.Item>
                            </Col>
                            <Col sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("contactNumber1", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input
                                        placeholder='Əlaqə nömrəsi'
                                        addonAfter={
                                            <Tooltip placement='bottom' title='Sil'>
                                                <Button className='border-none addButton' size='small'><MinusOutlined /></Button>
                                            </Tooltip>
                                        }
                                    />)}
                                </Form.Item>
                            </Col>
                            <Col sm={12} xs={24}>
                                <Form.Item>
                                    {getFieldDecorator("contactNumber1", {
                                        validateTrigger: "onChange",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Xana doldurulmalıdır",
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input
                                        placeholder='Əlaqə nömrəsi'
                                        addonAfter={
                                            <Tooltip placement='bottom' title='Sil'>
                                                <Button className='border-none addButton' size='small'><MinusOutlined /></Button>
                                            </Tooltip>
                                        }
                                    />)}
                                </Form.Item>
                            </Col>

                        </Row>

                    </div>
                </Form>
            </div>
        </div>
    );
}
const WrappedCompanyInfoStep = Form.create({ name: "CompanyInfoStep" })(
    CompanyInfoStep
);
export default WrappedCompanyInfoStep;

