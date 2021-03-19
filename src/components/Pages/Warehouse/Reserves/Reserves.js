import "@ant-design/compatible/assets/index.css";
import React, { useEffect, useState } from "react";
import { Tabs, Button, Table, Select, Form, Tooltip } from "antd";
import {
  UnorderedListOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import IncomeModal from "./Modals/IncomeModal";
import agros from "../../../../const/api";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import { getStock } from "./../../../../redux/actions";
import moment from "moment";
import { connect } from "react-redux";

const { TabPane } = Tabs;
const { Option } = Select;

const Reserves = (props) => {
  const { t } = useTranslation();
  const perms = props.perms.warehouse.subs.reservesWarehouse;
  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "productName", value: t("productName"), con: true },
    { key: "quantity", value: t("productQuantity"), con: true },
    { key: "documentNumber", value: t("documentNumber"), con: true },
    { key: "measurementUnit", value: t("measurementUnit"), con: true },
    { key: "warehouse", value: t("warehouse"), con: true },
    { key: "acceptDate", value: t("acceptedDate"), con: true },
    { key: "operation", value: "", con: false },
  ];

  const [reserves, setReserves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reservesFetched, setReservedFetched] = useState(false);
  const [documents, setDocuments] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
  });
  const [type, setType] = useState(0);
  const [isIncome, setIsIncome] = useState(true);

  const [form] = Form.useForm();

  useEffect(() => {
    const getReserves = () => {
      agros.get("reservestock").then((res) => {
        setReserves(
          res.data.map((d, index) => {
            return {
              ...d,
              key: index + 1,
              tableIndex: index + 1,
              quantity: d.quantity + " " + d.measurementUnit,
            };
          })
        );
        setReservedFetched(true);
      });
    };
    const getDocuments = () => {
      agros.get(`reservestock/documents/${type}`).then((res) => {
        const all = { ...documents };
        all[type] = res.data.map((r, index) => {
          return {
            ...r,
            key: index + 1,
            tableIndex: index + 1,
            acceptDate:
              r.acceptDate && moment(r.acceptDate).format("DD-MM-YYYY"),
          };
        });
        setDocuments(all);
      });
    };
    const getTasks = () => {
      agros.get(`reservestock/tasks`).then((res) => {
        const t = res.data.map((r, index) => {
          return {
            ...r,
            key: index + 1,
          };
        });
        setTasks(t);
      });
    };

    if (!reservesFetched) {
      getReserves();
    }

    if (!documents[type].length && reservesFetched) {
      getDocuments();
      getTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, reservesFetched, t]);

  const columns = [
    {
      title: "",
      key: 0,
      dataIndex: "tableIndex",
      width: 60,
    },
    {
      title: t("productName"),
      key: 1,
      dataIndex: "productName",
    },
    {
      title: t("productQuantity"),
      key: 2,
      dataIndex: "quantity",
    },
    {
      title: "",
      key: 8,
      dataIndex: "warn",
      render: (e) => (
        <span>
          {e !== 0 ? (
            <Tooltip
              placement="leftBottom"
              className="ml-5"
              title={
                e === 1
                  ? "Anbardakı miqdar bu ehtiyat üçün nəzərdə tutulan minimal miqdara yaxındır"
                  : "Anbarda bu ehtiyatdan qalmayıb"
              }
            >
              <ExclamationCircleOutlined
                className={`pointer ${e === 2 ? "red" : ""}`}
              />
            </Tooltip>
          ) : null}
        </span>
      ),
    },
  ];

  const columnsIncomeExpense = [
    {
      title: t("documentNumber"),
      key: 1,
      dataIndex: "documentNumber",
    },
    {
      title: t("productName"),
      key: 2,
      dataIndex: "productName",
    },
    {
      title: t("productQuantity"),
      key: 3,
      dataIndex: "quantity",
    },
    {
      title: t("measurementUnit"),
      key: 4,
      dataIndex: "measurementUnit",
    },
    {
      title: t("warehouse"),
      key: 5,
      dataIndex: "warehouse",
    },
    {
      title: t("operation"),
      key: 6,
      dataIndex: "operation",
      render: (i) => {
        return (
          <div className="flex statusTd">
            <p>{t("operation")}</p>
            {i === 1 ? (
              <Button
                size="small"
                type="primary"
                className="f-12 border-none"
                shape="round"
              >
                {t("import")}
              </Button>
            ) : (
              <Button className="f-12" size="small" type="danger" shape="round">
                {t("export")}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: t("acceptedDate"),
      key: 7,
      dataIndex: "acceptDate",
      // render: (o) => <span>{o.substring(0, 10)}</span>,
    },
  ];

  const [visibleIncomeModal, setVisibleIncomeModal] = useState(false);

  function selectHandleChange(value) {
    setType(+value);
  }

  const openAddModal = (income) => {
    setIsIncome(income);
    setVisibleIncomeModal(true);
  };

  const triggerFetch = () => {
    props.getStock();
    setReservedFetched(false);
    const all = { ...documents };
    all[type] = [];
    setDocuments(all);
  };

  const columnsTasks = [
    {
      title: t("name"),
      key: 4,
      dataIndex: "productName",
    },
    {
      title: t("quantityOf"),
      key: 5,
      dataIndex: "quantity",
    },
    {
      title: t("measurementUnit"),
      key: 3,
      dataIndex: "measurementUnit",
    },
  ];

  return (
    <div>
      <div className="border page-heading flex p-2 mt-0 bg-white">
        <div className="page-name">
          <UnorderedListOutlined className="f-20 mr5-15" />
          <span className="f-20 bold">{t("reserves")}</span>
        </div>
        <div>
          {perms.perms.import && (
            <Button type="primary" onClick={() => openAddModal(true)}>
              {t("import")}
            </Button>
          )}
          {perms.perms.export && (
            <Button className="ml-10" onClick={() => openAddModal(false)}>
              {t("export")}
            </Button>
          )}
        </div>
      </div>
      <div className="position-relative mt-15">
        <div className="position-absolute w-100 tab-section">
          <Tabs animated={true} defaultActiveKey="1" className="w-100">
            {perms.subs.reserves.perms.read && (
              <TabPane tab={t("reserves")} key="1">
                <Table
                  size="small"
                  className="bg-white   w-100"
                  columns={columns}
                  dataSource={convertColumns(reserves, cols)}
                  pagination={{
                    pageSizeOptions: ["10", "15", "20", "25", "30"],
                    showSizeChanger: true,
                    current_page: 1,
                  }}
                />
              </TabPane>
            )}
            {perms.subs.importExportAndDocs.perms.read && (
              <TabPane tab={t("importExportDocuments")} key="2">
                <div className="px-2 pb-1 pt-1 bg-white">
                  <Form layout="vertical" form={form}>
                    <Form.Item className="mb-0" required>
                      <Select defaultValue="0" onChange={selectHandleChange}>
                        <Option value="0">{t("allOf")}</Option>
                        <Option value="1">{t("import")}</Option>
                        <Option value="2">{t("export")}</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                </div>
                <Table
                  size="small"
                  className="bg-white   w-100"
                  columns={columnsIncomeExpense}
                  dataSource={convertColumns(documents[type], cols)}
                  // dataSource={documents[type]}
                  pagination={{
                    pageSizeOptions: ["10", "15", "20", "25", "30"],
                    showSizeChanger: true,
                    current_page: 1,
                  }}
                />
              </TabPane>
            )}
            <TabPane tab={t("tasks")} key="3">
              <Table
                size="small"
                className="bg-white   w-100"
                columns={columnsTasks}
                dataSource={convertColumns(tasks, cols)}
                pagination={{
                  pageSizeOptions: ["10", "15", "20", "25", "30"],
                  showSizeChanger: true,
                  current_page: 1,
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>

      <IncomeModal
        isincome={isIncome}
        triggerFetch={triggerFetch}
        visibleIncomeModal={visibleIncomeModal}
        setVisibleIncomeModal={setVisibleIncomeModal}
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};
export default connect(mapStateToProps, { getStock })(Reserves);
