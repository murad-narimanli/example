import React, { useEffect, useState } from "react";
import { Tabs, Button, Tooltip, Table, Modal } from "antd";
import {
  UnorderedListOutlined,
  FileSearchOutlined,
  EditFilled,
  FileAddOutlined,
} from "@ant-design/icons";
import APurchase from "./Modals/APurchase";
import WPurchase from "./Modals/WPurchase";
import PPurchase from "./Modals/PPurchase";
import agros from "../../../../const/api";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import { connect } from "react-redux";
const { TabPane } = Tabs;

const getInitialState = () => {
  return {
    waiting: {
      url: "purchase/waiting",
      data: [],
      selectedObject: null,
      fetched: false,
    },
    approved: {
      url: "purchase/approved",
      data: [],
      selectedObject: null,
      fetched: false,
    },
    preparing: {
      url: "purchase",
      data: [],
      selectedObject: null,
      fetched: false,
    },
  };
};
const Purchases = (props) => {
  const { t } = useTranslation();
  const perms = props.perms.warehouse.subs.purchases.subs;
  const [visibleWPurchase, setVisibleWPurchase] = useState(false);
  const [visibleAPurchase, setVisibleAPurchase] = useState(false);
  const [visiblePPurchase, setVisiblePPurchase] = useState(false);
  const [tables, setTables] = useState(getInitialState());
  const [activeTab, setActiveTab] = useState("waiting");

  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "demandNumber", value: t("demmandNo"), con: true },
    { key: "createDate", value: t("createdDate"), con: true },
    { key: "customerName", value: t("supplier"), con: true },
    { key: "customerPhone", value: t("supplierConnection"), con: true },
    { key: "approvedDate", value: t("DateOfApproval"), con: true },
    { key: "approvedWorkerName", value: t("approvedPerson"), con: true },
    { key: "index", value: "", con: false },
    { key: "key", value: "", con: false },
  ];

  useEffect(() => {
    const getTableData = () => {
      agros.get(tables[activeTab].url).then((res) => {
        const all = { ...tables };
        all[activeTab].data = res.data.map((r, index) => {
          return {
            ...r,
            key: index + 1,
            index,
            valueAndIndex: { value: r.estimatedValue, index },
            tableIndex: index + 1,
            createDate:
              r.createDate && moment(r.createDate).format("DD-MM-YYYY, hh:mm"),
            approvedDate:
              r.approvedDate &&
              moment(r.approvedDate).format("DD-MM-YYYY, hh:mm"),
            customerName: r.customer && r.customer.name,
            customerPhone: r.customer && r.customer.phone,
          };
        });
        all[activeTab].fetched = true;
        setTables(all);
      });
    };

    if(!tables[activeTab].fetched){
      getTableData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, tables, t]);

  const commonColumns = [
    {
      title: "#",
      key: 1,
      dataIndex: "tableIndex",
    },
    {
      title: t("name"),
      key: 2,
      dataIndex: "name",
    },
    {
      title: t("demmandNo"),
      key: 3,
      dataIndex: "demandNumber",
    },
    {
      title: t("createdDate"),
      key: 4,
      dataIndex: "createDate",
    },
  ];

  const waitingTableColumns = commonColumns.concat([
    {
      title: t("status"),
      key: 6,
      dataIndex: "key",
      render: (i) => {
        return (
          <div className="flex statusTd">
            <p>{t("status")}</p>
            <span>
              <Button className="border-none btn-warning" shape="round">
                {t("onWait")}
              </Button>
            </span>
          </div>
        );
      },
    },
    {
      title: "",
      key: 7,
      dataIndex: "index",
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Tooltip className="ml-5" title={t("changeStatus")}>
              <Button
                onClick={() => viewPurchaseDetails(i, "waiting", 1)}
                className="border-none"
                type="text"
                shape="circle"
              >
                <EditFilled />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ]);

  const approvedTableColums = commonColumns.concat([
    {
      title: t("status"),
      key: 6,
      dataIndex: "key",
      render: (i) => {
        return (
          <div className="flex statusTd">
            <p>{t("status")}</p>
            <span>
              <Button className="border-none" type="primary" shape="round">
                {t("accepted")}
              </Button>
            </span>
          </div>
        );
      },
    },
    {
      title: "",
      key: 7,
      dataIndex: "valueAndIndex",
      render: (i) => {
        return (
          <div className="flex flex-end">
            {perms.approved.perms.createPurchaseDocument &&
            props.purchaseLimit > i.value ? (
              <Tooltip className="ml-5" title={t("createPurchaseDocument")}>
                <Button
                  onClick={() => viewPurchaseDetails(i.index, "approved", 3)}
                  className="border-none"
                  type="text"
                  shape="circle"
                >
                  <FileAddOutlined />
                </Button>
              </Tooltip>
            ) : null}
          </div>
        );
      },
    },
  ]);

  const preparingColumns = [
    {
      title: "#",
      key: 1,
      dataIndex: "tableIndex",
    },
    {
      title: t("supplier"),
      key: 2,
      dataIndex: "customerName",
    },
    {
      title: t("supplierConnection"),
      key: 3,
      dataIndex: "customerPhone",
    },
    {
      title: t("DateOfApproval"),
      key: 4,
      dataIndex: "approvedDate",
    },
    {
      title: t("approvedPerson"),
      key: 5,
      dataIndex: "approvedWorkerName",
    },
    {
      title: "",
      key: 6,
      dataIndex: "index",
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Tooltip className="ml-5" title={t("viewPurchaseDocument")}>
              <Button
                onClick={() => viewPurchaseDetails(i, "preparing", 2)}
                className="border-none"
                type="text"
                shape="circle"
              >
                <FileSearchOutlined />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const viewPurchaseDetails = (index, key, method) => {
    const all = { ...tables };
    all[key].selectedObject = all[key].data[index];
    setTables(all);
    switch (method) {
      case 1:
        setVisibleWPurchase(true);
        break;
      case 2:
        setVisiblePPurchase(true);
        break;
      case 3:
        setVisibleAPurchase(true);
        break;
      default:
        break;
    }
  };

  const handleTabChange = (e) => {
    setActiveTab(e);
  };

  const triggerFetch = () => {
    let all = { ...tables };
    all.waiting.fetched = false;
    all.approved.fetched = false;
    all.preparing.fetched = false;
    setTables(all);
  };

  return (
    <div>
      <div className="border bg-white p-2 mt-0">
        <UnorderedListOutlined className="f-20 mr5-15" />
        <span className="f-20 bold">{t("purchases")}</span>
      </div>
      <div className="position-relative mt-15">
        <div className="position-absolute w-100 purchase-tabs tab-section">
          <Tabs defaultActiveKey="1" onChange={handleTabChange}>
            {perms.waiting.perms.read && (
              <TabPane tab={t("onWait")} key="waiting">
                <div className="w-100">
                  <Table
                    size="small"
                    className="bg-white"
                    dataSource={convertColumns(tables.waiting.data, cols)}
                    columns={waitingTableColumns}
                    pagination={{
                      pageSize: 10,
                      current_page: 1,
                      pageSizeOptions: ["10", "15", "20", "25", "30"],
                    }}
                  />
                </div>
              </TabPane>
            )}
            {perms.approved.perms.read && (
              <TabPane tab={t("approveds")} key="approved">
                <div className="w-100">
                  <Table
                    size="small"
                    className="bg-white"
                    columns={approvedTableColums}
                    dataSource={convertColumns(tables.approved.data, cols)}
                    pagination={{
                      pageSize: 10,
                      current_page: 1,
                      pageSizeOptions: ["10", "15", "20", "25", "30"],
                    }}
                  />
                </div>
              </TabPane>
            )}
            {perms.preparing.perms.read && (
              <TabPane tab={t("preparedDocuments")} key="preparing">
                <div className="w-100">
                  <Table
                    size="small"
                    className="bg-white"
                    columns={preparingColumns}
                    dataSource={convertColumns(tables.preparing.data, cols)}
                    pagination={{
                      pageSize: 10,
                      current_page: 1,
                      pageSizeOptions: ["10", "15", "20", "25", "30"],
                    }}
                  />
                </div>
              </TabPane>
            )}
          </Tabs>
        </div>
      </div>

      <Modal
        title={t("detailedInfo")}
        centered
        className="addTaskModal padModal"
        onOk={() => setVisibleWPurchase(false)}
        onCancel={() => setVisibleWPurchase(false)}
        visible={visibleWPurchase}
        footer={null}
      >
        <WPurchase
          purchase={tables.waiting.selectedObject}
          visibleWPurchase={visibleWPurchase}
          setVisibleWPurchase={setVisibleWPurchase}
          triggerFetch={triggerFetch}
        />
      </Modal>

      <Modal
        title={t("createNewPurchaseDocument")}
        centered
        className="mediumModal padModal"
        onOk={() => setVisibleAPurchase(false)}
        onCancel={() => setVisibleAPurchase(false)}
        visible={visibleAPurchase}
        footer={null}
      >
        <APurchase
          purchase={tables.approved.selectedObject}
          visibleAPurchase={visibleAPurchase}
          setVisibleAPurchase={setVisibleAPurchase}
          triggerFetch={triggerFetch}
        />
      </Modal>

      <Modal
        title={t("detailedInfo")}
        centered
        className="addTaskModal"
        onOk={() => setVisiblePPurchase(false)}
        onCancel={() => setVisiblePPurchase(false)}
        visible={visiblePPurchase}
        footer={null}
      >
        <PPurchase
          purchase={tables.preparing.selectedObject}
          visiblePPurchase={visiblePPurchase}
          setVisiblePPurchase={setVisiblePPurchase}
          triggerFetch={triggerFetch}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return {
    perms: user.data.userPermissions,
    purchaseLimit: user.data.purchaseLimit,
  };
};
export default connect(mapStateToProps)(Purchases);
