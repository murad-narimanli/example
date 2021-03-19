import React, { useState, useEffect } from "react";
import "@ant-design/compatible/assets/index.css";
import {
  Row,
  Col,
  Table,
  Button,
  Tooltip,
  Popconfirm,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import {
  FieldTimeOutlined,
  UsergroupAddOutlined,
  EditFilled,
  EyeFilled,
  DeleteFilled,
  UserOutlined,
} from "@ant-design/icons";
import agros from "../../../../const/api";
import moment from "moment";
import Update from "./Modals/Update";
import SalaryHistory from "./Modals/SalaryHistory";
import View from "./Modals/View";
import { notify } from "../../../../redux/actions";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import { connect } from "react-redux";

const Workers = (props) => {
  const { t } = useTranslation();
  const hr = props.perms.hr.subs.workers.perms;
  const [workers, setWorkers] = useState([]);
  let [trigger, setTrigger] = useState(0);
  const [selected, setSelected] = useState(null);
  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "name", value: t("fullName"), con: true },
    { key: "startDate", value: t("workStartDate"), con: true },
    { key: "grossSalary", value: t("totalSalary"), con: true },
    { key: "netSalary", value: t("salary"), con: true },
    { key: "professions", value: t("positions"), con: true },
    { key: "id", value: "", con: false },
  ];

  useEffect(() => {
    const getUsers = () => {
      agros.get("hr").then((res) => {
        setWorkers(
          res.data.map((d, index) => {
            return {
              ...d,
              key: index + 1,
              index,
              tableIndex: index + 1,
              startDate: moment(d.startDate).format("DD-MM-YYYY"),
            };
          })
        );
      });
    };
    getUsers();
  }, [t, trigger]);

  const [visibleViewWorker, setVisibleViewWorker] = useState(false);
  const [visibleEditSalaryHistroy, setVisibleEditSalaryHistroy] = useState(
    false
  );
  const [visibleEditWorker, setVisibleEditWorker] = useState(false);

  const [viewIndex, setViewIndex] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState(null);

  const viewSalaryHistory = (i) => {
    setSalaryHistory(workers[i].id);
    setTrigger(++trigger);
    setVisibleEditSalaryHistroy(true);
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
      title: t("fullName"),
      dataIndex: "name",
      key: "2",
    },
    {
      title: t("workStartDate"),
      dataIndex: "startDate",
      key: "3",
    },
    {
      title: t("totalSalary"),
      dataIndex: "grossSalary",
      key: "4",
    },
    {
      title: t("salary"),
      dataIndex: "netSalary",
      key: "5",
    },
    {
      title: t("positions"),
      dataIndex: "professions",
      key: "6",
    },
    {
      title: "",
      dataIndex: "index",
      key: "9",
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Tooltip
              className="ml-5"
              title={t("operations")}
              placement="leftBottom"
            >
              <Dropdown
                overlay={
                  <Menu>
                    {hr.update && (
                      <Menu.Item onClick={() => openUpdateModal(i)}>
                        <div className="flex f-14 flex-align-center pr-1 pl-1">
                          <EditFilled className="mr5-5" />
                          <span>{t("edit")}</span>
                        </div>
                      </Menu.Item>
                    )}
                    {hr.readSalaryHistory && (
                      <Menu.Item>
                        <div
                          onClick={() => viewSalaryHistory(i)}
                          className="flex f-14 flex-align-center pr-1 pl-1"
                        >
                          <FieldTimeOutlined className="mr5-5" />
                          <span>{t("salaryHistory")}</span>
                        </div>
                      </Menu.Item>
                    )}
                    {hr.read && (
                      <Menu.Item onClick={() => viewWorker(i)}>
                        <div className="flex f-14 flex-align-center pr-1 pl-1">
                          <UserOutlined className="mr5-5" />
                          <span>{t("detailed")}</span>
                        </div>
                      </Menu.Item>
                    )}
                    {hr.delete && (
                      <Menu.Item>
                        <Popconfirm
                          placement="topRight"
                          title={t("areYouSure")}
                          okText={t("yes")}
                          cancelText={t("no")}
                          onConfirm={() => deleteWorker(i)}
                        >
                          <div className="flex f-14 flex-align-center pr-1 pl-1">
                            <DeleteFilled className="mr5-5" />
                            <span>{t("delete")}</span>
                          </div>
                        </Popconfirm>
                      </Menu.Item>
                    )}
                  </Menu>
                }
                placement="bottomRight"
                arrow
              >
                <Button shape="circle" className="border-none">
                  <EyeFilled />
                </Button>
              </Dropdown>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const { notify } = props;

  const deleteWorker = (i) => {
    if (i) {
      agros
        .delete(`hr/${workers[i].id}`)
        .then((res) => {
          const all = [...workers];
          all.splice(i, 1);
          setWorkers(all);
          notify(t("workerDeleted"), true);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    }
  };

  const openUpdateModal = (selectedw) => {
    if (selectedw !== null) {
      setSelected(workers[selectedw]);
    } else {
      setSelected(null);
    }
    setVisibleEditWorker(true);
  };

  const viewWorker = (i) => {
    setViewIndex(i);
    setVisibleViewWorker(true);
  };

  const triggerFetch = () => {
    setTrigger(++trigger);
  };

  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="border  page-heading flex p-2 mt-0 bg-white">
            <div className="page-name">
              <UsergroupAddOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("humanResources")}</span>
            </div>
            {hr.create && (
              <Button onClick={() => openUpdateModal(null)} type="primary">
                {t("addTo")}
              </Button>
            )}
          </div>
        </Col>
        <Col xs={24}>
          <Table
            size="small"
            className="bg-white"
            columns={initialColumns}
            dataSource={convertColumns(workers, cols)}
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
        visible={visibleViewWorker}
        onOk={() => setVisibleViewWorker(false)}
        onCancel={() => setVisibleViewWorker(false)}
        footer={[
          <div key="0" className="modalButtons m-5">
            <Button type="primary" onClick={() => setVisibleViewWorker(false)}>
              {t("close")}
            </Button>
          </div>,
        ]}
      >
        <View worker={workers[viewIndex]} />
      </Modal>

      <Modal
        title={t("addNewWorker")}
        centered
        className="addTaskModal padModal"
        visible={visibleEditWorker}
        onOk={() => setVisibleEditWorker(false)}
        onCancel={() => setVisibleEditWorker(false)}
        footer={[]}
      >
        <Update
          setVisibleEditWorker={setVisibleEditWorker}
          worker={selected?.id}
          triggerFetch={triggerFetch}
          salary={{
            NetSalary: selected?.netSalary,
            GrossSalary: selected?.grossSalary,
          }}
        />
      </Modal>

      <Modal
        title={t("salaryHistory")}
        centered
        className="salaryHistoryModal"
        visible={visibleEditSalaryHistroy}
        onOk={() => setVisibleEditSalaryHistroy(false)}
        onCancel={() => setVisibleEditSalaryHistroy(false)}
        footer={[
          <div key="0" className="modalButtons m-5">
            <Button
              type="primary"
              onClick={() => setVisibleEditSalaryHistroy(false)}
            >
              {t("close")}
            </Button>
          </div>,
        ]}
      >
        <SalaryHistory
          salaryHistory={salaryHistory}
          trigger={trigger}
          visibleEditSalaryHistroy={visibleEditSalaryHistroy}
          setVisibleEditSalaryHistroy={setVisibleEditSalaryHistroy}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};
export default connect(mapStateToProps, { notify })(Workers);
