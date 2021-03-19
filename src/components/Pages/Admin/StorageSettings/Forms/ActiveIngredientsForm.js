import React, { useEffect , useState } from "react";
import "@ant-design/compatible/assets/index.css";
import {Button, Col, Input, Row, Form, Select} from "antd";
import { useTranslation } from "react-i18next";
import {noWhitespace, whiteSpace} from "../../../../../utils/rules";
import Authorize from "../../../../Elements/Authorize";
import agros from "../../../../../const/api";

const { Option } = Select;

function ActiveIngredientsForm(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [fertilizerKinds, setFertilizerKinds] = useState([]);
  // const admin = props.perms.administrator.subs

  useEffect(() => {
    const getFertilizerKinds = async () => {
      await agros.get("data/fertilizerkinds").then((res) => {
        setFertilizerKinds(res.data);
      });
    };
    getFertilizerKinds()
    console.log(props.editing)
    if (props.editing) {
      form.setFieldsValue({ name: props.editing.name , category: props.editing.categoryId});
    } else {
      form.setFieldsValue({
        name: "",
        category: ""
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editing, t]);

  const saveItem = (values) => {
    let obj = {
      name: values.name,
      categoryId: values.category
    };
    if (props.editing) {
      obj["id"] = props.editing.id;
    }
    props.saveItem(obj).then((res) => {
      form.resetFields();
    });
  };

  // const { getFieldsError } = form;

  return (
    <Form onFinish={saveItem} form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            className="mb-5"
            validateTrigger="onChange"
            name="name"
            label={<span>{t("activeSubstanceName")}</span>}
            rules={[whiteSpace(t("inputError"))]}
          >
            <Input size={'large'} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
              className="mb-5"
              validateTrigger="onChange"
              name="category"
              rules={[noWhitespace(t("itemMustSelectError"))]}
          >
            <Select
                placeholder={<span className="ml-5">{t("type")}</span>}
                className="pl-5"
            >
              {fertilizerKinds.map((i, index) => {
                return (
                    <Option key={index} value={i.id}>
                      {i.name}
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
              page={['warehouseSettings', 'subs', 'mainIngredients','perms']}
              type={'create'}
          >
            <Button htmlType="submit" type="primary">{t("save")}</Button>
          </Authorize>
        </Form.Item>
      </div>
    </Form>
  );
}

export default ActiveIngredientsForm;
