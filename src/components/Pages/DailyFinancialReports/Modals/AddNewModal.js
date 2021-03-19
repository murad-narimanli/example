import React, { useEffect } from "react";
import {
  Button,
  Form,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
} from "antd";
import { useTranslation } from "react-i18next";
import { noWhitespace, whiteSpace } from "../../../../utils/rules";
import { getOptions, notify } from "../../../../redux/actions";
import { connect } from "react-redux";
import agros from "../../../../const/api";

const { Option } = Select;

const AddNewModal = (props) => {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();

  const { getOptions, notify } = props;
  const options = props.options[props.lang];

  useEffect(() => {
    getOptions(
      [
        "temporaryOperationKinds",
        "temporaryInAndOutItems",
        "temporaryCustomers",
        "temporaryAccountKinds",
        "temporaryPayAccounts",
        "temporaryParcels",
        "temporarySectors",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const saveItem = (values) => {
    agros
      .post("temporaryexsels", { ...values })
      .then((res) => {
        notify("", true);
        props.triggerFetch();
        props.setVisibleAddNew(false);
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  return (
    <Form layout="vertical" form={form} onFinish={saveItem}>
      <div className="commontask">
        <Row gutter={[16, 16]}>
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("demandedPerson")}
              validateTrigger="onChange"
              name="user"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("documentNumber")}
              validateTrigger="onChange"
              name="documentNo"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("quantity")}
              validateTrigger="onChange"
              name="amount"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("date")}
              validateTrigger="onChange"
              name="date"
              rules={[noWhitespace(t("dateError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("operationType")}
              validateTrigger="onChange"
              name="temporaryOperationKind"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.temporaryOperationKinds.map((t, index) => {
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
              label={t("operationItem")}
              validateTrigger="onChange"
              name="temporaryInAndOutItems"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.temporaryInAndOutItems.map((t, index) => {
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
              label={t("client")}
              validateTrigger="onChange"
              name="temporaryCustomer"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.temporaryCustomers.map((t, index) => {
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
              label={t("paymentType")}
              validateTrigger="onChange"
              name="temporaryAccountKind"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.temporaryAccountKinds.map((t, index) => {
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
              label={t("accountTypes")}
              validateTrigger="onChange"
              name="temporaryPayAccount"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.temporaryPayAccounts.map((t, index) => {
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
              label={t("areaName")}
              validateTrigger="onChange"
              name="temporaryParcel"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.temporaryParcels.map((t, index) => {
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
              label={t("sectorName")}
              validateTrigger="onChange"
              name="temporarySector"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.temporarySectors.map((t, index) => {
                  return (
                    <Option key={index} value={t.id}>
                      {t.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
      <div
        className="modalButtons"
        style={{ position: "absolute", bottom: "20px", right: "40px" }}
      >
        <Button onClick={() => props.setVisibleAddNew(false)}>
          {t("cancel")}
        </Button>
        <Button type="primary" className="ml-10" htmlType="submit">
          {t("save")}
        </Button>
      </div>
    </Form>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(AddNewModal);
