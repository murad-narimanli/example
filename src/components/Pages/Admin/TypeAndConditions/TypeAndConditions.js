import React, { useEffect, useState, useRef } from "react";
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
  Popconfirm,
  Select,
} from "antd";
import {
  UnorderedListOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { convertColumns } from "../../../../utils/columnconverter";
import agros from "../../../../const/api";
import { useTranslation } from "react-i18next";
import {whiteSpace} from "../../../../utils/rules";
import {connect} from "react-redux";
import Authorize from "../../../Elements/Authorize";
import {notify} from "../../../../redux/actions";
const { Option } = Select;

const TypeAndConditions = (props) => {
  // props
  const {notify} = props;
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [auth, setAuth] = useState('paymentTerms')
  const [table, setTable] = useState("PaymentTerm");
  const [form] = Form.useForm();
  let [trigger, setTrigger] = useState(0);
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
      width: 5,
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
                page={['typesAndConditions', 'subs', auth ,'perms']}
                type={'delete'}
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
                mainMenu={'administrator'}
                page={['typesAndConditions', 'subs', auth ,'perms']}
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
    await agros.get(table + "/" + i).then((res) => {
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


  const deleteItem = async (i) => {
    await agros.delete(`${table}/${i}`).then((res) => {
      notify("", true);
      setTrigger(++trigger);
    });
  };

  const saveItem = async (values) => {
    let langs = ["az", "en", "ru"];
    let obj = {
      contentForLang: langs.map((lang) => {
        return { languagename: lang, content: values[`name_${lang}`] };
      }),
    };
    if (!editing) {
      await agros
        .post(table, obj)
        .then((res) => {
          notify("", true);
          setTrigger(++trigger);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    } else {
      obj["id"] = editing;
      await agros
        .put(`${table}/${editing}`, obj)
        .then((res) => {
          notify("", true);
          setTrigger(++trigger);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    }
    setTrigger(trigger + 1);
    cancelEditing();
  };

  useEffect(() => {
    const getItems = async () => {
      await agros.get(table).then((res) => {
        setData(
          res.data.map((p, index) => {
            return { key: index + 1, ...p, index: index + 1 };
          })
        );
      });
    };
    getItems();
  }, [table, trigger, t]);

  const selectHandleChange = (value) => {
    setTable(value);
    if(value === 'PaymentTerm'){
      setAuth('paymentTerms')
    }
    if(value === 'PaymentKind'){
      setAuth('paymentKinds')
    }
    if(value === 'DeliveryTerm'){
      setAuth('deliveryTerms')
    }
  };

  return (
    <Row gutter={[10, 10]}>
      <Col xs={24}>
        <div className="border p-2 mt-0 bg-white">
          <UnorderedListOutlined className="f-20 mr5-15" />
          <span className="f-20 bold">{t("typeAndConditions")}</span>
        </div>
      </Col>
      <Col lg={12} xs={24}>
        <Form form={form}>
          <Form.Item className="mb-10">
            <Select defaultValue="PaymentTerm" onChange={selectHandleChange}>
              <Option value="PaymentTerm">{t("paymentTerm")}</Option>
              <Option value="PaymentKind">{t("paymentTypes")}</Option>
              <Option value="DeliveryTerm">{t("deliveryTerms")}</Option>
            </Select>
          </Form.Item>
        </Form>
        <Table
          size="small"
          className="bg-white"
          columns={columns}
          dataSource={convertColumns(data, cols)}
          pagination={{
            pageSize: 10,
            current_page: 1,
            total: data.length,
          }}
        />
        ,
      </Col>
      <Col lg={12} xs={24}>
        <Card title={t("addTo")}>
          <Form layout="vertical" form={form} onFinish={saveItem}>
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
                  page={['typesAndConditions', 'subs', auth ,'perms']}
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
}

export default connect(null, { notify })(TypeAndConditions);
