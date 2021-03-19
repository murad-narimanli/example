import React, { useState, useEffect } from "react";
import {
  Tabs,
  Row,
  Col,
  Button,
  Tooltip,
  Table,
  Modal,
  Select,
  DatePicker,
} from "antd";
import {
  UnorderedListOutlined,
  EyeFilled,
  CloseOutlined,
} from "@ant-design/icons";
import agros from "../../../../const/api";
import ViewPlan from "./Modals/ViewPlan";
import NewPlan from "./Modals/NewPlan";
import { convertColumns } from "../../../../utils/columnconverter";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { connect } from "react-redux";
import { getOptions } from "./../../../../redux/actions";
const { TabPane } = Tabs;
const { Option } = Select;

const Daily = (props) => {
  const { t, i18n } = useTranslation();
  const perms = props.perms.workplan.subs.daily;
  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("heading"), con: true },
    { key: "start", value: t("startDate"), con: true },
    { key: "end", value: t("endDate"), con: true },
    { key: "workStatus", value: "Status", con: true },
    { key: "id", value: "", con: false },
  ];

  const [plans, setPlans] = useState({ active: [], done: [] });
  const [visible, setVisible] = useState(false);
  const [visibleAddNewPlan, setVisibleAddNewPlan] = useState(false);
  const [visibleAddNewTask, setVisibleAddNewTask] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState();
  const [tabKey, setTabKey] = useState("1");
  const [parcelCategoryId, setParcelCategoryId] = useState(0);
  const [parcelId, setParcelId] = useState(0);

  const [endDate, setEndDate] = useState(undefined);
  const [startDate, setStartDate] = useState(moment(new Date(), "YYYY-MM-DD"));

  let [trigger, setTrigger] = useState(0);

  const handleStartDateChange = (e) => {
    setStartDate(e);
  };
  const handleEndDateChange = (e) => {
    setEndDate(e);
  };

  const handleParcelCategoryChange = (e) => {
    setParcelCategoryId(e);
    setParcelId(0);
  };
  const handleParcelChange = (e) => {
    setParcelId(e);
  };

  const { getOptions } = props;
  const options = props.options[props.lang];

  const getParams = () => {
    const types = tabKey === "1" ? [1, 2] : [3];
    return {
      type: types.join(","),
      startDate: startDate?.format("YYYY-MM-DD"),
      endDate: endDate?.format("YYYY-MM-DD"),
      parcelId: parcelId === 0 ? undefined : parcelId,
    };
  };

  useEffect(() => {
    getOptions(["parcelCategories", "parcels"], props.options, i18n.language);

    const ke = tabKey === "1" ? "active" : "done";
    const getPlans = () => {
      agros.get(`workplan`, { params: getParams() }).then((res) => {
        let objs = { ...plans };
        objs[ke] = res.data.map((d, index) => {
          return {
            ...d,
            key: index + 1,
            end: moment(d.endDate).format("DD-MM-YYYY"),
            start: moment(d.startDate).format("DD-MM-YYYY"),
            index: index + 1,
            workStatus: <span className="text-primary">{d.workStatus}</span>,
          };
        });
        setPlans(objs);
      });
    };
    getPlans();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleAddNewPlan, visibleAddNewTask, t, trigger, tabKey]);

  const searchPlans = () => {
    const ke = tabKey === "1" ? "active" : "done";
    agros.get(`workplan`, { params: getParams() }).then((res) => {
      let objs = { ...plans };
      objs[ke] = res.data.map((d, index) => {
        return {
          ...d,
          key: index + 1,
          end: moment(d.endDate).format("DD-MM-YYYY"),
          start: moment(d.startDate).format("DD-MM-YYYY"),
          index: index + 1,
          workStatus: <span className="text-primary">{d.workStatus}</span>,
        };
      });
      setPlans(objs);
    });
  };

  const triggerFetch = () => {
    setTrigger(++trigger);
  };

  // table data columns
  const columns = [
    {
      title: "#",
      key: 1,
      dataIndex: "index",
      width: 70,
    },
    {
      title: t("heading"),
      key: 2,
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("startDate"),
      key: 3,
      dataIndex: "start",
      sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("endDate"),
      key: 4,
      dataIndex: "end",
      sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix(),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Parsel",
      key: 5,
      dataIndex: "parcelName",
      sorter: (a, b) => a.name.localeCompare(b.parcelName),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      key: 6,
      dataIndex: "workStatus",
      sorter: (a, b) => a.name.localeCompare(b.workStatus),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "",
      key: 7,
      dataIndex: "id",
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Tooltip className="ml-5" title={t("detailedInfo")}>
              <Button
                onClick={async () => {
                  setSelectedPlan(i);
                  setVisible(true);
                }}
                className="border-none"
                type="text"
                shape="circle"
              >
                <EyeFilled />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleTabChange = (e) => {
    setTabKey(e);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="border page-heading flex p-2 mt-0 bg-white">
            <div className="page-name small-name">
              <UnorderedListOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("dailyPlaning")}</span>
            </div>
            {perms.perms.create && (
              <Button type="primary" onClick={() => setVisibleAddNewPlan(true)}>
                {t("createNewTask")}
              </Button>
            )}
          </div>
        </Col>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={4}>
              <DatePicker
                className="w-100"
                value={startDate}
                placeholder="Başlanğıc tarixi"
                onChange={(e) => handleStartDateChange(e)}
              />
            </Col>
            <Col span={4}>
              <DatePicker
                className="w-100"
                value={endDate}
                placeholder="Son tarix"
                onChange={(e) => handleEndDateChange(e)}
              />
            </Col>
            <Col span={5}>
              <Select
                className="w-100"
                value={parcelCategoryId}
                onClear={handleParcelCategoryChange}
                onChange={handleParcelCategoryChange}
                allowClear
              >
                <Option key={100000} value={0}>
                  Bütün sahə kateqoriyaları
                </Option>
                {options.parcelCategories.map((pc, index) => {
                  return (
                    <Option key={index} value={pc.id}>
                      {pc.name}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                disabled={!parcelCategoryId}
                className="w-100"
                value={parcelId}
                onChange={handleParcelChange}
                allowClear
              >
                <Option key={100000} value={0}>
                  Bütün sahələr
                </Option>
                {options.parcels
                  .filter((p) => p.parcelCategoryId === parcelCategoryId)
                  .map((pc, index) => {
                    return (
                      <Option key={index} value={pc.id}>
                        {pc.name}
                      </Option>
                    );
                  })}
              </Select>
            </Col>
            <Col span={3}>
              <Button type="primary" size="large" onClick={searchPlans}>
                Axtar
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={24}>
          <div className="tab-section">
            <Tabs
              defaultActiveKey="1"
              onChange={handleTabChange}
              className="bg-white w-100"
            >
              {perms.subs.activeWorkPlans.perms.read && (
                <TabPane tab={t("activeWorkPlans")} key="1">
                  <Table
                    size="small"
                    className="bg-white w-100"
                    columns={columns}
                    dataSource={convertColumns(plans.active, cols)}
                    pagination={{ pageSize: 10, current_page: 1 }}
                  />
                </TabPane>
              )}
              {perms.subs.doneWorkPlans.perms.read && (
                <TabPane tab={t("finishedPlans")} key="3">
                  <Table
                    size="small"
                    className="bg-white w-100"
                    columns={columns}
                    dataSource={convertColumns(plans.done, cols)}
                    pagination={{ pageSize: 10, current_page: 1 }}
                  />
                </TabPane>
              )}
            </Tabs>
          </div>
        </Col>
      </Row>

      <Modal
        title={
          <div className="custom-modal-header">
            <div onClick={() => setVisible(false)} className="close">
              <CloseOutlined />
            </div>
            <div className="heading p-1">{t("heading")}</div>
            <div className="addTask" onClick={() => setVisibleAddNewTask(true)}>
              {t("addtask")}
            </div>
          </div>
        }
        centered
        className="fullmodal"
        visible={visible}
        footer={null}
      >
        <ViewPlan
          visibleAddNewTask={visibleAddNewTask}
          setVisibleAddNewTask={setVisibleAddNewTask}
          plan={selectedPlan}
          visible={visible}
        />
      </Modal>

      <Modal
        title={t("createNewWorkPlan")}
        centered
        className="addTaskModal padModal"
        onOk={() => setVisibleAddNewPlan(false)}
        onCancel={() => setVisibleAddNewPlan(false)}
        visible={visibleAddNewPlan}
        footer={null}
      >
        <NewPlan
          triggerFetch={triggerFetch}
          visibleAddNewPlan={visibleAddNewPlan}
          setVisibleAddNewPlan={setVisibleAddNewPlan}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ user, options, lang }) => {
  return { perms: user.data.userPermissions, options, lang };
};
export default connect(mapStateToProps, { getOptions })(Daily);
