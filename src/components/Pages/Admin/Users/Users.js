import React, { useState, useEffect, useRef } from "react";
import "@ant-design/compatible/assets/index.css";
import {
  Row,
  Col,
  Card,
  Form,
  Table,
  Button,
  Tooltip,
  Input,
  Select,
  Popconfirm,
} from "antd";
import {
  UsergroupAddOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import agros from "../../../../const/api";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import {whiteSpace} from "../../../../utils/rules";
import Authorize from "../../../Elements/Authorize";
import {connect} from "react-redux";
import {notify} from "../../../../redux/actions";

const { Option } = Select;

function Users(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [permissionsGroups, setPermissionGroups] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "id", value: "", con: false },
  ];
  // props
  const {notify} = props;

  const nameInput = useRef();

  useEffect(() => {
    const getPermissionGroups = async () => {
      await agros.get("data/permissiongroups").then((res) => {
        setPermissionGroups(res.data);
      });
    };
    const getWorkers = async () => {
      await agros.get("hr").then((res) => {
        setWorkers(res.data);
      });
    };
    getPermissionGroups();
    getWorkers();
    getUsers();
  }, [t]);

  const getUsers = async () => {
    await agros.get("user").then((res) => {
      setUsers(
        res.data.map((p, index) => {
          return { key: index + 1, ...p, index: index + 1 };
        })
      );
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: 5,
    },
    {
      title: t("name"),
      dataIndex: "name",
      width: 250,
    },
    {
      title: "",
      dataIndex: "id",
      width: 30,
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Authorize mainMenu={'administrator'} page={['users','perms']} type={'delete'}>
              <Popconfirm
                  title={t("areYouSure")}
                  onConfirm={() => deleteUser(i)}
                  okText={t("yes")}
                  cancelText={t("no")}
              >
                <Tooltip className="ml-5" title={t("delete")}>
                  <Button className="border-none" type="text" shape="circle">
                    <DeleteFilled />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Authorize>
            <Authorize mainMenu={'administrator'} page={['users','perms']} type={'update'}>
               <Tooltip className="ml-5" title={t("edit")}>
                <Button
                    className="border-none"
                    type="text"
                    shape="circle"
                    onClick={() => setEditingObject(i)}
                >
                  <EditFilled />
                </Button>
              </Tooltip>
            </Authorize>
          </div>
        );
      },
    },
  ];

  const setEditingObject = async (i) => {
    setEditing(i);
    let user = users.find((u) => u.id === i);
    let obj = { name: user.name, password: "" };
    form.setFieldsValue(obj);
    nameInput.current.focus();
  };

  const cancelEditing = () => {
    setEditing(null);
    form.setFieldsValue({
      name: "",
      password: "",
      worker: null,
      permission: null,
    });
  };

  const deleteUser = async (i) => {
    await agros.delete(`user/${i}`).then((res) => {
      notify("", true);
      getUsers();
    });
  };

  const saveUser = (values) => {
    if (!editing) {
      let obj = {
        workerId: values.worker,
        username: values.name,
        password: values.password,
        permissionGroupId: values.permission,
      };
      agros.post("user", obj).then((res) => {
        notify("", true);
        getUsers();
        cancelEditing();
      }).catch((err) => {
        notify(err.response, false);
      });
    } else {
      let obj = {
        id: editing,
        password: values.password,
      };
      agros.put(`user/${editing}`, obj).then((res) => {
        notify("", true);
        getUsers();
        cancelEditing();
      }).catch(err=> {
        notify(err.response, false);
      });
    }
  };

  return (
    <Row gutter={[10, 10]}>
      <Col xs={24}>
        <div className="border p-2 mt-0 bg-white">
          <UsergroupAddOutlined className="f-20 mr5-15" />
          <span className="f-20 bold">{t("users")}</span>
        </div>
      </Col>
      <Col lg={12} xs={24}>
        <Table
          size="small"
          className="bg-white"
          columns={columns}
          dataSource={convertColumns(users, cols)}
          pagination={{ pageSize: 10, current_page: 1, total: users.length }}
        />
        ,
      </Col>
      <Col lg={12} xs={24}>
        <Card title={t("addTo")}>
          <Form form={form} layout="vertical" onFinish={saveUser}>
            <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="name"
              label={<span>{t("username")}</span>}
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input ref={nameInput} disabled={editing} autoComplete="off" />
            </Form.Item>

            <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="password"
              label={<span>{t("newPassword")}</span>}
              rules={[
                whiteSpace(t("addPasswordError")),
                {
                  min: 6,
                  message: t("minimumPasswordError"),
                },
              ]}
            >
              <Input.Password autoComplete="off" />
            </Form.Item>

            {!editing ? (
              <>
                <Form.Item
                  className="mb-5"
                  validateTrigger="onChange"
                  name="worker"
                  rules={[
                    {
                      required: true,
                      message: t("workerMustSelectError"),
                    },
                  ]}
                >
                  <Select
                    placeholder={<span className="ml-5">{t("worker")}</span>}
                  >
                    {workers.map((w, index) => {
                      return (
                        <Option key={index} value={w.id}>
                          {w.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  className="mb-5"
                  validateTrigger="onChange"
                  name="permission"
                  rules={[
                    {
                      required: true,
                      message: t("permissionMustSelectError"),
                    },
                  ]}
                >
                  <Select
                    placeholder={
                      <span className="ml-5">{t("positionGroup")}</span>
                    }
                  >
                    {permissionsGroups.map((p, index) => {
                      return (
                        <Option key={index} value={p.id}>
                          {p.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </>
            ) : null}
            <div className="flex  flex-between mt-15">
              <Button onClick={cancelEditing}>{t("cancel")}</Button>
              <Authorize mainMenu={'administrator'} page={['users','perms']} type={editing ? 'update' : 'create' }>
                <Button htmlType="submit" type="primary">{t("save")}</Button>
              </Authorize>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}


export default connect(null, { notify })(Users);
