import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Col,
  DatePicker,
  Form,
  Button,
  Row,
  InputNumber,
} from "antd";
import { useTranslation } from "react-i18next";
import agros from "../../../../../const/api";
import moment from "moment";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import { noWhitespace, whiteSpace } from "../../../../../utils/rules";

const { Option } = Select;

const EditSector = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();

  const { getOptions, notify } = props;
  const options = props.options[props.lang];

  const [vals, setVals] = useState({});

  const handleKeyChangeIndex = (e, key) => {
    const all = { ...vals };
    all[key] = e;
    setVals(all);
  };

  useEffect(() => {
    form.resetFields();
    getOptions(["crops", "cropSorts"], props.options, i18n.language);
    console.log(props.sector);
    if (props.sector) {
      form.setFieldsValue({
        Name: props.sector.name,
        Area: props.sector.area,
        CreatedCompany:props.sector.createdCompany,
        CreatedDate: moment(props.sector.createdDate),
        TreeCount: props.sector.treeCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sector?.id, t]);

  const saveSector = (values) => {
    if (props.sector) {
      agros
        .put(`parcel/sector/${props.sector.id}`, {
          ...values,
          id: props.sector.id,
        })
        .then((res) => {
          notify("", true);
          props.triggerFetch();
          form.resetFields();
          props.setVisibleEditSector(false);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    } else {
      agros
        .post(`parcel/sector`, { ...values, ParcelId: props.parcel })
        .then((res) => {
          notify("", true);
          props.triggerFetch();
          form.resetFields();
          props.setVisibleEditSector(false);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={saveSector}>
      <div>
        <Row gutter={[16, 16]}>
          <Col sm={12} xs={24}>
            <Form.Item
              label={t("name")}
              validateTrigger="onChange"
              name="Name"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={12} xs={24}>
            <Form.Item
              label={
                <span>
                  {" "}
                  {t("area")} m<sup>2</sup>
                </span>
              }
              validateTrigger="onChange"
              name="Area"
              rules={[noWhitespace(t("inputError"))]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col sm={12} xs={24}>
            <Form.Item
              label={t("treeNumber")}
              validateTrigger="onChange"
              name="TreeCount"
              rules={[noWhitespace(t("inputError"))]}
            >
              <InputNumber className="w-100" />
            </Form.Item>
          </Col>
          <Col sm={12} xs={24}>
            <Form.Item
              label={t("createdDate")}
              validateTrigger="onChange"
              name="CreatedDate"
              rules={[noWhitespace(t("dataError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={12} sm={12} xs={24}>
            <Form.Item
                label={t("company")}
                validateTrigger="onChange"
                name="CreatedCompany"
                rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>

          {!props.sector && (
            <>
              <Col md={12} sm={12} xs={24}>
                <Form.Item
                  label={t("product")}
                  name="productId"
                  validateTrigger="onChange"
                  rules={[noWhitespace(t("inputError"))]}
                >
                  <Select
                    onChange={(e) => handleKeyChangeIndex(e, "productId")}
                  >
                    {options.crops
                      .filter((c) => c.categoryId === props.categoryId)
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
              <Col md={12} sm={12} xs={24}>
                <Form.Item
                  label={t("products")}
                  name="CropSortIds"
                  validateTrigger="onChange"
                  rules={[noWhitespace(t("inputError"))]}
                >
                  <Select mode="multiple" allowClear>
                    {options.cropSorts
                      .filter((c) => c.categoryId === vals.productId)
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
            </>
          )}
        </Row>
      </div>
      <div
        className="modalButtons"
        style={{ position: "absolute", bottom: "20px", right: "40px" }}
      >
        <Button onClick={() => props.setVisibleEditSector(false)}>
          {t("cancel")}
        </Button>
        <Button type="primary" className="ml-10" htmlType="submit">
          {t("save")}
        </Button>
      </div>
    </Form>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(EditSector);
