import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Tabs, Modal } from "antd";
import {
  ReloadOutlined,
  CheckOutlined,
  FieldTimeOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import NewTask from "./NewTask";
import Man from "../../../../../assets/img/man.svg";
import Woman from "../../../../../assets/img/woman.svg";
import agros from "../../../../../const/api";
import View from "./../../../Reports/Modals/View";
import moment from "moment";

import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../../utils/columnconverter";

const { TabPane } = Tabs;

const ViewPlan = (props) => {
  const { t } = useTranslation();
  const [viewReportId, setViewReportId] = useState(null);
  const [visibleViewReport, setVisibleViewReport] = useState(false);
  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "respondent", value: t("respondent"), con: true },
    { key: "titleObject", value: "", con: false },
    { key: "startDate", value: "", con: false },
    { key: "workStatus", value: "", con: false },
    { key: "employees", value: "", con: false },
  ];
  // modal table data.
  const fullModalColumns = [
    {
      title: "Tapşırıq",
      key: 2,
      dataIndex: "titleObject",
      render: (e) => {
        return (
          <div className="flex statusTd">
            <p>{t("task")}</p>
            <div>
              <div className="bold">{e.toDoName}</div>
              <div>{e.description}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: t("date"),
      key: 3,
      dataIndex: "startDate",
      render: (d) => {
        return (
          <div className="flex statusTd">
            <p>{t("date")}</p>
            <span>{moment(d).format("DD-MM-YYYY")}</span>
          </div>
        );
      },
    },
    {
      title: t("respondent"),
      key: 4,
      dataIndex: "respondent",
    },
    {
      title: t("workerNumber"),
      key: 6,
      dataIndex: "employees",
      render: (i) => {
        return (
          <div className="flex statusTd">
            <p>{t("workerNumber")}</p>
            <div className="flex">
              <Button className="p-5 flex all-center  mr5-5">
                <img src={Man} height="100%" alt="" />
                {i.man}
              </Button>
              <Button className="p-5 flex all-center">
                <img src={Woman} height="100%" alt="" />
                {i.woman}
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      key: 5,
      dataIndex: "workStatus",
      render: (d) => {
        return (
          <div className="flex statusTd">
            <p>{t("status")}</p>
            <span className="text-primary">{d}</span>
          </div>
        );
      },
    },
    {
      title: "Bax",
      key: 6,
      dataIndex: "id",
      render: (i) => {
        return (
          <Button onClick={() => viewTask(i)}>
            <EyeOutlined />
          </Button>
        );
      },
    },
  ];

  const viewTask = (id) => {
    setViewReportId(id);
    setVisibleViewReport(true);
  };

  const [data, setData] = useState({
    yetToStarts: { items: [], fetched: false },
    processings: { items: [], fetched: false },
    finisheds: { items: [], fetched: false },
  });

  let [trigger, setTrigger] = useState(0);

  const vals = {
    1: "yetToStarts",
    2: "processings",
    3: "finisheds",
  };

  const [tabKey, setTabKey] = useState("1");

  const planRef = useRef(null);

  useEffect(() => {
    const getPlanTasks = () => {
      agros
        .get(`workplan/worlplantasks/${props.plan}?type=${tabKey}`)
        .then((res) => {
          const newData = { ...data };
          newData[vals[tabKey]] = {
            items: res.data.map((r, index) => {
              return {
                ...r,
                key: index,
                titleObject: {
                  description: r.description,
                  toDoName: r.toDoName,
                },
                employees: { man: r.manWorkerCount, woman: r.womanWorkerCount },
              };
            }),
            fetched: true,
          };
          setData(newData);
        });
    };

    if (props.plan !== planRef.current) {
      let obj = data;
      Object.keys(obj).forEach((o) => {
        obj[o] = { items: [], fetched: false };
      });
      planRef.current = props.plan;
      setData(obj);
    }

    if (!data[vals[tabKey]].fetched) {
      getPlanTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey, props.plan, vals, t, trigger]);

  const triggerFetch = () => {
    setData({
      yetToStarts: { items: [], fetched: false },
      processings: { items: [], fetched: false },
      finisheds: { items: [], fetched: false },
    });
    setTrigger(++trigger);
  };

  return (
    <div className="tab-section modal-tabs">
      <Tabs
        animated={true}
        defaultActiveKey={tabKey}
        className="bg-white w-100"
        onChange={setTabKey}
      >
        <TabPane
          tab={
            <div>
              <FieldTimeOutlined />
              <span>{t("notStartedTasks")}</span>
            </div>
          }
          key="1"
        >
          <Table
            size="small"
            className="bg-white w-100"
            columns={fullModalColumns}
            dataSource={convertColumns(data.yetToStarts.items, cols)}
            pagination={{ pageSize: 10, current_page: 1 }}
          />
        </TabPane>
        <TabPane
          tab={
            <div>
              <ReloadOutlined />
              <span>{t("tasksOnDone")}</span>
            </div>
          }
          key="2"
        >
          <Table
            size="small"
            className="bg-white w-100"
            columns={fullModalColumns}
            dataSource={convertColumns(data.processings.items, cols)}
            pagination={{ pageSize: 10, current_page: 1 }}
          />
        </TabPane>
        <TabPane
          tab={
            <div>
              <CheckOutlined />
              <span>{t("finishedTasks")}</span>
            </div>
          }
          key="3"
        >
          <Table
            size="small"
            className="bg-white w-100"
            columns={fullModalColumns}
            dataSource={convertColumns(data.finisheds.items, cols)}
            pagination={{ pageSize: 10, current_page: 1 }}
          />
        </TabPane>
      </Tabs>
      <Modal
        title={t("addtask")}
        centered
        className="addTaskModal padModal"
        onOk={() => props.setVisibleAddNewTask(false)}
        onCancel={() => props.setVisibleAddNewTask(false)}
        visible={props.visibleAddNewTask}
        footer={null}
      >
        <NewTask
          plan={props.plan}
          triggerFetch={triggerFetch}
          visibleAddNewTask={props.visibleAddNewTask}
          setVisibleAddNewTask={props.setVisibleAddNewTask}
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
    </div>
  );
};

export default ViewPlan;
