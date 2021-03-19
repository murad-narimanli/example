import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row, Select, InputNumber } from "antd";
import agros from "../../../../../const/api";
import { useTranslation } from "react-i18next";
import Authorize from "../../../../Elements/Authorize";
import {noWhitespace, whiteSpace} from "../../../../../utils/rules";
const { Option } = Select;

function ReservesForm(props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const getMeasurementUnits = async () => {
      await agros.get("data/measurementunits").then((res) => {
        setMeasurementUnits(res.data);
        setFetched(true);
      });
    };
    if (!fetched) {
      getMeasurementUnits();
    }
    if (props.editing) {
      let names = props.editing.contentForLang;
      let obj = {};
      names.forEach((name) => {
        obj[`name_${name.languagename}`] = name.content;
      });
      obj.measurementUnitId = props.editing.measurementUnitId;
      obj.minQuantity = props.editing.minQuantity;
      obj.maxQuantity = props.editing.maxQuantity;
      form.setFieldsValue(obj);
    } else {
      form.setFieldsValue({
        name_az: "",
        name_en: "",
        name_ru: "",
        measurementUnitId: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editing, fetched, t]);

  const saveItem = (values) => {
    let langs = ["az", "en", "ru"];
    let obj = {
      measurementUnitId: values.measurementUnitId,
      maxQuantity: values.maxQuantity,
      minQuantity: values.minQuantity,
      contentForLang: langs.map((lang, index) => {
        return { languagename: lang, content: values[`name_${lang}`] };
      }),
    };
    if (props.editing) {
      obj["id"] = props.editing.id;
    }
    props.saveItem(obj).then((res) => {
      form.resetFields();
    });
  };

  const setFormEmpty = (name) => {
    form.resetFields();
    props.cancelEdit(name);
  }

  return (
    <Form form={form} onFinish={saveItem} layout="vertical">
      <Row gutter={[8, 0]}>
        <Col md={24} xs={24}>
          <div className="form-lang">
            <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="name_az"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input placeholder={t("reservName")} />
            </Form.Item>
            <div className="input-lang">az</div>
          </div>
        </Col>
        <Col md={24} xs={24}>
          <div className="form-lang">
            <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="name_en"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input placeholder={t("reservName")} />
            </Form.Item>
            <div className="input-lang">en</div>
          </div>
        </Col>
        <Col md={24} xs={24}>
          <div className="form-lang">
            <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="name_ru"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input placeholder={t("reservName")} />
            </Form.Item>
            <div className="input-lang">ru</div>
          </div>
        </Col>

        <Col md={24} xs={24}>
          <Form.Item
            className="mb-5"
            validateTrigger="onChange"
            required
            name="measurementUnitId"
            rules={[noWhitespace(t("measurementUnitMustSelectError"))]}
          >
            <Select
              placeholder={<span className="ml-5">{t("measurementUnit")}</span>}
            >
              {measurementUnits.map((c, index) => {
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
        <Button onClick={() => setFormEmpty(props.name)}>
          {t("cancel")}
        </Button>
        <Form.Item>
          <Authorize
              mainMenu={'administrator'}
              page={['warehouseSettings', 'subs', 'reserves','perms']}
              type={'create'}
          >
            <Button htmlType="submit" type="primary">{t("save")}</Button>
          </Authorize>
        </Form.Item>
      </div>
    </Form>
  );
}

export default ReservesForm;
