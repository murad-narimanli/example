import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Tooltip,
  Input,
  Popconfirm,
  Form,
} from "antd";
import {
  UnorderedListOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import Authorize from "../../../Elements/Authorize";
import agros from "../../../../const/api";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import { notify } from "../../../../redux/actions";
import { connect } from "react-redux";

const BasicTemplate = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  let [trigger, setTrigger] = useState(0);
  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "id", value: "", con: false },
  ];
  const nameInput = useRef();
  const urlRef = useRef();

  const { notify } = props;

  // table data columns
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
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
            <Authorize mainMenu={'financeAdminstrator'} page={[props.page ,'perms']} type={'delete'}>
              <Popconfirm
                placement="topRight"
                title={t("areYouSure")}
                onConfirm={() => deleteItem(i)}
                okText={t("yes")}
                cancelText={t("no")}
              >
                <Tooltip className="ml-5" placement="left" title={t("delete")}>
                  <Button className="border-none" type="text" shape="circle">
                    <DeleteFilled />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Authorize>
            <Authorize mainMenu={'financeAdminstrator'} page={[props.page ,'perms']} type={'update'}>
              <Tooltip className="ml-5" title={t("edit")} placement="rightTop">
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
    await agros.get(props.url + "/" + i).then((res) => {
      let obj = { name: res.data.name };
      form.setFieldsValue(obj);
      nameInput.current.focus();
    });
  };

  const cancelEditing = () => {
    setEditing(null);
    form.setFieldsValue({ name: "" });
  };

  const deleteItem = async (i) => {
    await agros
      .delete(`${props.url}/${i}`)
      .then((res) => {
        notify("", true);
        setTrigger(++trigger);
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const saveItem = async (values) => {
    let obj = {
      name: values.name,
    };
    let url = props.url;
    if (props.parcel) {
      obj["temporaryParcelId"] = 1;
      obj["id"] = 1;
    }
    if (!editing) {
      await agros
        .post(url, obj)
        .then((res) => {
          notify("", true);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    } else {
      obj["id"] = editing;
      await agros
        .put(`${props.url}/${editing}`, obj)
        .then((res) => {
          notify("", true);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    }
    setTrigger(++trigger);
  };

  useEffect(() => {
    const getItems = async () => {
      await agros.get(props.url).then((res) => {
        setItems(
          res.data.map((p, index) => {
            return { key: index + 1, ...p, index: index + 1 };
          })
        );
      });
    };
    getItems();
    cancelEditing();
    if (urlRef.current !== props.url) {
      setPage(1);
    }
    urlRef.current = props.url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.url, trigger, t]);

  const pageChange = (val) => {
    setPage(val.current);
    setPageSize(val.pageSize);
  };

  return (
    <Row gutter={[10, 10]}>
      <Col xs={24}>
        <div className="border p-2 mt-0 bg-white">
          <UnorderedListOutlined className="f-20 mr5-15" />
          <span className="f-20 bold">{props.heading}</span>
        </div>
      </Col>
      <Col lg={12} xs={24}>
        <Table
          className="bg-white"
          columns={columns}
          dataSource={convertColumns(items, cols)}
          pagination={{
            pageSizeOptions: ["10", "15", "20", "25", "30"],
            showSizeChanger: true,
            pageSize: pageSize,
            current_page: page,
            total: items.length,
          }}
          onChange={pageChange}
          size="middle"
        />
      </Col>
      <Col lg={12} xs={24}>
        <Card title={t("addTo")}>
          <Form layout="vertical" onFinish={saveItem} form={form}>
            <Form.Item
              className="form-lang mb-5"
              label={<span>{t("name")}</span>}
              name="name"
              validateTrigger="onChange"
              rules={[
                {
                  required: true,
                  message: t("inputError"),
                  whitespace: true,
                },
              ]}
            >
              <Input ref={nameInput} />
            </Form.Item>
            <div className="flex  flex-between mt-15">
              <Button onClick={cancelEditing}>{t("cancel")}</Button>
              <Authorize
                  mainMenu={'financeAdminstrator'}
                  page={[props.page ,'perms']}
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

export default connect(null, { notify })(BasicTemplate);
