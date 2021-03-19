import React, { useEffect, useState } from "react";
import "@ant-design/compatible/assets/index.css";
import {
  Col,
  Row,
  Button,
  DatePicker,
  Table,
  InputNumber,
  Form,
  notification,
} from "antd";
import Authorize from "../../../../Elements/Authorize";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../../utils/columnconverter";
import agros from "../../../../../const/api";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import moment from "moment";

const SalaryHistory = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "totalSalary", value: t("totalSalary"), con: true },
    { key: "netSalary", value: t("salary"), con: true },
    { key: "startDate", value: t("startDate"), con: true },
    { key: "endDate", value: t("endDate"), con: true },
    { key: "id", value: "", con: false },
  ];

  const [salaryData, setSalaryData] = useState([]);
  const userIndex = props.salaryHistory;

  const saveSalary = async (values) => {
    await agros
      .post("hr/salary", { ...values, WorkerId: userIndex })
      .then((res) => {
        notification.info({
          message: t("successMessage"),
          description: t("areaIsAdded"),
          icon: <SmileOutlined />,
        });
        form.resetFields();
        props.setVisibleEditSalaryHistroy(false);
      })
      .catch((err) => {
        notification.info({
          message: t("errMessage"),
          description: err.response.data,
          icon: <FrownOutlined />,
        });
      });
  };

  useEffect(() => {
    agros.get(`hr/salaryhistory/${userIndex}`).then((res) => {
      setSalaryData(
        res.data.map((r, index) => {
          return {
            ...r,
            key: index + 1,
            index,
            tableIndex: index + 1,
            endDate: moment(r.endDate).format("DD MM YYYY"),
            startDate: moment(r.startDate).format("DD MM YYYY"),
          };
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.trigger, t]);

  const salaryColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "1",
      width: 60,
    },
    {
      title: t("totalSalary"),
      dataIndex: "grossSalary",
      key: "2",
    },
    {
      title: t("salary"),
      dataIndex: "netSalary",
      key: "3",
    },
    {
      title: t("startDate"),
      dataIndex: "startDate",
      key: "4",
    },
    {
      title: t("endDate"),
      dataIndex: "endDate",
      key: "5",
    },
  ];

  return (
    <div className="form">
      <Form onFinish={saveSalary} layout="vertical" form={form}>
        <Row gutter={[16, 16]}>
          <Authorize
              mainMenu={'hr'}
              page={['workers','perms']}
              type={'createSalaryHistory'}
          >
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("totalSalary")}
              name="commonSalary"
              validateTrigger="onChange"
              rules={[
                {
                  required: true,
                  message: t("inputError"),
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("salary")}
              name="salary"
              validateTrigger="onChange"
              rules={[
                {
                  required: true,
                  message: t("inputError"),
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("startDate")}
              name="startDate"
              validateTrigger="onChange"
              rules={[
                {
                  required: true,
                  message: t("inputError"),
                },
              ]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>

          <Col className="h-100" md={6} sm={12} xs={24}>
            <label style={{ opacity: 0, marginTop: "7px", display: "block" }}>
              .
            </label>
            <Button
              htmlType="submit"
              className="flex all-center w-100 p-2"
              type="primary"
            >
              {t("save")}
            </Button>
          </Col>
          </Authorize>
          <Col xs={24}>
            <p className="p-1 border-top">{t("history")}</p>
            <div>
              <Table
                size="small"
                className="bg-white"
                columns={salaryColumns}
                dataSource={convertColumns(salaryData, cols)}
                pagination={{
                  pageSize: 5,
                  current_page: 1,
                }}
              />
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SalaryHistory;
