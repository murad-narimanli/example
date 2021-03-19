import React, { useState, useEffect } from "react";
import "@ant-design/compatible/assets/index.css";
import { Button, Form, Col, Input, Row, Select, InputNumber } from "antd";
// import { green } from "@ant-design/colors";
import agros from "../../../../../const/api";
import { useTranslation } from "react-i18next";
import Authorize from "../../../../Elements/Authorize";
import { noWhitespace, whiteSpace } from "../../../../../utils/rules";
const { Option } = Select;

const MedicinesForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [fertilizerKinds, setFertilizerKinds] = useState([]);
  const [fertKindId , setFertKindId] = useState(null)
  const [ingredients, setIngredients] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const getMeasurementUnits = async () => {
      await agros.get("data/measurementunits").then((res) => {
        setMeasurementUnits(res.data);
        setFetched(true);
      });
    };
    const getMainIngredients = async () => {
      await agros.get("data/mainingredients").then((res) => {
        setIngredients(res.data);
      });
    };
    const getFertilizerKinds = async () => {
      await agros.get("data/fertilizerkinds").then((res) => {
        setFertilizerKinds(res.data);
      });
    };
    if (!fetched) {
      getMeasurementUnits();
      getMainIngredients();
      getFertilizerKinds();
    }
    if (props.editing) {
      let obj = { ...props.editing };
      form.setFieldsValue(obj);
    } else {
      form.setFieldsValue({
        name: undefined,
        quantityPerHundred: null,
        mainIngredientId: undefined,
        categoryId: undefined,
        measurementUnitId: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editing, fetched, t]);

  const saveItem = (values) => {
    let obj = {
      ...values,
    };
    if (props.editing) {
      obj["id"] = props.editing.id;
    }
    props.saveItem(obj).then((res) => {
      form.resetFields();
    });
  };

  const resetForm = (name) =>{
    form.resetFields();
    props.cancelEdit(name)
  }

  return (
    <Form form={form} onFinish={saveItem} layout="vertical">
      <Row gutter={[16, 8]}>
        <Col xs={24}>
          <Form.Item
            className="mb-5"
            validateTrigger="onChange"
            name="name"
            label={<span>{t("productName")}</span>}
            rules={[whiteSpace(t("inputError"))]}
          >
            <Input size={'large'} />
          </Form.Item>
        </Col>

        <Col md={12} xs={24}>
          <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="fertilizerKindId"
              rules={[noWhitespace(t("typeMustBeSelected"))]}
          >
            <Select
                onChange={(e)=> setFertKindId(e)}
                showSearch
                notFoundContent={null}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
                placeholder={<span className="ml-5">{t("type")}</span>}>
                {fertilizerKinds.map((c, index) => {
                  return (
                      <Option key={index} value={c.id}>
                        {c.name}
                      </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Col>

        <Col md={12} xs={24}>
          <Form.Item
            className="mb-5"
            validateTrigger="onChange"
            name="mainIngredientId"
            rules={[noWhitespace(t("itemMustSelectError"))]}
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
              placeholder={<span className="ml-5">{t("activeSubstance")}</span>}
              className="pl-5"
            >
              {ingredients.filter((f)=>f.categoryId === fertKindId).map((i, index) => {
                return (
                  <Option key={index} value={i.id}>
                    {i.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>

        <Col md={12} xs={24}>
          <Form.Item
            className="mb-5"
            validateTrigger="onChange"
            name="measurementUnitId"
            rules={[noWhitespace(t("measurementUnitMustSelectError"))]}
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
              placeholder={<span className="ml-5">{t("measurementUnit")}</span>}
            >
              {measurementUnits.map((m, index) => {
                return (
                  <Option key={index} value={m.id}>
                    {m.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            className="mb-5"
            validateTrigger="onChange"
            name="quantityPerHundred"
            rules={[noWhitespace(t("inputError"))]}
          >
            <InputNumber placeholder={t("hundredliterRatio")} />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            className="mb-5"
            required
            validateTrigger="onChange"
            name="minQuantity"
            rules={[noWhitespace(t("inputError"))]}
          >
            <InputNumber placeholder="Minimum miqdar" />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            className="mb-5"
            required
            validateTrigger="onChange"
            name="maxQuantity"
            rules={[noWhitespace(t("inputError"))]}
          >
            <InputNumber placeholder="Maksimum miqdar" />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex  flex-between mt-15">
        <Button onClick={() => resetForm(props.name)}>
          {t("cancel")}
        </Button>
        <Form.Item>
          <Authorize
            mainMenu={"administrator"}
            page={["warehouseSettings", "subs", "drugandFertilizers", "perms"]}
            type={"create"}
          >
            <Button htmlType="submit" type="primary">{t("save")}</Button>
          </Authorize>
        </Form.Item>
      </div>
    </Form>
  );
};

export default MedicinesForm;
