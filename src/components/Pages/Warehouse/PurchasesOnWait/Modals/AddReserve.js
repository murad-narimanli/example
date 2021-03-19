import React, { useEffect, useState } from "react";
import "@ant-design/compatible/assets/index.css";
import {
  Button,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Row,
  Select,
  Form,
} from "antd";
import agros from "../../../../../const/api";
import { useTranslation } from "react-i18next";
import { noWhitespace } from "../../../../../utils/rules";
import { connect } from "react-redux";
import { notify } from "../../../../../redux/actions";

const { Option } = Select;

const AddReserve = (props) => {
  const { notify } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [reserves, setReserves] = useState([{}]);
  const [warehouses, setWarehouses] = useState([]);
  const addNewReserve = () => {
    const all = [...reserves];
    all.push({});
    setReserves(all);
  };

  const removeReserve = (index) => {
    const all = [...reserves];
    all.splice(index, 1);
    setReserves(all);
  };

  useEffect(() => {
    setReserves([{}]);
    form.resetFields();
    const getWarehouses = async () => {
      await agros.get("warehouse").then((res) => {
        setWarehouses(res.data);
      });
    };
    if (!warehouses.length) {
      getWarehouses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reserve.id, t]);

  const saveItem = (e) => {
    e.preventDefault();
    form.validateFields().then((values) => {
      let obj = {
        waitingStockId: props.reserve.id,
        ...values,
      };
      agros
        .post("medicalstock/import", obj)
        .then((res) => {
          notify(t("newDocumentCreated"), true);
          hideModal();
        })
        .catch((err) => {
          notify(err.response, false);
        });
    });
  };

  const hideModal = () => {
    form.resetFields();
    props.triggerFetch();
    props.setVisibleViewReserves(false);
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("productName")}:</td>
                <td>{props.reserve.productName}</td>
              </tr>
              <tr>
                <td>{t("quantityOf")}</td>
                <td>{props.reserve.quantity}</td>
              </tr>
              <tr>
                <td>{t("consumer")}</td>
                <td>{props.reserve.supplierName}</td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col lg={12} xs={24}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("productType")}:</td>
                <td>{props.reserve.fertilizerKind}</td>
              </tr>
              <tr>
                <td>{t("activeSubstance")}:</td>
                <td>{props.reserve.mainIngredient}</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      {reserves.map((r, index) => {
        return (
          <div key={index} className="border mt-20 p-2">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <div className="w-100  flex-align-center flex flex-between">
                  <h3>
                    {t("reserv")} {index + 1}
                  </h3>
                  <div className="flex">
                    {reserves.length > 1 && (
                      <Button
                        className="mr5-5 btn-danger"
                        onClick={() => removeReserve(index)}
                      >
                        {t("delete")}
                      </Button>
                    )}
                    <Button type="primary" onClick={addNewReserve}>
                      {t("addTo")}
                    </Button>
                  </div>
                </div>
              </Col>
              <Col md={6} sm={12} xs={24}>
                <Form.Item
                  label={t("barCode")}
                  name={["countByBarcode", index, "barcode"]}
                  validateTrigger="onChange"
                  // rules={[whiteSpace(t("barcodeMustAdd"))]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col md={6} sm={12} xs={24}>
                <Form.Item
                  label={t("warehouse")}
                  name={["countByBarcode", index, "warehouseId"]}
                  validateTrigger="onChange"
                  rules={[noWhitespace(t("warehouseMustSelect"))]}
                >
                  <Select>
                    {warehouses.map((w, index) => {
                      return (
                        <Option key={index} value={w.id}>
                          {w.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={6} sm={12} xs={24}>
                <Form.Item
                  label={t("expirationDate")}
                  name={["countByBarcode", index, "expireDate"]}
                  validateTrigger="onChange"
                  rules={[noWhitespace(t("dateError"))]}
                >
                  <DatePicker placeholder={t("selectDate")} className="w-100" />
                </Form.Item>
              </Col>

              <Col md={6} sm={12} xs={24}>
                <Form.Item
                  label={t("quantity")}
                  name={["countByBarcode", index, "quantity"]}
                  validateTrigger="onChange"
                  rules={[noWhitespace(t("quantityMustAdd"))]}
                >
                  <InputNumber className="w-100" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      })}

      <div
        className="modalButtons"
        style={{ position: "absolute", bottom: "20px", right: "40px" }}
      >
        <Button onClick={hideModal}>{t("cancel")}</Button>
        <Button
          type="primary"
          className="ml-10"
          htmlType="submit"
          onClick={saveItem}
        >
          {t("save")}
        </Button>
      </div>
    </Form>
  );
};

export default connect(null, { notify })(AddReserve);
