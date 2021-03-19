import React, { useState, useEffect } from "react";
import "@ant-design/compatible/assets/index.css";
import { Row, Col, Button, Tooltip, Table, Modal } from "antd";
import { UnorderedListOutlined, FileTextOutlined } from "@ant-design/icons";
import agros from "../../../../const/api";
import View from "./Modals/View";
import Authorize from "../../../Elements/Authorize";
import moment from "moment";
import Create from "./Modals/Create";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";

function Demands(props) {
  const { t } = useTranslation();
  const [demands, setDemands] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState(0);
  let [trigger, setTrigger] = useState(0);
  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "createDate", value: t("createdDate"), con: true },
    { key: "demandNumber", value: t("demmandNo"), con: true },
    { key: "checkStatus", value: "", con: false },
    { key: "index", value: "", con: false },
  ];
  useEffect(() => {
    agros.get("demand").then((res) => {
      setDemands(
        res.data.map((r, index) => {
          return {
            ...r,
            key: index + 1,
            index,
            objectCount: r.demandProducts.length,
            tableIndex: index + 1,
            createDate: moment(r.createDate).format("DD-MM-YYYY"),
          };
        })
      );
    });
  }, [trigger, t]);

  const [visibleAddNewDemand, setVisibleAddNewDemand] = useState(false);
  const [visibleViewDemand, setVisibleViewDemand] = useState(false);

  const renderStatus = (val) => {
    switch (val) {
      case 1:
        return { color: "#E49F33", word: t("onWait") };
      case 2:
        return { color: "#7FBFA4", word: t("approved") };
      case 3:
        return { color: "#D24C41", word: t("canceled") };
      default:
        break;
    }
  };

  // table data columns
  const columns = [
    {
      title: "#",
      key: 1,
      dataIndex: "tableIndex",
      width: 60,
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
    {
      title: "Tələb obyektləri",
      key: 5,
      dataIndex: "objectCount",
      render: (a) => <span>{a} obyekt</span>,
    },
    {
      title: t("status"),
      key: 6,
      dataIndex: "checkStatus",
      render: (i) => {
        let options = renderStatus(i);
        return (
          <div className="flex statusTd">
            <p>{t("status")}</p>
            <span
              style={{
                backgroundColor: options.color,
              }}
              className="statusBox"
            >
              {options.word}
            </span>
          </div>
        );
      },
    },
    {
      title: "",
      key: 7,
      dataIndex: "index",
      width: 20,
      render: (i) => {
        return (
          <div className="flex flex-end">
            {/*must add to database*/}
            <Authorize
              mainMenu={"warehouse"}
              page={["demands", "perms"]}
              type={"readDemand"}
            >
              <Tooltip className="ml-5" title={t("demand")}>
                <Button
                  onClick={() => viewDemand(i)}
                  className="border-none"
                  type="text"
                  shape="circle"
                >
                  <FileTextOutlined />
                </Button>
              </Tooltip>
            </Authorize>
          </div>
        );
      },
    },
  ];

  const viewDemand = (index) => {
    setSelectedDemand(index);
    setVisibleViewDemand(true);
  };

  const ops = demands[selectedDemand]
    ? renderStatus(demands[selectedDemand].checkStatus)
    : {};

  const newDemandAdded = () => {
    setVisibleAddNewDemand(false);
    setTrigger(++trigger);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="border page-heading flex p-2 mt-0 bg-white">
            <div className="page-name">
              <UnorderedListOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("demands")}</span>
            </div>
            <Authorize
              mainMenu={"warehouse"}
              page={["demands", "perms"]}
              type={"create"}
            >
              <Button
                type="primary"
                onClick={() => setVisibleAddNewDemand(true)}
              >
                {t("addTo")}
              </Button>
            </Authorize>
          </div>
        </Col>
        <Col xs={24}>
          <div>
            <Table
              size="small"
              className="bg-white w-100"
              columns={columns}
              dataSource={convertColumns(demands, cols)}
              pagination={{
                pageSizeOptions: ["10", "15", "20", "25", "30"],
                showSizeChanger: true,
                current_page: 1,
              }}
            />
          </div>
        </Col>
      </Row>

      {/*details modal*/}
      <Modal
        title={
          <div className="status">
            <div className="flex flex-align-center flex-between">
              {demands[selectedDemand] ? (
                <>
                  <h3>
                    {demands[selectedDemand].name} / №
                    {demands[selectedDemand].demandNumber}
                  </h3>
                  <span
                    style={{
                      backgroundColor: ops.color,
                    }}
                    className="statusBox"
                  >
                    {ops.word}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        }
        centered
        className="addTaskModal demandModal"
        visible={visibleViewDemand}
        onOk={() => setVisibleViewDemand(false)}
        onCancel={() => setVisibleViewDemand(false)}
        footer={[]}
      >
        <View demand={demands[selectedDemand]} />
      </Modal>

      {/*addnewtask or edit task modal*/}

      <Modal
        title={t("createNewDemand")}
        centered
        className="addTaskModal padModal"
        visible={visibleAddNewDemand}
        onOk={() => setVisibleAddNewDemand(false)}
        onCancel={() => setVisibleAddNewDemand(false)}
        footer={null}
      >
        <Create
          setVisibleAddNewDemand={setVisibleAddNewDemand}
          newDemandAdded={newDemandAdded}
        />
      </Modal>
    </div>
  );
}

export default Demands;
