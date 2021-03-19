import React, { useEffect, useState } from "react";
import { Col, Row, Select, Input, Button, DatePicker, Form } from "antd";
import { useTranslation } from "react-i18next";
import { noWhitespace, whiteSpace } from "../../../../../utils/rules";
import { notify } from "../../../../../redux/actions";
import agros from "../../../../../const/api";
import moment from "moment";
import { connect } from "react-redux";
const { Option } = Select;

const Update = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [professions, setProfessions] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const getProfessions = () => {
      agros.get("data/positions").then((res) => {
        setProfessions(res.data);
        setFetched(true);
      });
    };
    form.resetFields();
    if (props.worker) {
      agros.get(`hr/${props.worker}`).then((res) => {
        form.setFieldsValue({
          ...res.data,
          birthday: moment(res.data.birthday),
          gender: res.data.gender.toString(),
          workStartDate: moment(res.data.workStartDate),
          workStatus: res.data.workStatus.toString(),
          professionID: res.data.professionId,
          sSN: res.data.ssn,
        });
      });
    }    
    if (!fetched) {
      getProfessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.worker, t]);

  const saveWorker = (values) => {
    if (!props.worker) {
      agros.post("hr", { ...values }).then((res) => {
        notify(t("workerIsAdded"), true);
        props.setVisibleEditWorker(false);
        props.triggerFetch();
      });
    } else {
      agros
        .put("hr/" + props.worker, { ...values, id: props.worker })
        .then((res) => {
          notify("Düzəliş edildi", true);
          props.setVisibleEditWorker(false);
          props.triggerFetch();
        });
    }
  };

  return (
    <Form onFinish={saveWorker} layout="vertical" form={form}>
      <div className="commontask">
        <Row gutter={[16, 16]}>
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("fullnameLabel")}
              name="name"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("fin")}
              name="fin"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("seriaNo")}
              name="serialNumber"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label="SSN"
              name="sSN"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("birthdate")}
              name="birthday"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("sex")}
              name="gender"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                <Option value="0">{t("man")}</Option>
                <Option value="1">{t("woman")}</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("email")}
              name="email"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("contactNumber")}
              name="phone"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col sm={12} xs={24}>
            <Form.Item
              label={t("adress")}
              name="adress"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col sm={12} xs={24}>
            <Form.Item
              label={t("position")}
              name="professionId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("positionMustSelectError"))]}
            >
              <Select>
                {professions.map((p, index) => {
                  return (
                    <Option key={index} value={p.id}>
                      {p.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("workStartDate")}
              name="workStartDate"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("salaryType")}
              name="workStatus"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                <Option value="1">{t("salaryForWork")}</Option>
                <Option value="2">{t("dailySalary")}</Option>
              </Select>
            </Form.Item>
          </Col>

          {!props.worker ? (
            <>
              <Col md={6} sm={12} xs={24}>
                <Form.Item
                  label={t("totalSalary")}
                  name="grossSalary"
                  validateTrigger="onChange"
                  rules={[whiteSpace(t("inputError"))]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col md={6} sm={12} xs={24}>
                <Form.Item
                  label={t("salary")}
                  name="netSalary"
                  validateTrigger="onChange"
                  rules={[whiteSpace(t("inputError"))]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </>
          ) : null}
        </Row>
      </div>
      <div
        className="modalButtons"
        style={{ position: "absolute", bottom: "20px", right: "40px" }}
      >
        <Button onClick={() => props.setVisibleEditWorker(false)}>
          {t("cancel")}
        </Button>
        <Button type="primary" className="ml-10" htmlType="submit">
          {t("save")}
        </Button>
      </div>
    </Form>
  );
};

export default connect(null, { notify })(Update);
