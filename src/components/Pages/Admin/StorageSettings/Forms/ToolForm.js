import React, { useEffect } from "react";
import { Button, Form, Col, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import {whiteSpace} from "../../../../../utils/rules";

const ToolForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.editing) {
      let names = props.editing.contentForLang;
      let obj = {};
      names.forEach((name) => {
        obj[`name_${name.languagename}`] = name.content;
      });
      form.setFieldsValue(obj);
    } else {
      form.setFieldsValue({
        name_az: "",
        name_en: "",
        name_ru: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editing, t]);

  const saveItem = (values) => {
    let langs = ["az", "en", "ru"];
    let obj = {
      cropId: values.cropId,
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
              <Input placeholder={t("tool")} />
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
              <Input placeholder={t("tool")} />
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
              <Input placeholder={t("tool")} />
            </Form.Item>
            <div className="input-lang">ru</div>
          </div>
        </Col>
      </Row>

      <div className="flex  flex-between mt-15">
        <Button onClick={() => props.cancelEdit(props.name)}>
          {t("cancel")}
        </Button>
        <Form.Item>
          <Button htmlType="submit" type="primary">{t("save")}</Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default ToolForm;