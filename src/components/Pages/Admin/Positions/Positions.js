import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Switch,
  Col,
  Card,
  Table,
  Button,
  Form,
  Tooltip,
  Input,
  Popconfirm,
} from "antd";
import {
  UnorderedListOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { convertColumns } from "../../../../utils/columnconverter";
// notification
import { notify } from "../../../../redux/actions";
import { connect } from "react-redux";
import agros from "../../../../const/api";
import { useTranslation } from "react-i18next";
import { whiteSpace } from "../../../../utils/rules";
import Authorize from "../../../Elements/Authorize";

const Positions = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [positions, setPositions] = useState([]);
  const [responsible, setResponsible] = useState(false);
  const [editing, setEditing] = useState(null);
  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "id", value: "", con: false },
  ];
  const nameInput = useRef();

  // props
  const { notify } = props;

  const columns = [
    {
      title: "#",
      key: "1",
      dataIndex: "index",
      width: 80,
    },
    {
      title: t("name"),
      key: "2",
      dataIndex: "name",
    },
    {
      title: "",
      key: "3",
      dataIndex: "id",
      width: 30,
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Authorize
              mainMenu={"administrator"}
              page={["positions", "perms"]}
              type={"delete"}
            >
              <Popconfirm
                placement="topRight"
                title={t("areYouSure")}
                onConfirm={() => deletePosition(i)}
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
              page={["positions", "perms"]}
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
    await agros.get(`profession/${i}`).then((res) => {
      let names = res.data.content;
      let obj = {};
      names.forEach((name) => {
        obj[`name_${name.languagename}`] = name.content;
      });
      form.setFieldsValue(obj);
      setResponsible(res.data.respondent);
      nameInput.current.focus();
    });
  };

  const cancelEditing = () => {
    setEditing(null);
    setResponsible(false);
    form.setFieldsValue({ name_az: "", name_en: "", name_ru: "" });
  };

  const deletePosition = async (i) => {
    await agros
      .delete(`/profession/${i}`)
      .then(() => {
        // description
        notify("", true);
        getPositions();
      })
      .catch((err) => {
        //error
        notify(err.response, false);
      });
  };

  const savePosition = async (values) => {
    let langs = ["az", "en", "ru"];
    let obj = {
      Respondent: responsible,
      content: langs.map((lang, index) => {
        return { languagename: lang, content: values[`name_${lang}`] };
      }),
    };
    if (!editing) {
      await agros
        .post("/profession", obj)
        .then((res) => {
          notify("", true);
          getPositions();
          cancelEditing();
        })
        .catch((err) => {
          notify(err.response, false);
        });
    } else {
      obj["id"] = editing;
      await agros
        .put(`/profession/${editing}`, obj)
        .then((res) => {
          notify("", true);
          getPositions();
          cancelEditing();
        })
        .catch((err) => {
          notify(err.response, false);
        });
    }
  };

  const getPositions = async () => {
    await agros.get("profession").then((res) => {
      setPositions(
        res.data.map((p, index) => {
          return { key: index + 1, ...p, index: index + 1 };
        })
      );
    });
  };

  useEffect(() => {
    getPositions();
  }, [t]);

  const onSwitchChange = () => {
    setResponsible(!responsible);
  };

  return (
    <Row gutter={[10, 10]}>
      <Col xs={24}>
        <div className="border p-2 mt-0 bg-white">
          <UnorderedListOutlined className="f-20 mr5-15" />
          <span className="f-20 bold">{t("positions")}</span>
        </div>
      </Col>
      <Col lg={12} xs={24}>
        <Table
          size="small"
          className="bg-white"
          columns={columns}
          dataSource={convertColumns(positions, cols)}
          pagination={{
            pageSize: 10,
            current_page: 1,
            total: positions.length,
          }}
        />
      </Col>
      <Col lg={12} xs={24}>
        <Card title={t("addTo")}>
          <Form layout="vertical" onFinish={savePosition} form={form}>
            <p className="mb-5">{t("positionName")}</p>
            <div className="form-lang">
              <Form.Item
                className="mb-5"
                validateTrigger="onChange"
                name="name_az"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input ref={nameInput} />
              </Form.Item>
              <div className="input-lang">az</div>
            </div>

            <div className="form-lang">
              <Form.Item
                className="mb-5"
                validateTrigger="onChange"
                name="name_en"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input ref={nameInput} />
              </Form.Item>
              <div className="input-lang">en</div>
            </div>

            <div className="form-lang">
              <Form.Item
                className="mb-5"
                validateTrigger="onChange"
                name="name_ru"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input ref={nameInput} />
              </Form.Item>
              <div className="input-lang">ru</div>
            </div>

            <div className="flex mt-10 flex-align-center">
              <Switch checked={responsible} onChange={onSwitchChange} />
              <span className="ml-10">{t("responsibility")}</span>
            </div>
            <div className="flex  flex-between mt-15">
              <Button onClick={cancelEditing}>{t("cancel")}</Button>
              <Authorize
                mainMenu={"administrator"}
                page={["positions", "perms"]}
                type={editing ? "update" : "create"}
              >
                <Button htmlType="submit">{t("save")}</Button>
              </Authorize>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default connect(null, { notify })(Positions);
