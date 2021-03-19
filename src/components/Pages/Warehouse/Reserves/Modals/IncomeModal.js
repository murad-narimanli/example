import React, { useEffect } from "react";
import {
  Button,
  Col,
  InputNumber,
  Row,
  Select,
  Form,
  Modal,
} from "antd";
import agros from "../../../../../const/api";
import { connect } from "react-redux";
import {getOptions, notify} from "../../../../../redux/actions";
import { useTranslation } from "react-i18next";
import {noWhitespace} from "../../../../../utils/rules";

const { Option } = Select;

const IncomeModal = (props) => {
  const [form] = Form.useForm();
  const {notify} = props;
  const { t, i18n } = useTranslation();

  const { getOptions } = props;
  const options = props.options[props.lang];

  useEffect(() => {
    getOptions(["warehouses", "reserves"], props.options, i18n.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const hideModal = () => {
    form.resetFields();
    props.setVisibleIncomeModal(false);
  };

  const addReserve = (values) => {
    agros
      .post(`reserveStock/${props.isincome ? "import" : "export"}`, {
        ...values,
      })
      .then(() => {
        notify("", true);
        props.triggerFetch();
        hideModal();
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  return (
    <Modal
      title={props.isincome ? t("import") : t("export")}
      centered
      className="padModal"
      onCancel={hideModal}
      visible={props.visibleIncomeModal}
      footer={false}
    >
      <Form onFinish={addReserve} layout="vertical" form={form}>
        <div className="commontask">
          <Row gutter={[16, 16]}>
            <Col sm={12} xs={24}>
              <Form.Item
                label={t("warehouse")}
                name="WarehouseId"
                validateTrigger="onChange"
                rules={[noWhitespace(t("warehouseMustSelect"))]}
              >
                <Select>
                  {options.warehouses.map((w, index) => {
                    return (
                      <Option key={index} value={w.id}>
                        {w.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <Form.Item
                label={t("product")}
                name="ProductId"
                validateTrigger="onChange"
                rules={[noWhitespace(t("productMustSelect"))]}
              >
                <Select>
                  {options.reserves.map((w, index) => {
                    return (
                      <Option key={index} value={w.id}>
                        {w.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label={t("quantityOf")}
                name="Quantity"
                validateTrigger="onChange"
                rules={[noWhitespace(t("inputError"))]}
              >
                <InputNumber className="w-100" />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div
          className="modalButtons"
          style={{ position: "absolute", bottom: "20px", right: "25px" }}
        >
          <Button onClick={hideModal}>{t("cancel")}</Button>
          <Button type="primary" className="ml-10" htmlType="submit">
            {t("save")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions , notify })(IncomeModal);
