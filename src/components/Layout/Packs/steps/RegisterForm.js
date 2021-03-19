import React from 'react';
import {
    Input,
    Row,
    DatePicker,
    Col,
    Form,
    Select,
} from "antd";
import { noWhitespace, whiteSpace } from "../../../../utils/rules";
import {useTranslation} from "react-i18next";
import Images from "../../../../assets/img/Images/Images";
const { Option } = Select;
function RegisterForm(props) {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    return (
        <div className='animated fadeIn registerForm'>
              <div className="content pt-1">
                  <Form
                      form={form}
                      // onFinish={saveItem}
                      className="form"
                      layout="vertical"
                  >
                      <div>
                          <Row gutter={[16, 8]}>
                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="1"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={'fullnameLabel'} />
                                  </Form.Item>
                              </Col>
                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="2"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('username')} />
                                  </Form.Item>
                              </Col>
                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="3"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('fin')} />
                                  </Form.Item>
                              </Col>

                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      // label={t("agreementDocumentDate")}
                                      name="4"
                                      validateTrigger="onChange"
                                      rules={[noWhitespace(t("inputError"))]}
                                  >
                                      <DatePicker placeholder={t('birthdate')} className="w-100" />
                                  </Form.Item>
                              </Col>

                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="5"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('email')} type='email'/>
                                  </Form.Item>
                              </Col>

                             <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="6"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('contactNumber')} type='phone'/>
                                  </Form.Item>
                              </Col>

                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="7"
                                      rules={[noWhitespace(t("inputError"))]}
                                  >
                                      <Select placeholder={t('sex')}>
                                          <Option value="1">{t('man')}</Option>
                                          <Option value="2">{t('woman')}</Option>
                                      </Select>
                                  </Form.Item>
                              </Col>

                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="8"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('adress')} />
                                  </Form.Item>
                              </Col>

                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="9"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input.Password placeholder={t('password')}/>
                                  </Form.Item>
                              </Col>
                              <Col span={24}>
                                  <div className="companyInfo flex all-center">
                                      <img src={Images.listshadow} alt=""/>
                                      <p>{t('companyInfo')}</p>
                                  </div>
                              </Col>
                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="0"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('companyName')}/>
                                  </Form.Item>
                              </Col>
                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="11"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('companyEmail')} />
                                  </Form.Item>
                              </Col>
                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="12"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder='VÖEN'/>
                                  </Form.Item>
                              </Col>
                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="13"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('adress')}/>
                                  </Form.Item>
                              </Col>
                              <Col lg={8} sm={12} xs={24}>
                                  <Form.Item
                                      validateTrigger="onChange"
                                      name="14"
                                      rules={[whiteSpace(t("inputError"))]}
                                  >
                                      <Input placeholder={t('contactNumber')}/>
                                  </Form.Item>
                              </Col>
                              <Col span={24}>
                                  <div className="list">
                                      <img src={Images.list31} alt=""/>
                                      <img src={Images.list32} alt=""/>
                                  </div>
                              </Col>
                              <Col span={24}>
                                  <div className="flex mt-20 pt-15 all-center">
                                      <button
                                          // onClick={()=>{props.setCurrent(2)}}
                                          className="btm-warning  shadow">
                                          {t('continue')}
                                      </button>
                                  </div>
                              </Col>
                          </Row>

                      </div>
                  </Form>

              </div>
        </div>
    );
}


export default RegisterForm;
