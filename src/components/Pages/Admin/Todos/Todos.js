import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Table,
  Button,
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
import { useTranslation } from "react-i18next";
import agros from "../../../../const/api";
import { whiteSpace } from "../../../../utils/rules";
import {connect} from "react-redux";
import {notify} from "../../../../redux/actions";
import Authorize from "../../../Elements/Authorize";

const Todos = (props) => {
  const [todos, setTodos] = useState([]);
  const [editing, setEditing] = useState(null);
  let [trigger, setTrigger] = useState(0);
  const [form] = Form.useForm();
  const {notify} = props;
  const { t } = useTranslation();
  const nameInput = useRef();
  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "id", value: "", con: false },
  ];

  const columns = [
    {
      title: "#",
      key: "1",
      dataIndex: "index",
      width: 70,
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
                mainMenu={'administrator'}
                page={['todos','perms']}
                type={'delete'}
            >
              <Popconfirm
                placement="topRight"
                title={t("areYouSure")}
                onConfirm={() => deleteTodo(i)}
                okText={t("yes")}
                cancelText={t("no")}
              >
                <Tooltip className="ml-5" title={t("delete")} placement="left">
                  <Button className="border-none" type="text" shape="circle">
                    <DeleteFilled />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Authorize>
            <Authorize
                mainMenu={'administrator'}
                page={['todos','perms']}
                type={'update'}
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
    await agros.get(`todos/${i}`).then((res) => {
      let names = res.data.contentForLang;
      let obj = {};
      names.forEach((name) => {
        obj[`name_${name.languagename}`] = name.content;
      });
      form.setFieldsValue(obj);
      nameInput.current.focus();
    });
  };

  const cancelEditing = () => {
    setEditing(null);
    form.setFieldsValue({ name_az: "", name_en: "", name_ru: "" });
  };

  const deleteTodo = async (i) => {
    await agros
      .delete(`todos/${i}`)
      .then((res) => {
        notify("", true);
        setTrigger(++trigger);
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const saveTodo = (values) => {
    let langs = ["az", "en", "ru"];
    let obj = {
      contentForLang: langs.map((lang) => {
        return { languagename: lang, content: values[`name_${lang}`] };
      }),
    };
    if (!editing) {
      agros.post("todos", obj).then((res) => {
        notify("", true);
        setTrigger(++trigger);
        cancelEditing();
      });
    } else {
      obj["id"] = editing;
      agros.put(`todos/${editing}`, obj).then((res) => {
        notify("", true);
        setTrigger(++trigger);
        cancelEditing();
      });
    }
  };



  useEffect(() => {
    const getTodos = () => {
      agros.get("todos").then((res) => {
        setTodos(
          res.data.map((p, index) => {
            return { key: index + 1, ...p, index: index + 1 };
          })
        );
      });
    };
    getTodos();
  }, [t, trigger]);

  return (
    <Row gutter={[10, 10]}>
      <Col xs={24}>
        <div className="border p-2 mt-0 bg-white">
          <UnorderedListOutlined className="f-20 mr5-15" />
          <span className="f-20 bold">{t("todos")}</span>
        </div>
      </Col>
      <Col lg={12} xs={24}>
        <Table
          size="small"
          className="bg-white"
          columns={columns}
          dataSource={convertColumns(todos, cols)}
          pagination={{
            pageSize: 10,
            current_page: 1,
            total: todos.length,
          }}
        />
        ,
      </Col>
      <Col lg={12} xs={24}>
        <Card title={t("addTo")}>
          <Form form={form} layout="vertical" onFinish={saveTodo}>
            <p className="mb-5">{t("heading")}</p>
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
            <div className="flex  flex-between mt-15">
              <Button onClick={cancelEditing}>{t("cancel")}</Button>
              <Authorize
                  mainMenu={'administrator'}
                  page={['todos','perms']}
                  type={editing ? 'update' : 'create' }
              >
                <Button htmlType="submit" type="primary">{t("save")}</Button>
              </Authorize>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default connect(null, { notify })(Todos);
