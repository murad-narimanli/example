import React from "react";
// import profile from "./../../../assets/img/profle.jpg";
import man from "./../../../assets/img/man.jpg";
import woman from "./../../../assets/img/women.jfif";
import {
  BellFilled,
  LogoutOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import logo from "./../../../assets/img/logo.png";
import { Button, Badge, Popover, Tooltip, Avatar, Row, Col } from "antd";
import { logOut } from "../../../redux/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../const/history";
import { useTranslation } from "react-i18next";

const TopMenu = (props) => {
  const { t } = useTranslation();
  const logOut = () => {
    localStorage.removeItem("access_token");
    props.logOut();
    history.push("/");
  };

  const content = () => {
    return (
      <div className="profil-info">
        <Row className="border-bottom pt-1 pb-1 mb-10">
          <Col xs={4}>
            <Avatar size={38} src={props.gender === 0 ? man : woman} />
          </Col>
          <Col className="border-right" xs={20}>
            <div className="flex w-100 h-100 flex-align-center pr-1">
              <h3>{props.name}</h3>
            </div>
          </Col>
        </Row>
        <div className="w-100  flex flex-between">
          <Button>
            <SettingOutlined /> <span>{t("settings")}</span>
          </Button>
          <Button onClick={logOut}>
            <span>{t("logOut")}</span> <LogoutOutlined />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="position-relative">
      <div className="top-menu flex-align-center flex ">
        {props.showDrawerButton ? (
          <Button type="primary" className="mr-20" onClick={props.toggleDrawer}>
            {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        ) : null}
        {props.collapsed ? (
          <Link to="/">
            <img className="animated fadeIn" src={logo} alt="" />
          </Link>
        ) : null}
        <div className="top-menu-navigation">
          <Link to={`/reports`}>
            <Tooltip placement="bottomRight" title={t("notifications")}>
              <Badge>
                <Avatar
                  className="circle-notification"
                  size={35}
                  icon={<BellFilled />}
                />
              </Badge>
            </Tooltip>
          </Link>
          <Tooltip placement="bottomRight" title={props.name}>
            <Popover
              className="ml-20"
              placement="bottomRight"
              content={content()}
              trigger="click"
            >
              <Avatar size={35} src={props.gender === 0 ? man : woman} />
            </Popover>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ user }) => {
  return {
    name: user.data.userName,
    gender: user.data.userGender,
  };
};
export default connect(mapStateToProps, { logOut })(TopMenu);
