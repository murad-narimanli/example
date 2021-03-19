import React, { useEffect, useState } from "react";
import { Tabs, Button, Table, Modal, Tooltip } from "antd";
import {
  UnorderedListOutlined,
  FilePptOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ImportModal from "./Modals/ImportModal";
import ImportExportModal from "./Modals/ImportExportModal";
import ExportModal from "./Modals/ExportModal";
import SalesModal from "./Modals/SalesModal";
import excell from "../../../../assets/img/excel.svg";
import { useTranslation } from "react-i18next";
import agros from "../../../../const/api";
import { convertColumns } from "../../../../utils/columnconverter";
import { connect } from "react-redux";
import { notify, getStock } from "../../../../redux/actions";
import TransferModal from "./Modals/TransferModal";

const { TabPane } = Tabs;
const Products = (props) => {
  const { notify } = props;
  const { t } = useTranslation();
  const perms = props.perms.warehouse.subs.productsWarehouse;
  const [visibleExport, setVisibleExport] = useState(false);
  const [visibleImport, setVisibleImport] = useState(false);
  const [visibleSales, setVisibleSales] = useState(false);
  const [visibleTransfer, setVisibleTransfer] = useState(false);
  const [visibleView, setvisibleView] = useState(false);

  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "barcode", value: t("barCode"), con: true },
    { key: "categoryName", value: t("category"), con: true },
    { key: "cropName", value: t("typeOf"), con: true },
    { key: "cropSortName", value: t("sortOf"), con: true },
    { key: "reproductionName", value: t("reproduction"), con: true },
    { key: "quantity", value: t("quantity"), con: true },
  ];

  const cols2 = [
    { key: "cropCategoryName", value: t("productCategory"), con: true },
    { key: "productName", value: t("productSorts"), con: true },
    { key: "reproductionName", value: t("reproduction"), con: true },
    { key: "warehouse", value: t("warehouse"), con: true },
    { key: "cropName", value: t("productName"), con: true },
    { key: "quantity", value: t("quantity"), con: true },
    { key: "operation", value: "", con: false },
    { key: "index", value: "", con: false },
  ];

  const [tables, setTables] = useState({
    crops: { data: [], url: "cropstock" },
    docs: { data: [], url: "cropstock/documents/0", selectedIndex: null },
    tasks: { data: [], url: "cropstock/tasks", selectedIndex: null },
  });

  let [trigger, setTrigger] = useState(0);

  const [tabKey, setTabKey] = useState("crops");

  useEffect(() => {
    const getData = () => {
      agros.get(tables[tabKey].url).then((res) => {
        const all = { ...tables };
        all[tabKey].data = res.data.map((r, index) => {
          return {
            ...r,
            key: index + 1,
            index,
            tableIndex: index + 1,
            quantity:
              r.quantity + (r.measurementUnit && " " + r.measurementUnit),
          };
        });
        setTables(all);
      });
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey, t, trigger]);

  const handleTabChange = (key) => {
    setTabKey(key);
  };

  const columns = [
    {
      title: "#",
      key: 1,
      dataIndex: "tableIndex",
      width: 70,
    },
    {
      title: t("category"),
      key: 3,
      dataIndex: "categoryName",
    },
    {
      title: t("typeOf"),
      key: 4,
      dataIndex: "cropName",
    },
    {
      title: t("sortOf"),
      key: 5,
      dataIndex: "cropSortName",
    },
    {
      title: t("reproduction"),
      key: 6,
      dataIndex: "reproductionName",
    },
    {
      title: t("quantityOf"),
      key: 7,
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

  const columnsIncomeExpense = [
    {
      title: "#",
      key: 1,
      dataIndex: "tableIndex",
      width: 70,
    },
    {
      title: t("productCategory"),
      key: 2,
      dataIndex: "cropCategoryName",
    },
    {
      title: t("productName"),
      key: 3,
      dataIndex: "cropName",
    },
    {
      title: t("productSorts"),
      key: 4,
      dataIndex: "productName",
    },
    {
      title: t("reproduction"),
      key: 5,
      dataIndex: "reproductionName",
    },
    {
      title: t("quantity"),
      key: 6,
      dataIndex: "quantity",
    },
    {
      title: t("warehouse"),
      key: 7,
      dataIndex: "warehouse",
    },
    {
      title: t("operation"),
      dataIndex: "operation",
      key: 8,
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
            ) : null}

            {i === 2 ? (
              <Button className="f-12" size="small" type="danger" shape="round">
                {t("export")}
              </Button>
            ) : null}

            {i === 3 ? (
              <Button className="f-12" size="small" type="danger" shape="round">
                Satış
              </Button>
            ) : null}
            {i === 4 ? (
              <Button className="f-12" size="small" type="danger" shape="round">
                Transfer
              </Button>
            ) : null}
          </div>
        );
      },
    },
    {
      title: "",
      dataIndex: "index",
      key: 9,
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Tooltip
              placement="leftBottom"
              className="ml-5"
              title={t("import") + "/" + t("export")}
            >
              <Button
                onClick={() => viewDoc(i)}
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
  const columnsTasks = [
    {
      title: "#",
      key: 1,
      dataIndex: "tableIndex",
      width: 70,
    },
    {
      title: t("productName"),
      key: 3,
      dataIndex: "crop",
    },
    {
      title: t("productSorts"),
      key: 4,
      dataIndex: "productName",
    },
    {
      title: t("quantity"),
      key: 6,
      dataIndex: "quantity",
    },
    {
      title: t("measurementUnit"),
      key: 7,
      dataIndex: "measurementUnit",
    },
  ];

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
        notify("", true);
      });
  };

  const viewDoc = (index) => {
    const all = { ...tables };
    all.docs.selectedIndex = index;
    setTables(all);
    setvisibleView(true);
  };

  const triggerFetch = () => {
    props.getStock();
    setTrigger(++trigger);
  };

  const triggerExcel = () => {
    let url = "";
    switch (tabKey) {
      case "crops":
        url = "exselexport/medicalstock";
        break;
      case "docs":
        url = "exselexport/medicaldocuments/0";
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
      <div className="border page-heading flex-align-center flex p-2 mt-0 bg-white">
        <div className="page-name">
          <UnorderedListOutlined className="f-20 mr5-15" />
          <span className="f-20 bold">{t("productWarehouse")}</span>
        </div>
        <div>
          {(tabKey === "crops" && perms.subs.products.perms.excelExport) ||
          (tabKey === "docs" &&
            perms.subs.importExportAndDocs.perms.excelExport) ? (
            <Tooltip placement="left" title="Excell export">
              <Button
                shape="circle"
                className="mr-10 border-none"
                onClick={triggerExcel}
              >
                <img src={excell} alt="" />
              </Button>
            </Tooltip>
          ) : null}
          {perms.perms.import && (
            <Button type="primary" onClick={() => setVisibleImport(true)}>
              {t("import")}
            </Button>
          )}
          {perms.perms.export && (
            <Button className="ml-10" onClick={() => setVisibleExport(true)}>
              {t("export")}
            </Button>
          )}
          {perms.perms.sale && (
            <Button className="ml-10" onClick={() => setVisibleSales(true)}>
              {t("sale")}
            </Button>
          )}
          {perms.perms.sale && (
            <Button className="ml-10" onClick={() => setVisibleTransfer(true)}>
              Transfer
            </Button>
          )}
        </div>
      </div>
      <div className="position-relative mt-15">
        <div className="position-absolute w-100 tab-section">
          <Tabs
            animated={true}
            defaultActiveKey="crops"
            className="bg-white w-100"
            onChange={handleTabChange}
          >
            {perms.subs.products.perms.read && (
              <TabPane tab={t("productWarehouse")} key="crops">
                <Table
                  size="small"
                  className="bg-white   w-100"
                  columns={columns}
                  dataSource={convertColumns(tables.crops.data, cols)}
                  // dataSource={tables.crops.data}
                  pagination={{
                    pageSizeOptions: ["10", "15", "20", "25", "30"],
                    showSizeChanger: true,
                    current_page: 1,
                  }}
                />
              </TabPane>
            )}
            {perms.subs.importExportAndDocs.perms.read && (
              <TabPane tab={t("importExportDocuments")} key="docs">
                <Table
                  size="small"
                  className="bg-white   w-100"
                  columns={columnsIncomeExpense}
                  // dataSource={tables.docs.data}
                  dataSource={convertColumns(tables.docs.data, cols2)}
                  pagination={{
                    pageSizeOptions: ["10", "15", "20", "25", "30"],
                    showSizeChanger: true,
                    current_page: 1,
                  }}
                />
              </TabPane>
            )}
            <TabPane tab={t("tasks")} key="tasks">
              <Table
                size="small"
                className="bg-white w-100"
                columns={columnsTasks}
                dataSource={convertColumns(tables.tasks.data, cols2)}
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

      <Modal
        title={t("addNewProduct")}
        centered
        className="padModal mediumModal"
        visible={visibleImport}
        footer={null}
        onCancel={() => setVisibleImport(false)}
      >
        <ImportModal
          setVisibleImport={setVisibleImport}
          visibleImport={visibleImport}
          triggerFetch={triggerFetch}
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
          setVisibleExport={setVisibleExport}
          visibleExport={visibleExport}
          triggerFetch={triggerFetch}
        />
      </Modal>

      <Modal
        title="Yeni satış"
        centered
        className="padModal addTaskModal"
        onOk={() => setVisibleSales(false)}
        onCancel={() => setVisibleSales(false)}
        visible={visibleSales}
        footer={false}
      >
        <SalesModal
          setVisibleSales={setVisibleSales}
          visibleSales={visibleSales}
          triggerFetch={triggerFetch}
        />
      </Modal>

      <Modal
        title="Yeni transfer"
        centered
        className="padModal addTaskModal"
        onOk={() => setVisibleTransfer(false)}
        onCancel={() => setVisibleTransfer(false)}
        visible={visibleTransfer}
        footer={false}
      >
        <TransferModal
          setVisibleTransfer={setVisibleTransfer}
          visibleSales={visibleTransfer}
          triggerFetch={triggerFetch}
        />
      </Modal>

      <Modal
        title={t("import") + "/" + t("export")}
        centered
        className="mediumModal"
        onOk={() => setvisibleView(false)}
        onCancel={() => setvisibleView(false)}
        visible={visibleView}
        footer={
          <div className="modalButtons">
            <Button onClick={() => setvisibleView(false)}>{t("close")}</Button>
          </div>
        }
      >
        <ImportExportModal
          doc={tables.docs.data[tables.docs.selectedIndex]}
          triggerFetch={triggerFetch}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};
export default connect(mapStateToProps, { notify, getStock })(Products);
