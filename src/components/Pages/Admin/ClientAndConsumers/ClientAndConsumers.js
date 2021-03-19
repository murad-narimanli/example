import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Popconfirm,
  Dropdown,
  Menu,
  Select,
  Form,
  Modal,
  Tooltip,
  Upload
} from "antd";
import {
  UsergroupAddOutlined,
  EditFilled,
  EyeFilled,
  DeleteFilled,
  UserOutlined,
  DownloadOutlined,
  UploadOutlined
} from "@ant-design/icons";
import agros from "../../../../const/api";
import View from "./Modals/View";
import Edit from "./Modals/Edit";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import { connect } from "react-redux";
import { notify } from "../../../../redux/actions";
import * as FileSaver from "file-saver";
const { Option } = Select;

const ClientAndConsumers = (props) => {
  const [visibleVersion, setVisibleVersion] = useState(false);
  const [versionId, setVersionId] = useState(null);
  const [file, setFile] = useState(null);
  const [visibleViewConsumer, setVisibleViewConsumer] = useState(false);
  const [visibleEditConsumer, setVisibleEditConsumer] = useState(false);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(0);
  const [selectedConsumer, setSelectedConsumer] = useState({});
  let [trigger, setTrigger] = useState(0);
  const { notify } = props;
  let perms = props.perms.administrator.subs.clientAndConsumers.perms;
  const { t } = useTranslation();
  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "legalName", value: t("officalName"), con: true },
    { key: "industry", value: t("industry"), con: true },
    { key: "country", value: t("country"), con: true },
    { key: "contactPerson", value: t("relatedPerson"), con: true },
    { key: "phone", value: t("phone"), con: true },
    { key: "email", value: t("eMail"), con: true },
    { key: "id", value: "", con: false },
  ];
  
  const props2 = {
    name: "file",
    multiple: false,
  };

  useEffect(() => {
    const getData = () => {
      agros.get(`customer/list/${selected}`).then((res) => {
        setData(
          res.data.map((r, index) => {
            return {
              ...r,
              key: index + 1,
              index,
              tableIndex: index + 1,
              end:
                r.file != null
                  ? r.file.split(".")[r.file.split(".").length - 1]
                  : null,
            };
          })
        );
      });
    };
    getData();
  }, [selected, trigger, t]);

  const triggerFetch = () => {
    setTrigger(++trigger);
  };

  const handleSelectionChange = (e) => {
    setSelected(e);
  };

  const viewConsumerData = (index) => {
    setSelectedConsumer(data[index]);
    setVisibleViewConsumer(true);
  };

  const editConsumerData = (index) => {
    setSelectedConsumer(data[index]);
    setVisibleEditConsumer(true);
  };

  const addNewConsumer = () => {
    setSelectedConsumer(null);
    setVisibleEditConsumer(true);
  };

  const deleteConsumer = async (index) => {
    await agros
      .delete(`customer/${data[index].id}`)
      .then((res) => {
        notify(t("clientDeleted"), true);
      })
      .catch((err) => {
        notify(err.response, false);
      });
    setTrigger(++trigger);
  };

  // table data columns
  const initialColumns = [
    {
      title: "#",
      dataIndex: "tableIndex",
      key: "1",
      width: 60,
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "2",
    },
    {
      title: t("officalName"),
      dataIndex: "legalName",
      key: "3",
    },
    {
      title: t("industry"),
      dataIndex: "industry",
      key: "4",
    },
    {
      title: t("country"),
      dataIndex: "country",
      key: "5",
    },
    {
      title: t("relatedPerson"),
      dataIndex: "contactPerson",
      key: "6",
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      key: "7",
    },
    {
      title: t("eMail"),
      dataIndex: "email",
      key: "8",
    },
    {
      title: "",
      dataIndex: "index",
      key: "9",
      render: (i) => {
        return (
          <div className="flex flex-end">
            {data[i].end ? (
              <Tooltip placement="topLeft" title="Müqaviləni yüklə">
                <div className="flex f-14 flex-align-center pr-1 pl-1">
                  <DownloadOutlined onClick={(e) => downloadFile(e, i)} />
                </div>
              </Tooltip>
            ) : null}
            <Dropdown
              overlay={() => {
                return (
                  <Menu>
                    {perms.update && (
                      <Menu.Item onClick={() => editConsumerData(i)}>
                        <div className="flex f-14 flex-align-center pr-1 pl-1">
                          <EditFilled className="mr5-5" />
                          <span>{t("edit")}</span>
                        </div>
                      </Menu.Item>
                    )}
                    {perms.read && (
                      <Menu.Item onClick={() => viewConsumerData(i)}>
                        <div className="flex f-14 flex-align-center pr-1 pl-1">
                          <UserOutlined className="mr5-5" />
                          <span>{t("detailed")}</span>
                        </div>
                      </Menu.Item>
                    )}
                    <Menu.Item onClick={() => updateContractVersion(i)}>
                      <div className="flex f-14 flex-align-center pr-1 pl-1">
                        <UploadOutlined className="mr5-5" />
                        <span>Müqavilə yüklə</span>
                      </div>
                    </Menu.Item>
                    {perms.delete && (
                      <Menu.Item>
                        <Popconfirm
                          placement="topRight"
                          title={t("areYouSure")}
                          okText={t("yes")}
                          cancelText={t("no")}
                          onConfirm={() => deleteConsumer(i)}
                        >
                          <div className="flex f-14 flex-align-center pr-1 pl-1">
                            <DeleteFilled className="mr5-5" />
                            <span>{t("delete")}</span>
                          </div>
                        </Popconfirm>
                      </Menu.Item>
                    )}
                  </Menu>
                );
              }}
              placement="bottomRight"
              arrow
            >
              <Button shape="circle" className="border-none">
                <EyeFilled />
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const updateContractVersion = (index) => {
    setVersionId(data[index].id);
    setVisibleVersion(true);
  }
  
  const setUploadFile = ({ onSuccess, onError, file }) => {
    let form_data = new FormData();
    const filename = Math.random(1, 999999) + Date.now() + file.name;
    form_data.append("contract", file, filename);
    agros
      .post("customer/contract/update/" + versionId, form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        setFile(res.data);
        setTrigger(++trigger);
        notify("Müqavilənin yeni versiyası əlavə edildi", true);
        onSuccess(null, file);
      })
      .catch((err) => onError());
  };

  const downloadFile = (e, index) => {
    agros
      .get("customer/download/contract?id=" + data[index].id, {
        headers: {
          "Content-Type": "blob",
        },
        responseType: "blob",
      })
      .then((res) => {
        FileSaver.saveAs(
          res.data,
          data[index].legalName + "- müqavilə." + data[index].end
        );
      })
      .catch(() => {
        notify("", false);
      });
  };

  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="border  page-heading flex p-2 mt-0 bg-white">
            <div className="page-name">
              <UsergroupAddOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("clients")}</span>
            </div>
            {perms.create && (
              <Button onClick={addNewConsumer} type="primary">
                {t("addTo")}
              </Button>
            )}
          </div>
        </Col>
        <Col xs={24}>
          <Form.Item className="mb-5">
            <Select defaultValue="0" onChange={handleSelectionChange}>
              <Option value="0">{t("allOf")}</Option>
              <Option value="1">{t("client")}</Option>
              <Option value="2">{t("consumer")}</Option>
            </Select>
          </Form.Item>
          <Table
            size="small"
            className="bg-white"
            columns={initialColumns}
            dataSource={convertColumns(data, cols)}
            pagination={{
              pageSize: 10,
              current_page: 1,
            }}
          />
        </Col>
      </Row>

      <Modal
        title={t("detailedInfo")}
        centered
        className="addTaskModal"
        visible={visibleViewConsumer}
        onOk={() => setVisibleViewConsumer(false)}
        onCancel={() => setVisibleViewConsumer(false)}
        footer={
          <Button type="primary" onClick={() => setVisibleViewConsumer(false)}>
            {t("close")}
          </Button>
        }
      >
        <View consumer={selectedConsumer} />
      </Modal>

      <Modal
        title={t("addNewClient")}
        centered
        className="addTaskModal padModal"
        visible={visibleEditConsumer}
        onOk={() => setVisibleEditConsumer(false)}
        onCancel={() => setVisibleEditConsumer(false)}
        footer={[]}
      >
        <Edit
          consumer={selectedConsumer}
          triggerFetch={triggerFetch}
          setVisibleEditConsumer={setVisibleEditConsumer}
          visibleEditConsumer={visibleEditConsumer}
        />
      </Modal>
      
      <Modal
        title="Müqavilənin yeni versiyasını yükləyin"
        visible={visibleVersion}
        onOk={() => setVisibleVersion(false)}
        onCancel={() => setVisibleVersion(false)}
      >
        {!props.consumer ? (
          <Col md={6} sm={12} xs={24}>
            <Upload
              {...props2}
              customRequest={setUploadFile}
              beforeUpload={false}
            >
              {!file ? (
                <Button
                  icon={<UploadOutlined />}
                >
                  Müqavilə yüklə
                </Button>
              ) : null}
            </Upload>
          </Col>
        ) : null}
      </Modal>
    </div>
  );
};
const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};

export default connect(mapStateToProps, { notify })(ClientAndConsumers);
