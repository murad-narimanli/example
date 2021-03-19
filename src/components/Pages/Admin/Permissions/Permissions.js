import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Switch,
  Col,
  Card,
  Form,
  Table,
  Button,
  Tooltip,
  Input,
  Popconfirm,
  InputNumber,
} from "antd";
import {
  UnorderedListOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import defaultPerms from "../../../../const/permissions";
import { mapPermissions } from "../../../../const/permissions";
import agros from "./../../../../const/api";
import Authorize from "../../../Elements/Authorize";
import { convertColumns } from "../../../../utils/columnconverter";
// notification
import { notify } from "../../../../redux/actions";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { noWhitespace, whiteSpace } from "../../../../utils/rules";

const Permissions = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const [pg, setPG] = useState({ ...defaultPerms });
  const [editing, setEditing] = useState(null);
  let [trigger, setTrigger] = useState(0);

  const { notify } = props;

  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "id", value: "", con: false },
  ];

  const nameInput = useRef();

  useEffect(() => {
    const getGroups = async () => {
      await agros.get("permissiongroup").then((res) => {
        setGroups(
          res.data.map((g, index) => {
            return { key: index + 1, ...g, index: index + 1 };
          })
        );
      });
    };

    getGroups();
  }, [trigger, t]);

  // const doIt = (name, id) => {
  //   let obj = {name, id, permissions: perms};
  //   agros.put(`permissiongroup/${id}`, obj);
  // }

  const saveItem = async (values) => {
    let obj = {
      name: values.name,
      permissions: { values: pg, purchaseLimit: values.purchaseLimit },
    };
    if (!editing) {
      await agros.post("permissiongroup", obj).then((res) => {
        notify("", true);
      });
    } else {
      obj["id"] = editing;
      await agros.put(`permissiongroup/${editing}`, obj).then((res) => {
        notify("", true);
      });
    }
    setTrigger(++trigger);
    cancelEditing();
  };

  // table data columns
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
            <Authorize
              mainMenu={"administrator"}
              page={["permissions", "perms"]}
              type={"delete"}
            >
              <Popconfirm
                placement="topRight"
                title={t("areYouSure")}
                onConfirm={() => deleteItem(i)}
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
            <Authorize
              mainMenu={"administrator"}
              page={["permissions", "perms"]}
              type={"update"}
            >
              <Tooltip className="ml-5" title={t("edit")} placement="topRight">
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
    let perms = groups.find((g) => g.id === i).permissions;
    let purchaseLimit = perms.purchaseLimit;
    let pgs = mapPermissions(defaultPerms, perms.values);
    setPG(pgs);
    nameInput.current.focus();
    form.setFieldsValue({
      name: groups.find((g) => g.id === i).name,
      purchaseLimit,
    });
  };

  const cancelEditing = () => {
    setEditing(null);
    setPG({ ...defaultPerms });
    form.resetFields();
  };

  const deleteItem = async (i) => {
    await agros.delete(`permissiongroup/${i}`).then((res) => {
      notify("", true);
      setTrigger(++trigger);
      cancelEditing();
    });
  };

  const handleFirstValue = (key, perm) => {
    const all = { ...pg };
    all[key].perms[perm] = !pg[key].perms[perm];
    setPG(all);
  };

  const handleSecondValue = (key, key2, perm) => {
    const all = { ...pg };
    all[key].subs[key2].perms[perm] = !pg[key].subs[key2].perms[perm];
    setPG(all);
  };

  const handleThirdValue = (key, key2, key3, perm) => {
    const all = { ...pg };
    all[key].subs[key2].subs[key3].perms[perm] = !pg[key].subs[key2].subs[key3]
      .perms[perm];
    setPG(all);
  };

  return (
    <Row gutter={[10, 10]}>
      <Col xs={24}>
        <div className="border p-2 mt-0 bg-white">
          <UnorderedListOutlined className="f-20 mr5-15" />
          <span className="f-20 bold"> {t("authorityGroups")}</span>
        </div>
      </Col>
      <Col lg={12} xs={24}>
        <Table
          size="small"
          className="bg-white"
          columns={columns}
          dataSource={convertColumns(groups, cols)}
          pagination={{ pageSize: 10, current_page: 1, total: groups.length }}
        />
      </Col>
      <Col lg={12} xs={24}>
        <Card title={t("addTo")}>
          <Form
            form={form}
            layout="vertical"
            onFinish={saveItem}
            className="mb-10"
          >
            <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="name"
              label={t("name")}
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input ref={nameInput} />
            </Form.Item>
            <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="purchaseLimit"
              label="Maddi əməliyyatlar üçün məbləğ limiti"
              rules={[noWhitespace(t("inputError"))]}
            >
              <InputNumber />
            </Form.Item>
            <div className="flex  flex-between mt-15">
              <Button onClick={cancelEditing}>{t("cancel")}</Button>
              <Authorize
                mainMenu={"administrator"}
                page={["permissions", "perms"]}
                type={editing ? "update" : "create"}
              >
                <Button type="primary" htmlType="submit">
                  {t("save")}
                </Button>
              </Authorize>
            </div>
          </Form>

          {Object.keys(pg).map((k, kindex) => {
            return (
              <div key={kindex} className="border mb-15 p-15 pb-5">
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <p>{t(k)}</p>
                  </Col>
                  {Object.keys(pg[k].perms).map((p, pindex) => {
                    return (
                      <Col sm={12} xs={24} key={pindex}>
                        <div className="flex flex-align-center">
                          <Switch
                            checked={pg[k].perms[p]}
                            onChange={() => handleFirstValue(k, p)}
                          />
                          <span className="ml-10">{t(p)}</span>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
                {pg[k].subs &&
                  pg[k].perms.read &&
                  Object.keys(pg[k].subs).map((k2, kindex2) => {
                    return (
                      <div key={kindex2} className="border mb-10 p-15 pb-5">
                        <Row gutter={[16, 16]}>
                          <Col xs={24}>
                            <p>{t(k2)}</p>
                          </Col>
                          {Object.keys(pg[k].subs[k2].perms).map(
                            (p2, pindex2) => {
                              return (
                                <Col sm={12} xs={24} key={pindex2}>
                                  <div className="flex flex-align-center">
                                    <Switch
                                      checked={pg[k].subs[k2].perms[p2]}
                                      onChange={() =>
                                        handleSecondValue(k, k2, p2)
                                      }
                                    />
                                    <span className="ml-10">{t(p2)}</span>
                                  </div>
                                </Col>
                              );
                            }
                          )}
                        </Row>
                        {pg[k].subs[k2].subs &&
                          pg[k].subs[k2].perms.read &&
                          Object.keys(pg[k].subs[k2].subs).map(
                            (k3, kindex3) => {
                              return (
                                <div
                                  key={kindex3}
                                  className="border mb-5 p-15 pb-5"
                                >
                                  <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                      <p>{t(k3)}</p>
                                    </Col>
                                    {Object.keys(
                                      pg[k].subs[k2].subs[k3].perms
                                    ).map((p3, pindex3) => {
                                      return (
                                        <Col sm={12} xs={24} key={pindex3}>
                                          <div className="flex flex-align-center">
                                            <Switch
                                              checked={
                                                pg[k].subs[k2].subs[k3].perms[
                                                  p3
                                                ]
                                              }
                                              onChange={() =>
                                                handleThirdValue(k, k2, k3, p3)
                                              }
                                            />
                                            <span className="ml-10">
                                              {t(p3)}
                                            </span>
                                          </div>
                                        </Col>
                                      );
                                    })}
                                  </Row>
                                </div>
                              );
                            }
                          )}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </Card>
      </Col>
    </Row>
  );
};

export default connect(null, { notify })(Permissions);
