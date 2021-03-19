import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Tooltip,
  Modal,
  Popconfirm,
  // notification,
} from "antd";
import {
  FieldTimeOutlined,
  CheckCircleFilled,
  EyeFilled,
  PlusCircleOutlined,
  // FrownOutlined,
  // SmileOutlined,
  // PlusCircleFilled,
} from "@ant-design/icons";
import DetailedReports from "./Modals/DetailedReports";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../utils/columnconverter";
import moment from "moment";
import agros from "../../../const/api";
import Create from "../Warehouse/Demands/Modals/Create";
import { notify } from "../../../redux/actions";
import { connect } from "react-redux";
import View from "./Modals/View";

const Reports = (props) => {
  const { t } = useTranslation();
  const [visibleAddNewDemand, setVisibleAddNewDemand] = useState(false);
  // const [confirmDemand, setConfirmDemand] = useState(false);

  const cols = [
    { key: "key", value: "#", con: true },
    { key: "index", value: "", con: true },
    { key: "toDoName", value: t("heading"), con: true },
    { key: "startDate", value: t("startDate"), con: true },
    { key: "endDate", value: t("endDate"), con: true },
    { key: "manWorkerCount", value: "Kişi işçi sayı", con: true },
    { key: "womanWorkerCount", value: "Qadın işçi sayı", con: true },
    { key: "workStatusName", value: "Status", con: true },
    { key: "buttonsObject", value: "", con: false },
  ];
  const [visibleViewReports, setVisibleViewReports] = useState(false);
  const [visibleViewReport, setVisibleViewReport] = useState(false);
  const [viewReportId, setViewReportId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
  // const [demandFor, setDemandFor] = useState(null);
  // const [demandValues, setDemandValues] = useState([]);
  let [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const getData = () => {
      agros.get("workplanreport").then((res) => {
        setTasks(
          res.data.map((d, index) => {
            return {
              ...d,
              index,
              key: index + 1,
              workStatusName: (
                <span className="text-primary">{d.workStatusName}</span>
              ),
              startDate: moment(d.startDate).format("DD-MM-YYYY"),
              endDate: moment(d.endDate).format("DD-MM-YYYY"),
              buttonsObject: {
                id: d.id,
                workStatus: d.workStatus,
                index: index,
                hasDemand: d.hasDemand,
              },
            };
          })
        );
      });
    };
    getData();
  }, [t, trigger]);

  const triggerFetch = () => {
    setSelectedTask({});
    setTrigger(++trigger);
  };

  const changeTaskStatus = (id) => {
    agros.put("workplanreport/start/" + id).then((res) => {
      // if (res.data && res.data.hasDemand) {
      //   notification.info({
      //     message: "Əməliyyat uğursuz oldu",
      //     description: "Siz artıq bu tapşırıq üçün tələb yaratmısınız.",
      //     icon: <FrownOutlined />,
      //   });
      // } else {
      // if (res.data && res.data.demands.length) {
      //   setConfirmDemand(true);
      //   setDemandValues(res.data.demands);
      //   setDemandFor(id);
      //   notification.info({
      //     message: "Əməliyyat uğursuz oldu",
      //     description:
      //       "Çatışmayan resurslar var. Onları əldə etmək üçün tələb yarada bilərsiniz.",
      //     icon: <FrownOutlined />,
      //   });
      // } else {
      props.notify("", true);
      setTrigger(++trigger);
      // }
      // }
    });
  };

  const viewReportPage = (index) => {
    setSelectedTask(tasks[index]);
    setVisibleViewReports(true);
  };

  const viewDetailedPage = (id) => {
    setViewReportId(id);
    setVisibleViewReport(true);
  };

  // table data columns
  const initialColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: 1,
      width: 60,
    },
    {
      title: t("heading"),
      dataIndex: "toDoName",
      key: 2,
    },
    {
      title: "Kişi işçi sayı",
      dataIndex: "manWorkerCount",
      key: 3,
    },
    {
      title: "Qadın işçi sayı",
      dataIndex: "womanWorkerCount",
      key: 4,
    },
    {
      title: t("startDate"),
      dataIndex: "startDate",
      key: 5,
    },
    {
      title: t("endDate"),
      dataIndex: "endDate",
      key: 6,
    },
    {
      title: "Status",
      dataIndex: "workStatusName",
      key: 7,
    },
    {
      title: "",
      dataIndex: "buttonsObject",
      key: 8,
      render: (o) => {
        return (
          <div className="flex flex-end">
            {o.workStatus === 1 && (
              <Popconfirm
                placement="bottomLeft"
                title={"Tapşırığa başlamaq istədiyinizə əminsiniz?"}
                onConfirm={() => changeTaskStatus(o.id, 0)}
                okText={t("yes")}
                cancelText={t("no")}
              >
                <Tooltip className="ml-5" title={"Tapşırığa başla"}>
                  <Button className="border-none" type="text" shape="circle">
                    <PlusCircleOutlined />
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
            {o.workStatus === 2 && (
              <Popconfirm
                placement="bottomLeft"
                title={t("areYouSureEndTask")}
                onConfirm={() => viewReportPage(o.index)}
                okText={t("yes")}
                cancelText={t("no")}
              >
                <Tooltip className="ml-5" title={"Tapşırığı bitir"}>
                  <Button className="border-none" type="text" shape="circle">
                    <CheckCircleFilled />
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
            <Tooltip
              className="ml-5"
              placement="topRight"
              title={t("detailedInfo")}
            >
              <Button
                className="border-none"
                type="text"
                shape="circle"
                onClick={() => viewDetailedPage(o.id)}
              >
                <EyeFilled />
              </Button>
            </Tooltip>
            {/* {o.workStatus === 2 && (
              <Tooltip
                className="ml-5"
                placement="topRight"
                title="Hesabat yarat"
              >
                <Button
                  className="border-none"
                  type="text"
                  shape="circle"
                  onClick={() => viewReportPage(o.index)}
                >
                  <PlusCircleFilled />
                </Button>
              </Tooltip>
            )} */}
          </div>
        );
      },
    },
  ];

  // const createDemandCancelled = () => {
  //   setConfirmDemand(false);
  // };

  // const createDemandConfirmed = () => {
  //   agros
  //     .post("demand", {
  //       name: `${demandFor} nömrəli tapşırıq üçün tələb`,
  //       demandProduct: demandValues,
  //     })
  //     .then((res) => {
  //       notification.info({
  //         message: "Əməliyyat uğurlu oldu",
  //         description: "Yeni tələb yaradıldı",
  //         icon: <SmileOutlined />,
  //       });
  //       // notify(t("newDemandCreated"), true);
  //       setConfirmDemand(false);
  //     })
  //     .catch((err) => {
  //       notify(err.response, false);
  //     });
  // };

  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="border  flex p-2 mt-0 bg-white">
            <div>
              <FieldTimeOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("reports")}</span>
            </div>
          </div>
        </Col>
        <Col xs={24}>
          <Table
            size="small"
            className="bg-white"
            columns={initialColumns}
            dataSource={convertColumns(tasks, cols)}
            pagination={{
              pageSizeOptions: ["10", "15", "20", "25", "30"],
              showSizeChanger: true,
              current_page: 1,
            }}
          />
        </Col>
      </Row>

      <Modal
        title={t("report")}
        centered
        className="addTaskModal padModal"
        visible={visibleViewReports}
        onOk={() => setVisibleViewReports(false)}
        onCancel={() => setVisibleViewReports(false)}
        footer={[]}
      >
        <DetailedReports
          task={selectedTask}
          triggerFetch={triggerFetch}
          visibleViewReports={visibleViewReports}
          setVisibleViewReports={setVisibleViewReports}
        />
      </Modal>

      <Modal
        title="Ətraflı məlumat"
        centered
        className="addTaskModal padModal"
        visible={visibleViewReport}
        onOk={() => setVisibleViewReport(false)}
        onCancel={() => setVisibleViewReport(false)}
        footer={[]}
      >
        <View
          task={viewReportId}
          visibleViewReport={visibleViewReport}
          setVisibleViewReport={setVisibleViewReport}
        />
      </Modal>

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
          selectedTask={selectedTask}
          setVisibleAddNewDemand={setVisibleAddNewDemand}
        />
      </Modal>
      {/* <Modal
        title="Tələb yarat"
        visible={confirmDemand}
        onOk={createDemandConfirmed}
        okText="Bəli"
        cancelText="Xeyr"
        // confirmLoading={confirmLoading}
        onCancel={createDemandCancelled}
      >
        <p>
          İşə başlamaq üçün çatışmayan resurslar var. Bu resurslar üçün tələb
          yaratmaq istəyirsiniz?
        </p>
      </Modal> */}
    </div>
  );
};

export default connect(null, { notify })(Reports);
