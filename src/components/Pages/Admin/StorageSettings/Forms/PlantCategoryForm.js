import React, { useEffect } from "react";
import {Button, Form, Col, Input, Row, Select} from "antd";
import { useTranslation } from "react-i18next";
import {getOptions, notify} from "../../../../../redux/actions";
import {noWhitespace, whiteSpace} from "../../../../../utils/rules";
import Authorize from "../../../../Elements/Authorize";
import {connect} from "react-redux";
const { Option } = Select;

const CropCategoryForm = (props) => {
  const { t , i18n} = useTranslation();
  const [form] = Form.useForm();
  const { getOptions } = props;
  const options = props.options[props.lang];

  useEffect(() => {
    console.log(props.items)
    getOptions(
        [
          "parcelCategories",
        ],
        props.options,
        i18n.language
    );
    if (props.editing) {
      let names = props.editing.contentForLang;
      let obj = {};
      names.forEach((name) => {
        obj[`name_${name.languagename}`] = name.content;
      });
      obj['cropCategory'] = props.editing.parcelCategoryId
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
      parcelCategoryId: values.cropCategory,
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
              <Input placeholder={t("productCategory")} />
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
              <Input placeholder={t("productCategory")} />
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
              <Input placeholder={t("productCategory")} />
            </Form.Item>
            <div className="input-lang">ru</div>
          </div>
        </Col>
        <Col md={24} xs={24}>
          <div className="form-lang">
            <Form.Item
                className="mb-5"
                validateTrigger="onChange"
                name="cropCategory"
                rules={[noWhitespace(t("inputError"))]}
            >
              <Select
                  onChange={(value)=>{console.log(value)}}
                  placeholder={<span>Ərazi kateqoriyası</span>}>
                {options.parcelCategories.map((c, index) => {
                  return (
                      <Option key={index} value={c.id}>
                        {c.name}
                      </Option>
                  );
                })}
              </Select>
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
              page={['warehouseSettings', 'subs', 'cropCategories','perms']}
              type={'create'}
          >
            <Button htmlType="submit" type="primary">{t("save")}</Button>
          </Authorize>
        </Form.Item>
      </div>
    </Form>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};


export default connect(mapStateToProps, { getOptions })(
    CropCategoryForm
);
