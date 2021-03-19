import React, { useEffect, useState } from "react";
import "@ant-design/compatible/assets/index.css";
import { Button, Col, Form, Input, Row, Select } from "antd";
// import { green } from "@ant-design/colors";
import agros from "../../../../../const/api";
import { useTranslation } from "react-i18next";
import Authorize from "../../../../Elements/Authorize";
import {noWhitespace, whiteSpace} from "../../../../../utils/rules";
const { Option } = Select;

function PlantProductsForm(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      await agros.get("data/cropcategories").then((res) => {
        setCategories(res.data);
        setFetched(true);
      });
    };
    if (!fetched) {
      getCategories();
    }
    if (props.editing) {
      let names = props.editing.content;
      let obj = {};
      names.forEach((name) => {
        obj[`name_${name.languagename}`] = name.content;
      });
      obj.categoryId = props.editing.categoryId;
      form.setFieldsValue(obj);
    } else {
      form.setFieldsValue({
        name_az: "",
        name_en: "",
        name_ru: "",
        categoryId: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editing, fetched, t]);

  const saveItem = (values) => {
    let langs = ["az", "en", "ru"];
    let obj = {
      categoryId: values.categoryId,
      content: langs.map((lang, index) => {
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

  return (
    <Form onFinish={saveItem} form={form} layout="vertical">
      <Row gutter={[8, 0]}>
        <Col md={24} xs={24}>
          <div className="form-lang">
            <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="name_az"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input placeholder={t("productName")} />
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
              <Input placeholder={t("productName")} />
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
              <Input placeholder={t("productName")} />
            </Form.Item>
            <div className="input-lang">ru</div>
          </div>
        </Col>
        <Col md={24} xs={24}>
          <Form.Item
            className="mb-5"
            required
            validateTrigger="onChange"
            name="categoryId"
            rules={[noWhitespace(t("typeMustBeSelected"))]}
          >
            <Select placeholder={<span className="ml-5">{t("typeOf")}</span>}>
              {categories.map((c, index) => {
                return (
                  <Option key={index} value={c.id}>
                    {c.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <div className="flex  flex-between mt-15">
        <Button onClick={() => props.cancelEdit(props.name)}>
          {t("cancel")}
        </Button>
        <Form.Item>
          <Authorize
              mainMenu={'administrator'}
              page={['warehouseSettings', 'subs', 'plantProducts','perms']}
              type={'create'}
          >
            <Button htmlType="submit" type="primary">{t("save")}</Button>
          </Authorize>
        </Form.Item>
      </div>
    </Form>
  );
}

export default PlantProductsForm;
