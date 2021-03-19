import React, { useEffect, useState } from "react";
import { Row, Col, Button, Tooltip, Table, Modal, Select, Input } from "antd";
import { UnorderedListOutlined, EyeFilled } from "@ant-design/icons";
import agros from "../../../../const/api";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import { getOptions } from "./../../../../redux/actions";
import { connect } from "react-redux";
import ViewTask from "./Modals/ViewTask";
import NewTask from "./Modals/NewTask";

const { Option } = Select;

const Yearly = (props) => {
  const { t, i18n } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [parcelCategoryId, setParcelCategoryId] = useState(0);
  const [parcelId, setParcelId] = useState(0);
  const [keyword, setKeyword] = useState("");
  let [trigger, setTrigger] = useState(0);

  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "name", value: t("heading"), con: true },
    { key: "parcelName", value: t("parsel"), con: true },
    { key: "periodCount", value: "Period sayı", con: true },
    { key: "index", value: "", con: false },
  ];

  const [selectedPlan, setSelectedPlan] = useState({
    periods: [
      {
        tasks: [{}],
      },
    ],
  });
  const { getOptions } = props;
  const options = props.options[props.lang];

  const handleParcelCategoryChange = (e) => {
    setParcelCategoryId(e);
    setParcelId(0);
  };
  const handleParcelChange = (e) => {
    setParcelId(e);
  };

  useEffect(() => {
    getOptions(["parcelCategories", "parcels"], props.options, i18n.language);
    const getPlans = () => {
      agros.get("annualworkplan").then((res) => {
        setPlans(
          res.data.map((p, index) => {
            return {
              ...p,
              key: index + 1,
              index,
              tableIndex: index + 1,
              periodCount: p.annualWorkPlanPeriod.length,
            };
          })
        );
      });
    };
    getPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, trigger]);

  const [visibleAddNewTask, setVisibleAddNewTask] = React.useState(false);
  const [visibleViewTask, setVisibleViewTask] = React.useState(false);

  const viewPlanData = (index) => {
    const plan = plans[index];
    setSelectedPlan(plan);
    setVisibleViewTask(true);
  };

  const triggerFetch = () => {
    setTrigger(++trigger);
  };

  const handleKeywordChage = (e) => {
    setKeyword(e.target.value);
  };

  const searchPlans = () => {
    agros
      .get("annualworkplan", {
        params: {
          keyword,
          parcelCategoryId: parcelCategoryId === 0 ? null : parcelCategoryId,
          parcelId: parcelId === 0 ? null : parcelId,
        },
      })
      .then((res) => {
        setPlans(
          res.data.map((p, index) => {
            return {
              ...p,
              key: index + 1,
              index,
              tableIndex: index + 1,
              periodCount: p.annualWorkPlanPeriod.length,
            };
          })
        );
      });
  };

  // table data columns
  const columns = [
    {
      title: "#",
      key: 1,
      dataIndex: "tableIndex",
      width: 70,
    },
    {
      title: t("heading"),
      key: 2,
      dataIndex: "name",
    },
    {
      title: t("parsel"),
      key: 3,
      dataIndex: "parcelName",
    },
    {
      title: "Period sayı",
      key: 4,
      dataIndex: "periodCount",
    },
    {
      title: "",
      key: 5,
      dataIndex: "index",
      render: (i) => {
        return (
          <div className="flex flex-end">
            {/* <Tooltip className="ml-5" title={t("edit")}>
              <Button
                onClick={() => editPlan(i)}
                className="border-none"
                type="text"
                shape="circle"
              >
                <EditFilled />
              </Button>
            </Tooltip> */}
            <Tooltip
              placement="topRight"
              className="ml-5"
              title={t("detailedInfo")}
            >
              <Button
                onClick={() => viewPlanData(i)}
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

  const editPlan = (index) => {
    setSelected(index !== null ? plans[index].id : null);
    setVisibleAddNewTask(true);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="border page-heading flex p-2 mt-0 bg-white">
            <div className="page-name small-name">
              <UnorderedListOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("yearlyPlaning")}</span>
            </div>
            <Button type="primary" onClick={() => editPlan(null)}>
              {t("createNewTask")}
            </Button>
          </div>
        </Col>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="Açar söz"
                value={keyword}
                onChange={(e) => handleKeywordChage(e)}
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
          <div>
            <Table
              size="small"
              className="bg-white w-100"
              columns={columns}
              dataSource={convertColumns(plans, cols)}
              pagination={{
                pageSizeOptions: ["10", "15", "20", "25", "30"],
                showSizeChanger: true,
                current_page: 1,
              }}
            />
            ,
          </div>
        </Col>
      </Row>

      <Modal
        title={t("detailedInfo")}
        centered
        className="addTaskModal"
        visible={visibleViewTask}
        onOk={() => setVisibleViewTask(false)}
        onCancel={() => setVisibleViewTask(false)}
        footer={null}
      >
        <ViewTask plan={selectedPlan} />
      </Modal>

      <Modal
        title={t("createNewWorkPlan")}
        centered
        className="addTaskModal padModal"
        visible={visibleAddNewTask}
        onOk={() => setVisibleAddNewTask(false)}
        onCancel={() => setVisibleAddNewTask(false)}
        footer={null}
      >
        <NewTask
          task={selected}
          triggerFetch={triggerFetch}
          visibleAddNewTask={visibleAddNewTask}
          setVisibleAddNewTask={setVisibleAddNewTask}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ user, options, lang }) => {
  return { perms: user.data.userPermissions, options, lang };
};
export default connect(mapStateToProps, { getOptions })(Yearly);
