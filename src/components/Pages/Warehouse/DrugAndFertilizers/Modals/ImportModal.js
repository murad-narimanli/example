import React, { useEffect, useState } from "react";
import "@ant-design/compatible/assets/index.css";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Form,
  InputNumber,
} from "antd";
import agros from "../../../../../const/api";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { whiteSpace, noWhitespace } from "../../../../../utils/rules";

const { Option } = Select;

const ImportModal = (props) => {
  const { t, i18n } = useTranslation();
  const { notify } = props;
  const [form] = Form.useForm();
  const [vals, setVals] = useState({});

  const { getOptions } = props;
  const [measurementUnit, setMeasurementUnit] = useState(null);
  const options = props.options[props.lang];

  const handleKeyChange = (e, key) => {
    const all = { ...vals };
    all[key] = e;
    setVals(all);
  };

  useEffect(() => {
    getOptions(
      [
        "fertilizerKinds",
        "mainIngredients",
        "warehouses",
        "parcelCategories",
        "fertilizers",
        "parcels",
        "parcelSectors",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const saveItem = (values) => {
    agros
      .post("medicalstock", { ...values })
      .then((res) => {
        notify(t("importIsAdded"), true);
        form.resetFields();
        props.setVisibleImport(false);
        props.triggerFetch();
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const setMeasurementUnitField = (e) => {
    setMeasurementUnit(
      options.fertilizers.find((f) => f.id === e).measurementUnit
    );
  };

  return (
    <Form onFinish={saveItem} layout="vertical" form={form}>
      <div className="commontask">
        <Row gutter={[16, 16]}>
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("barCode")}
              name="barcode"
              validateTrigger="onChange"
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("typeOf")}
              name="type"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select
                  showSearch
                  notFoundContent={null}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
                  onChange={(e) => handleKeyChange(e, "fertilizerKindId")}>
                {options.fertilizerKinds.map((fk, index) => {
                  return (
                    <Option key={index} value={fk.id}>
                      {fk.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("activeSubstance")}
              name="activeSubstance"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select
                  showSearch
                  notFoundContent={null}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
                  onChange={(e) => handleKeyChange(e, "mainIngredientId")}>
                {options.mainIngredients.filter(
                    (f) =>
                        f.categoryId ===
                        vals.fertilizerKindId
                ).map((fk, index) => {
                  return (
                    <Option key={index} value={fk.id}>
                      {fk.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("productName")}
              name="productId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select
                  showSearch
                  notFoundContent={null}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
                  onChange={(e) => setMeasurementUnitField(e)}>
                {options.fertilizers
                  .filter(
                    (f) =>
                      f.fertilizerKindId === vals.fertilizerKindId &&
                      f.mainIngredientId === vals.mainIngredientId
                  )
                  .map((fk, index) => {
                    return (
                      <Option key={index} value={fk.id}>
                        {fk.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col md={6} sm={12} xs={24}>
            <div className="form-lang">
              <Form.Item
                label={t("quantityOf")}
                name="quantity"
                validateTrigger="onChange"
                rules={[noWhitespace(t("inputError"))]}
              >
                <InputNumber />
              </Form.Item>
              <span className="input-lang btm">{measurementUnit}</span>
            </div>
          </Col>
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("expirationDate")}
              name="expireDate"
              validateTrigger="onChange"
              rules={[noWhitespace(t("dateError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("warehouse")}
              name="warehouseId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select
                  showSearch
                  notFoundContent={null}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
              >
                {options.warehouses.map((fk, index) => {
                  return (
                    <Option key={index} value={fk.id}>
                      {fk.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col md={6} sm={12} xs={24}>
            <div className="form-lang">
              <Form.Item
                label={t("price")}
                name="price"
                validateTrigger="onChange"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
              <span className="input-lang btm">azn</span>
            </div>
          </Col>
        </Row>
        <div
          className="modalButtons"
          style={{ position: "absolute", bottom: "20px", right: "25px" }}
        >
          <Button onClick={() => props.setVisibleImport(false)}>
            {t("cancel")}
          </Button>
          <Button type="primary" className="ml-10" htmlType="submit">
            {t("save")}
          </Button>
        </div>
      </div>
    </Form>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(ImportModal);
