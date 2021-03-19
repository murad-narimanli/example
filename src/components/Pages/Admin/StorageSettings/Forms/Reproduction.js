import React, { useEffect } from "react";
import { Button, Form, Col, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import {whiteSpace} from "../../../../../utils/rules";
import Authorize from "../../../../Elements/Authorize";
const ReproductionForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.editing) {
      form.setFieldsValue({ name: props.editing.name });
    } else {
      form.setFieldsValue({
        name: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editing, t]);

  const saveItem = (values) => {
    let obj = {
      name: values.name,
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
              name="name"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input placeholder={t("reproduction")} />
            </Form.Item>
          </div>
        </Col>
      </Row>
      <div className="flex  flex-between mt-15">
        <Button onClick={() => props.cancelEdit(props.name)}>
          {t("cancel")}
        </Button>
        <Form.Item>
          <Authorize
              mainMenu={'administrator'}
              page={['warehouseSettings', 'subs', 'reproductions','perms']}
              type={'create'}
          >
            <Button htmlType="submit" type="primary">{t("save")}</Button>
          </Authorize>
        </Form.Item>
      </div>
    </Form>
  );
};

export default ReproductionForm;
