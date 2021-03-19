import React, { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import {
  Form,
  DatePicker,
  Row,
  Col,
  Button,
  Tooltip,
  Select,
  Table,
  Modal,
} from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getOptions } from "./../../../../redux/actions";
import { connect } from "react-redux";
import agros from "./../../../../const/api";
import Man from "../../../../assets/img/man.svg";
import Woman from "../../../../assets/img/woman.svg";
import { EyeOutlined } from "@ant-design/icons";
import View from "./../../Reports/Modals/View";
import ViewEndReport from "./Modals/ViewEndReport";
import moment from "moment";

const { Option } = Select;

const Todos = (props) => {
  const [form] = useForm();
  const [filters, setFilters] = useState({});
  const [viewReportId, setViewReportId] = useState(null);
  const [visibleViewReport, setVisibleViewReport] = useState(false);
  // new
  const [visibleReportEnd, setVisibleReportEnd] = useState(false);
  const [ReportEndId, setReportEndId] = useState(null);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [st, setSt] = useState({ tasks: 0, done: 0, percent: 0 });

  const { t, i18n } = useTranslation();

  const { getOptions } = props;
  const options = props.options[props.lang];

  const handleKeyChange = (e, key) => {
    const all = { ...filters };
    all[key] = e;
    setFilters(all);
  };

  const clearFilter = () => {
    form.resetFields();
    form.setFieldsValue({ parcelId: 0, parcelCategoryId: 0 });
  };

  const search = (values) => {
    values.parcelId = values.parcelId === 0 ? null : values.parcelId;
    values.parcelCategoryId =
      values.parcelCategoryId === 0 ? null : values.parcelCategoryId;
    getData(values);
  };

  const getData = (values) => {
    agros.get("statistics/todos", { params: formatParams(values) }).then((res) => {
      setTotal(res.data.total);
      setData(
        res.data.data.map((r, index) => {
          return {
            ...r,
            key: index,
            titleObject: {
              description: r.description,
              toDoName: r.toDoName,
            },
            employees: { man: r.manWorkerCount, woman: r.womanWorkerCount },
          };
        })
      );
      setSt({
        tasks: res.data.tasks,
        done: res.data.done,
        percent: Math.ceil((res.data.done * 100) / res.data.tasks),
      });
    });
  };

  const changePage = (e) => {
    let values = { ...form.getFieldsValue(), page: e.current };
    getData(formatParams(values));
  };

  const formatParams = (values) => {
    values.parcelId = values.parcelId === 0 ? null : values.parcelId;
    values.parcelCategoryId =
      values.parcelCategoryId === 0 ? null : values.parcelCategoryId;
      
    values.startDate = values.startDate?.format("YYYY-MM-DD");
    values.endDate = values.endDate?.format("YYYY-MM-DD");
    return values;
  };

  useEffect(() => {
    getOptions(
      [
        "tools",

        "parcelCategories",
        "parcelSectors",
        "parcels",

        "todos",
        "positions",
        "users",

        "workStatuses",
      ],
      props.options,
      i18n.language
    );
    form.setFieldsValue({ parcelId: 0, parcelCategoryId: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const fullModalColumns = [
    {
      title: t("task"),
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
    {
      title: "Hesabat",
      key: 6,
      dataIndex: "reportId",
      render: (i) => {
        return (
           <div>
             {i !== null &&
             <Button onClick={() => viewReport(i)}>
               <EyeOutlined />
             </Button>
             }
           </div>
        );
      },
    },
  ];

  const viewTask = (id) => {
    setViewReportId(id);
    setVisibleViewReport(true);
  };

  const viewReport = (id) => {
    setReportEndId(id);
    setVisibleReportEnd(true);
  };

  return (
    <>
      <Form form={form} onFinish={search} layout="vertical" className="mt-10">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="startDate" label="Başlanğıc tarixi">
              <DatePicker className="w-100" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="endDate" label="Son tarix">
              <DatePicker className="w-100" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="workStatusId" label="Status">
              <Select
                className="w-100"
                allowClear
                onChange={(e) => handleKeyChange(e, "workStatusId")}
              >
                {options.workStatuses.map((f, index) => {
                  return (
                    <Option key={index} value={f.id}>
                      {f.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="todoId" label="İş">
              <Select
                className="w-100"
                allowClear
                onChange={(e) => handleKeyChange(e, "todoId")}
              >
                {options.todos.map((f, index) => {
                  return (
                    <Option key={index} value={f.id}>
                      {f.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="parcelCategoryId" label="Sahə kateqoriyası">
              <Select
                className="w-100"
                onChange={(e) => handleKeyChange(e, "parcelCategoryId")}
                onClear={(e) => handleKeyChange(e, "parcelCategoryId")}
                allowClear
              >
                <Option key={0} value={0}>
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
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="parcelId" label="Sahə">
              <Select
                disabled={!filters.parcelCategoryId}
                className="w-100"
                onChange={(e) => handleKeyChange(e, "parcelId")}
                allowClear
              >
                <Option key={0} value={0}>
                  Bütün sahələr
                </Option>
                {options.parcels
                  .filter(
                    (p) => p.parcelCategoryId === filters.parcelCategoryId
                  )
                  .map((pc, index) => {
                    return (
                      <Option key={index} value={pc.id}>
                        {pc.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={<span style={{ opacity: 0 }}>.</span>}>
              <Tooltip
                className="mr-5"
                placement="rightTop"
                title="Ethiyatlar filterini təmizlə"
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() => clearFilter()}
                >
                  <ClearOutlined />
                </Button>
              </Tooltip>
              <Button htmlType="submit" size="large" type="primary">
                Axtar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={16}>
        <Col span={4}>
          <Button type="primary">{st.tasks} ədəd ümumi tapşırıq</Button>
        </Col>
        <Col span={4}>
          <Button type="primary">{st.done} ədəd bitmiş tapşırıq</Button>
        </Col>
        <Col span={4}>
          <Button type="primary">{st.percent} % tamamlanıb</Button>
        </Col>
      </Row>
      <Row>
        <Table
          size="small"
          className="bg-white w-100"
          columns={fullModalColumns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            total,
            current_page: 1,
          }}
          onChange={changePage}
        />
      </Row>

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
          title="Hesabat"
          centered
          className="addTaskModal padModal"
          visible={visibleReportEnd}
          onOk={() => setVisibleReportEnd(false)}
          onCancel={() => setVisibleReportEnd(false)}
          footer={[]}
      >
        <ViewEndReport
          id={ReportEndId}
          visibleReportEnd={visibleReportEnd}
          setVisibleReportEnd={setVisibleReportEnd}
        />
      </Modal>



    </>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions })(Todos);
