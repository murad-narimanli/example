import React, { useEffect, useState } from "react";
import { Tabs, Button, Table, Modal, Tooltip, Checkbox } from "antd";
import {
  UnorderedListOutlined,
  FilePptOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ImportModal from "./Modals/ImportModal";
import ImportExportModal from "./Modals/ImportExportModal";
import ExportModal from "./Modals/ExportModal";
import excell from "../../../../assets/img/excel.svg";
import agros from "../../../../const/api";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import { connect } from "react-redux";
import { notify, getStock } from "../../../../redux/actions";
const { TabPane } = Tabs;

const DragAndFertilizers = (props) => {
  const perms = props.perms.warehouse.subs.drugAndFertilizers;
  const { t } = useTranslation();
  const { notify } = props;
  const [tables, setTables] = useState({
    reserves: { data: [], url: "medicalstock", selected: null },
    inouts: { data: [], url: "medicalstock/documents", selected: null },
    tasks: { data: [], url: "medicalstock/tasks", selected: null },
  });
  const [forceFetch, setForceFetch] = useState(false);
  const [tabKey, setTabkey] = useState("reserves");

  useEffect(() => {
    const getData = () => {
      agros.get(tables[tabKey].url).then((res) => {
        const all = { ...tables };
        all[tabKey].data = res.data.map((r, index) => {
          return {
            ...r,
            key: index + 1,
            index,
            quantity:
              r.quantity + (r.measurementUnit ? " " + r.measurementUnit : null),
            expireDate:
              r.expireDate && moment(r.expireDate).format("DD-MM-YYYY"),
            documentNumber: r.documentNumber !== null ? r.documentNumber : "-",
          };
        });
        setTables(all);
        setForceFetch(false);
      });
    };
    if (!tables[tabKey].data.length || forceFetch) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey, t, forceFetch]);

  const triggerFetch = () => {
    setForceFetch(true);
    props.getStock();
  };

  const [visibleExport, setVisibleExport] = useState(false);
  const [visibleImport, setVisibleImport] = useState(false);
  const [visibleView, setVisibleView] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showCheck, setShowCheck] = useState(true);
  const cols = [
    { key: "productName", value: t("name"), con: true },
    { key: "fertilizerKind", value: t("typeOf"), con: true },
    { key: "mainIngredient", value: t("mainIngridient"), con: true },
    { key: "quantity", value: t("quantityOf"), con: true },
    { key: "price", value: t("price"), con: true },
    { key: "expireDate", value: t("expirationDate"), con: true },
    { key: "documentNumber", value: t("documentNumber"), con: true },
    { key: "warehouse", value: t("warehouse"), con: true },
    { key: "quantity", value: t("quantity"), con: true },
    { key: "operation", value: t("operation"), con: true },
    { key: "productName", value: t("productName"), con: true },
    { key: "takenPerson", value: t("person"), con: true },
    { key: "usedStatus", value: "", con: false },
    { key: "index", value: "", con: false },
  ];

  function handleTabChange(key) {
    setTabkey(key);
    setShowCheck(key === "reserves");
  }

  const reserviInitial = [
    {
      title: t("name"),
      key: 1,
      dataIndex: "productName",
    },
    {
      title: t("typeOf"),
      key: 2,
      dataIndex: "fertilizerKind",
    },

    {
      title: t("activeSubstance"),
      key: 3,
      dataIndex: "mainIngredient",
    },
    {
      title: t("quantityOf"),
      key: 4,
      dataIndex: "quantity",
    },
  ];

  const reservesColumns = [
    {
      title: t("price"),
      key: 5,
      dataIndex: "price",
      render: (p) => <span>{p} azn</span>,
    },
    {
      title: t("expirationDate"),
      key: 6,
      dataIndex: "expireDate",
    },
  ];

  const inoutsColumns = [
    {
      title: t("type"),
      key: 2,
      dataIndex: "fertilizerKind",
    },
    {
      title: t("mainIngridient"),
      key: 3,
      dataIndex: "mainIngredient",
    },
    {
      title: t("productName"),
      key: 4,
      dataIndex: "productName",
    },
    {
      title: t("quantity"),
      key: 5,
      dataIndex: "quantity",
    },
    {
      title: t("warehouse"),
      key: 6,
      dataIndex: "warehouse",
    },
    {
      title: t("operation"),
      key: 7,
      dataIndex: "operation",
    },
    {
      title: "",
      dataIndex: "index",
      key: 8,
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Tooltip className="ml-5" title={t("import") + "/" + t("export")}>
              <Button
                onClick={() => viewInout(i)}
                className="border-none"
                shape="circle"
              >
                <FilePptOutlined />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const warnColumn = [
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
                  ? "Anbardakı miqdar bu məhsul üçün nəzərdə tutulan minimal miqdara yaxındır"
                  : "Anbarda bu məhsuldan qalmayıb"
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

  const viewInout = (index) => {
    const all = { ...tables };
    all.inouts.selected = index;
    setTables(all);
    setVisibleView(true);
  };

  const tasksColumns = [
    {
      title: t("type"),
      key: 2,
      dataIndex: "fertilizerKind",
    },
    {
      title: t("mainIngridient"),
      key: 3,
      dataIndex: "mainIngredient",
    },
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
      title: t("person"),
      key: 5,
      dataIndex: "takenPerson",
    },
  ];

  const fullColumns = checked
    ? reserviInitial.concat(reservesColumns).concat(warnColumn)
    : reserviInitial.concat(warnColumn);

  const handleCheckBoxChange = (e) => {
    setChecked(e.target.checked);
  };

  const exportExcel = (url) => {
    agros
      .get(url, {
        headers: {
          "Content-Type": "blob",
        },
        responseType: "blob",
      })
      .then((res) => {
        const filename = "report";
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(res.data, filename);
        } else {
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.href = window.URL.createObjectURL(res.data);
          a.download = filename;
          a.target = "_blank";
          a.click();
          a.remove();
        }
      })
      .catch(() => {
        notify("", false);
      });
  };

  const triggerExcel = () => {
    let url = "";
    switch (tabKey) {
      case "reserves":
        url = "ExselExport/CropStock";
        break;
      case "inouts":
        url = "ExselExport/CropSortDocument/0";
        break;
      default:
        url = "";
        break;
    }
    if (url.length) {
      exportExcel(url);
    }
  };

  return (
    <div>
      <div className="border page-heading flex p-2 mt-0 bg-white">
        <div className="page-name">
          <UnorderedListOutlined className="f-20 mr-15" />
          <span className="f-20 bold">{t("drugAndFertilizers")}</span>
        </div>
        <div>
          {tabKey !== "tasks" ? (
            <>
              {(tabKey === "reserves" &&
                perms.subs.reserves.perms.excelExport) ||
              (tabKey === "inouts" &&
                perms.subs.importAndExport.perms.excelExport) ? (
                <Tooltip placement="left" title="Excel export">
                  <Button
                    shape="circle"
                    className="mr-10 border-none"
                    onClick={triggerExcel}
                  >
                    <img src={excell} alt="" />
                  </Button>
                </Tooltip>
              ) : null}
            </>
          ) : null}
          {perms.perms.import && (
            <Button type="primary" onClick={() => setVisibleImport(true)}>
              {t("import")}
            </Button>
          )}
          {perms.perms.export && (
            <Button
              className="ml-10 mr-10"
              onClick={() => setVisibleExport(true)}
            >
              {t("export")}
            </Button>
          )}
          <Checkbox
            checked={checked}
            onChange={handleCheckBoxChange}
            style={{ display: showCheck ? "inline-block" : "none" }}
          >
            {t("detailedInfo")}
          </Checkbox>
        </div>
      </div>
      <div className="position-relative mt-15">
        <div className="position-absolute w-100 tab-section purchase-tabs">
          <Tabs
            animated="true"
            centered={true}
            defaultActiveKey="reserves"
            className="bg-white w-100"
            onChange={handleTabChange}
          >
            {perms.subs.reserves.perms.read && (
              <TabPane tab={t("inReserves")} key="reserves">
                <Table
                  size="small"
                  className="bg-white   w-100"
                  columns={fullColumns}
                  dataSource={convertColumns(tables.reserves.data, cols)}
                  pagination={{
                    pageSizeOptions: ["10", "15", "20", "25", "30"],
                    showSizeChanger: true,
                    current_page: 1,
                  }}
                />
              </TabPane>
            )}
            {perms.subs.importAndExport.perms.read && (
              <TabPane tab={t("importExportDocuments")} key="inouts">
                <Table
                  size="small"
                  className="bg-white   w-100"
                  columns={inoutsColumns}
                  dataSource={convertColumns(tables.inouts.data, cols)}
                  pagination={{
                    pageSizeOptions: ["10", "15", "20", "25", "30"],
                    showSizeChanger: true,
                    current_page: 1,
                  }}
                />
              </TabPane>
            )}
            {perms.subs.tasks.perms.read && (
              <TabPane tab={t("tasks")} key="tasks">
                <Table
                  size="small"
                  className="bg-white   w-100"
                  columns={tasksColumns}
                  dataSource={convertColumns(tables.tasks.data, cols)}
                  pagination={{
                    pageSizeOptions: ["10", "15", "20", "25", "30"],
                    showSizeChanger: true,
                    current_page: 1,
                  }}
                />
              </TabPane>
            )}
          </Tabs>
        </div>
      </div>

      <Modal
        title={t("addNewProduct")}
        centered
        className="padModal mediumModal"
        onOk={() => setVisibleImport(false)}
        onCancel={() => setVisibleImport(false)}
        visible={visibleImport}
        footer={false}
      >
        <ImportModal
          triggerFetch={triggerFetch}
          setVisibleImport={setVisibleImport}
          visibleImport={visibleImport}
        />
      </Modal>

      <Modal
        title={t("newExoort")}
        centered
        className="padModal addTaskModal"
        onOk={() => setVisibleExport(false)}
        onCancel={() => setVisibleExport(false)}
        visible={visibleExport}
        footer={false}
      >
        <ExportModal
          triggerFetch={triggerFetch}
          setVisibleExport={setVisibleExport}
          visibleExport={visibleExport}
        />
      </Modal>

      <Modal
        title={
          <div className="flex flex-align-center">
            <p>{t("import") + "/" + t("export")}</p>
            <div className="ml-20">
              {/* <Tooltip title={t("print")}>
                <Button shape="circle">
                  <PrinterFilled />
                </Button>
              </Tooltip> */}
            </div>
          </div>
        }
        centered
        className="mediumModal"
        onOk={() => setVisibleView(false)}
        onCancel={() => setVisibleView(false)}
        visible={visibleView}
        footer={[
          <div key="0" className="modalButtons">
            <Button onClick={() => setVisibleView(false)}>{t("close")}</Button>
          </div>,
        ]}
      >
        <ImportExportModal
          triggerFetch={triggerFetch}
          inout={tables.inouts.data[tables.inouts.selected]}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};
export default connect(mapStateToProps, { notify, getStock })(
  DragAndFertilizers
);
