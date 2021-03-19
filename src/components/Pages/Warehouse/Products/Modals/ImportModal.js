import React, { useState, useEffect } from "react";
import { Button, Col, Input, Row, Select, Form, InputNumber } from "antd";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import agros from "../../../../../const/api";
import { useTranslation } from "react-i18next";
import { whiteSpace, noWhitespace } from "../../../../../utils/rules";

const { Option } = Select;

const ImportModal = (props) => {
  const { notify } = props;
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();

  const [vals, setVals] = useState({});
  const [workers, setWorkers] = useState([]);
  const [unit, setUnit] = useState(null);

  const { getOptions } = props;
  const options = props.options[props.lang];

  const setValues = (e, key) => {
    const all = { ...vals };
    all[key] = e;
    setVals(all);
    if (key === "cropCategoryId") {
      form.setFieldsValue({ cropId: undefined, productId: undefined });
    }
  };

  useEffect(() => {
    getOptions(
      [
        "cropCategories",
        "cropSorts",
        "crops",
        "reproductions",
        "parcelCategories",
        "parcels",
        "warehouses",
        "positions",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const saveImport = (values) => {
    agros
      .post("cropstock/insert", {
        ...values,
        handingPerson: workers[values.workerIndex].name,
      })
      .then((res) => {
        notify(t("productIsAdded"), true);
        form.resetFields();
        props.triggerFetch();
        props.setVisibleImport(false);
      });
  };

  const hideModal = () => {
    form.resetFields();
    props.triggerFetch();
    props.setVisibleImport(false);
  };

  const fetchWorkers = (e) => {
    agros.get(`data/workers/${e}`).then((res) => {
      setWorkers(res.data);
    });
  };

  const setMeasurementUnit = (e) => {
    setUnit(options.cropSorts.find((c) => c.id === e).measurementUnit);
  };

  return (
    <Form onFinish={saveImport} layout="vertical" form={form}>
      <div className="commontask">
        <Row gutter={[16, 0]}>
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
              label={t("category")}
              name="cropCategoryId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select onChange={(e) => setValues(e, "cropCategoryId")}>
                {options.cropCategories.map((c, index) => {
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
              label={t("product")}
              name="cropId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select onChange={(e) => setValues(e, "cropId")}>
                {options.crops
                  .filter((c) => c.categoryId === vals.cropCategoryId)
                  .map((c, index) => {
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
              label="Sort"
              name="productId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select
                onChange={(e) => {
                  setMeasurementUnit(e);
                }}
              >
                {options.cropSorts
                  .filter((c) => c.categoryId === vals.cropId)
                  .map((c, index) => {
                    return (
                      <Option key={index} value={c.id}>
                        {c.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>

          {vals.cropCategoryId === 1 && (
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("reproduction")}
                name="reproductionId"
                validateTrigger="onChange"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select>
                  {options.reproductions.map((c, index) => {
                    return (
                      <Option key={index} value={c.id}>
                        {c.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("areaType")}
              name="parcelCategoryId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select onChange={(e) => setValues(e, "parcelCategoryId")}>
                {options.parcelCategories.map((c, index) => {
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
              label={t("area")}
              name="parcelId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.parcels
                  .filter((c) => c.parcelCategoryId === vals.parcelCategoryId)
                  .map((c, index) => {
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
              label={t("warehouse")}
              name="warehouseId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.warehouses.map((c, index) => {
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
            <div className="form-lang">
              <Form.Item
                label={t("quantity")}
                name="quantity"
                validateTrigger="onChange"
                rules={[noWhitespace(t("inputError"))]}
              >
                <InputNumber className="w-100" />
              </Form.Item>
              <span className="input-lang btm">{unit}</span>
            </div>
          </Col>
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label="Vəzifə"
              name="professionId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select onChange={(e) => fetchWorkers(e)}>
                {options.positions.map((c, index) => {
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
              label={t("handingOver")}
              name="workerIndex"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {workers.map((c, windex) => {
                  return (
                    <Option key={windex} value={windex}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          {/* <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("handingOver")}
              name="handingPerson"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}

            >
              <Input />
            </Form.Item>
          </Col> */}
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label={t("carNumber")}
              name="handingCarNumber"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <div
          className="modalButtons"
          style={{ position: "absolute", bottom: "20px", right: "25px" }}
        >
          <Button onClick={hideModal}>{t("cancel")}</Button>
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
