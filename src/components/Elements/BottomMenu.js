import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Button, Tooltip } from "antd";
import {
  QuestionCircleOutlined,
  BulbFilled,
  InfoCircleOutlined,
  RetweetOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { changeLanguage } from "../../redux/actions";
import az from "../../assets/img/az.svg";
import en from "../../assets/img/us.svg";
import ru from "../../assets/img/ru.svg";

const BottomMenu = (props) => {
  const [lang, setLang] = useState("az");
  const [flag, setFlag] = useState(az);

  const changeLang = (lang) => {
    const { i18n } = props;
    i18n.changeLanguage(lang);
    localStorage.setItem("locale", lang);
    props.changeLanguage(lang);
    setLang(lang);
  };

  useEffect(() => {
    setLang(
      localStorage.getItem("locale") ? localStorage.getItem("locale") : "az"
    );
    switch (lang) {
      case "az":
        setFlag(az);
        break;
      case "en":
        setFlag(en);
        break;
      case "ru":
        setFlag(ru);
        break;
      default:
        setFlag(az);
        break;
    }
  }, [lang]);

  const menu = (
    <Menu>
      <div className="pl-1">
        <p>Dil seçimi</p>
      </div>
      <Menu.Item key="az" onClick={() => changeLang("az")}>
        <div className="flex">
          <span className="mr5-10">
            <img src={az} alt="" />
          </span>
          <span>Azərbaycanca</span>
        </div>
      </Menu.Item>
      <Menu.Item key="en" onClick={() => changeLang("en")}>
        <div className="flex">
          <span className="mr5-10">
            <img src={en} alt="" />
          </span>
          <span>English</span>
        </div>
      </Menu.Item>
      <Menu.Item key="ru" onClick={() => changeLang("ru")}>
        <div className="flex">
          <span className="mr5-10">
            <img src={ru} alt="" />
          </span>
          <span>Русский</span>
        </div>
      </Menu.Item>
    </Menu>
  );
  const menu2 = (
    <Menu>
      <div className="pl-1">
        <p>Dəstək</p>
      </div>
      <Menu.Item>
        <div className="flex">
          <span className="mr5-10">
            <InfoCircleOutlined />
          </span>
          <span>Istifadə qaydaları</span>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div className="flex">
          <span className="mr5-10">
            <WarningOutlined />
          </span>
          <span>İstifadə şərtləri</span>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div className="flex">
          <span className="mr5-10">
            <RetweetOutlined />
          </span>
          <span>Geri bildirim</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bottom-menu border-top">
      <div>
        <Dropdown overlay={menu} placement="topLeft">
          <img src={flag} alt="" />
        </Dropdown>
      </div>
      <div className="icons">
        <span>
          <Dropdown overlay={menu2} placement="topRight">
            <Button shape="circle" className="border-none">
              <QuestionCircleOutlined />
            </Button>
          </Dropdown>
        </span>
        <span>
          <Tooltip placement="right" title="Dark mode">
            <Button shape="circle" className="border-none">
              <BulbFilled />
            </Button>
          </Tooltip>
        </span>
      </div>
    </div>
  );
};

export default connect(null, { changeLanguage })(withTranslation()(BottomMenu));
