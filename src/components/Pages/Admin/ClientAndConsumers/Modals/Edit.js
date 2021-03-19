import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Input,
  Row,
  DatePicker,
  Col,
  Form,
  Select,
  Button,
  Upload,
} from "antd";
import agros from "../../../../../const/api";
import { getOptions, notify } from "../../../../../redux/actions";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { noWhitespace, whiteSpace } from "../../../../../utils/rules";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;

const Edit = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const { notify } = props;
  const [fetchConsumer, setFetchConsumer] = useState(false);
  const [cities] = useState([{ id: 1, name: "Baku" }]);

  const [file, setFile] = useState(null);

  const { getOptions } = props;
  const options = props.options[props.lang];

  useEffect(() => {
    const getData = () => {
      agros.get(`customer/${props.consumer.id}`).then((res) => {
        const r = res.data;
        form.setFieldsValue({
          ...r,
          agreementDate: moment(r.agreementDate),
          positionStatus: r.positionStatus.toString(),
        });
        countryChange(r.countryId);
        setFetchConsumer(true);
      });
    };

    getOptions(
      ["deliveryTerms", "countries", "paymentTerms", "paymentKinds"],
      props.options,
      i18n.language
    );

    if (props.consumer && !fetchConsumer) {
      getData();
    }
    if (!props.consumer) {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.consumer, t]);

  const countryChange = (id) => {
    agros.get("data/city/" + id).then((res) => {
      // const cities = res.data;
      // setCities(cities);
    });
  };

  const saveItem = (values) => {
    agros
      .post("customer", { ...values, file })
      .then((res) => {
        notify(t("clientIsAdded"), true);
        props.setVisibleEditConsumer(false);
        props.triggerFetch();
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const props2 = {
    name: "file",
    multiple: false,
  };

  const setUploadFile = ({ onSuccess, onError, file }) => {
    let form_data = new FormData();
    const filename = Math.random(1, 999999) + Date.now() + file.name;
    form_data.append("contract", file, filename);
    agros
      .post("customer/contract", form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        setFile(res.data);
        onSuccess(null, file);
      })
      .catch((err) => onError());
  };

  return (
    <>
      <Form
        form={form}
        onFinish={saveItem}
        layout="vertical"
        className="form-upload"
      >
        <div className="commontask">
          <Row gutter={[16, 8]}>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("name")}
                validateTrigger="onChange"
                name="name"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("officalName")}
                validateTrigger="onChange"
                name="legalName"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("industry")}
                validateTrigger="onChange"
                name="industry"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("relatedPerson")}
                validateTrigger="onChange"
                name="contactPerson"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("email")}
                validateTrigger="onChange"
                name="email"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("contactNumber")}
                validateTrigger="onChange"
                name="phone"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("country")}
                validateTrigger="onChange"
                name="countryId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select onChange={countryChange}>
                  {options.countries.map((c, index) => {
                    return (
                      <Option key={index} value={c.id}>
                        {c.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("city")}
                validateTrigger="onChange"
                name="cityId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select>
                  {cities.map((c, index) => {
                    return (
                      <Option key={index} value={c.id}>
                        {c.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <Form.Item
                label={t("adress")}
                validateTrigger="onChange"
                name="address"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("agreementDocumentNumber")}
                validateTrigger="onChange"
                name="agreementNumber"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("agreementDocumentDate")}
                name="agreementDate"
                validateTrigger="onChange"
                rules={[noWhitespace(t("inputError"))]}
              >
                <DatePicker placeholder={t("selectDate")} className="w-100" />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("paymentTerm")}
                validateTrigger="onChange"
                name="paymentTermId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select>
                  {options.paymentTerms.map((pt, index) => {
                    return (
                      <Option key={index} value={pt.id}>
                        {pt.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("paymentType")}
                validateTrigger="onChange"
                name="paymentKindId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select>
                  {options.paymentKinds.map((pt, index) => {
                    return (
                      <Option key={index} value={pt.id}>
                        {pt.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("paymentTime")}
                validateTrigger="onChange"
                name="paymentPeriod"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("advancePaymentCondition")}
                validateTrigger="onChange"
                name="advancePaymentTermId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select>
                  {options.paymentTerms.map((pt, index) => {
                    return (
                      <Option key={index} value={pt.id}>
                        {pt.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("deliveryTern")}
                validateTrigger="onChange"
                name="deliveryTermId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select>
                  {options.deliveryTerms.map((t, index) => {
                    return (
                      <Option key={index} value={t.id}>
                        {t.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("deliveryDate")}
                validateTrigger="onChange"
                name="deliveryPeriod"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label="Status"
                validateTrigger="onChange"
                name="PositionStatus"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select>
                  <Option value="1">{t("consumer")}</Option>
                  <Option value="2">{t("client")}</Option>
                </Select>
              </Form.Item>
            </Col>
            {!props.consumer ? (
              <Col md={6} sm={12} xs={24}>
                <Upload
                  {...props2}
                  customRequest={setUploadFile}
                  beforeUpload={false}
                >
                  {!file ? (
                    <Button
                      style={{ position: "absolute", bottom: "5px" }}
                      icon={<UploadOutlined />}
                    >
                      Müqavilə yüklə
                    </Button>
                  ) : null}
                </Upload>
              </Col>
            ) : null}
          </Row>
        </div>
        <div
          className="modalButtons"
          style={{ position: "absolute", bottom: "20px", right: "40px" }}
        >
          <Button onClick={() => props.setVisibleEditConsumer(false)}>
            {t("cancel")}
          </Button>
          <Button type="primary" className="ml-10" htmlType="submit">
            {t("save")}
          </Button>
        </div>
      </Form>
    </>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(Edit);
