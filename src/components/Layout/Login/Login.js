import React, { useState, useEffect } from "react";
import { message } from "antd";
import { connect } from "react-redux";
import { Form, Input , Checkbox  } from 'antd';
import {Link} from 'react-router-dom'
import { logInUser } from "./../../../redux/actions/index";
import Images from "../../../assets/img/Images/Images";
import {useTranslation} from "react-i18next";


const Login = (props) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [checked , setChecked] = useState(true)
  useEffect(() => {
    if (props.message.trim().length !== 0) {
      message.warning(props.message);
    }
  }, [props.message, props.notify]);

  const logUserIn = async (e) => {
    e.preventDefault();
    await props.logInUser(username, password);
  };
  const [form] = Form.useForm();
  return (
        <div className="h-100vh flex dir-column justify-center login">
          <div className="head h-100">
            <div className="w-100">
              <Link class='text-center w-100' onClick={()=>{props.setShowLogin(false)}} to='/packs'>{t('register')}</Link>
              <div><img onClick={()=>{props.setShowLogin(false)}} src={Images.close} alt="close"/></div>
            </div>
          </div>
          <div className="position-relative">
            <h2 className="text-center">{t('entry')}</h2>
            <div className="customForm">
              <Form
                  layout={'vertical'}
                  form={form}
              >
                <Form.Item label={t('email')}>
                  <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder={t('email')} />
                </Form.Item>
                <Form.Item label={t('password')}>
                  <Input.Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder={t('password')} />
                </Form.Item>
                <Form.Item  name="remember" >
                  <Checkbox checked={true}>{t('remember')}</Checkbox>
                </Form.Item>
                <Form.Item>
                  <div className='flex all-center'>
                    <button  onClick={logUserIn} className='shadow btm-warning'>{t('login')}</button>
                  </div>
                </Form.Item>
              </Form>
            </div>
            <div className="lists">
              <img src={Images.list1} alt=""/>
              <img src={Images.list2} alt=""/>
            </div>
          </div>
        </div>
  );
};
const mapStateToProps = ({ user }) => {
  return {
    loggedIn: user.isLoggedIn,
    message: user.message,
    notify: user.notify,
  };
};

export default connect(mapStateToProps, { logInUser })(Login);
