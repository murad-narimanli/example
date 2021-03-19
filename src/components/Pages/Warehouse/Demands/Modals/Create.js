import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Col,
  Button,
  DatePicker,
  Row,
  InputNumber,
  Form,
} from "antd";
import agros from "../../../../../const/api";
import { whiteSpace, noWhitespace } from "../../../../../utils/rules";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const Create = (props) => {
  const { notify } = props;
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([{}]);

  const { getOptions } = props;
  const options = props.options[props.lang];

  const handleKeyChange = (e, index, key) => {
    const all = [...products];
    all[index][key] = e;
    setProducts(all);
  };

  useEffect(() => {
    getOptions(
      [
        "cropCategories",
        "fertilizers",
        "cropSorts",
        "crops",
        "reserves",
        "fertilizerKinds",
        "parcelCategories",
        "parcels",
        "countries",
        "users",
        "mainIngredients",
      ],
      props.options,
      i18n.language
    );
    console.log(options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const addProduct = () => {
    const all = [...products];
    all.push({ type: undefined });
    setProducts(all);
  };
  const removeProduct = (index) => {
    const all = [...products];
    all.splice(index, 1);
    setProducts(all);
  };

  const submitForm = (values) => {
    agros
      .post("demand", { ...values })
      .then((res) => {
        notify(t("newDemandCreated"), true);
        props.newDemandAdded();
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const setMeasurementUnit = (e, index, obj) => {
    const all = [...products];
    all[index]["measurementUnit"] = options[obj].find(
      (o) => o.id === e
    ).measurementUnit;
    setProducts(all);
    console.log(all)
  };

  return (
    <Form onFinish={submitForm} layout="vertical" form={form}>
      <div className="commontask">
        <Row gutter={[16, 16]}>
          <Col xs={18}>
            <Form.Item
              label={t("demandName")}
              name="Name"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input size={'large'} />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item
              label="Təxmini maddi dəyəri"
              name="estimatedValue"
              validateTrigger="onChange"
              rules={[noWhitespace(t("inputError"))]}
            >
              <div className="form-lang">
                <InputNumber />
                <div className="input-lang">azn</div>
              </div>
            </Form.Item>
          </Col>
        </Row>

        {/*add task*/}
        {products.map((pr, index) => {
          return (
            <div key={index} className="task1 border mt-15  p-2">
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div className="w-100 flex-align-center flex flex-between">
                    <h3>
                      {t("product")} {index + 1}
                    </h3>
                    <div className="flex">
                      {products.length > 1 && (
                        <Button
                          className="mr5-5 btn-danger"
                          onClick={() => removeProduct(index)}
                        >
                          {t("delete")}
                        </Button>
                      )}
                      <Button type="primary" onClick={addProduct}>
                        {t("addTo")}
                      </Button>
                    </div>
                  </div>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <Form.Item
                    label={t("typeOf")}
                    name={["demandProduct", index, "type"]}
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
                        onChange={(e) => handleKeyChange(e, index, "type")}>
                      <Option value="dg">{t("drugAndFertilizer")}</Option>
                      <Option value="m">{t("product")}</Option>
                      <Option value="e">{t("reserv")}</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {pr.type === "dg" && (
                  <>
                    <Col md={6} sm={12} xs={24}>
                      <Form.Item
                        label={t("productType")}
                        name={["demandProduct", index, "fertilizerKindId"]}
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
                          onChange={(e) =>
                            handleKeyChange(e, index, "fertilizerKindId")
                          }
                        >
                          {options.fertilizerKinds.map((c, index) => {
                            console.log(c)
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
                        label={t("activeSubstance")}
                        name={["demandProduct", index, "mainIngredientId"]}
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
                          onChange={(e) =>
                            handleKeyChange(e, index, "mainIngredientId")
                          }
                        >
                          {options.mainIngredients.filter(
                              (f) =>
                                  f.categoryId ===
                                  pr.fertilizerKindId
                          ).map((cr, index) => {
                            console.log(pr)
                            return (
                              <Option key={index} value={cr.id}>
                                {cr.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={6} sm={12} xs={24}>
                      <Form.Item
                        label={t("productName")}
                        name={["demandProduct", index, "productId"]}
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
                          onChange={(e) =>
                            setMeasurementUnit(e, index, "fertilizers")
                          }
                        >
                          {options.fertilizers
                            .filter(
                              (cr) =>
                                cr.fertilizerKindId === pr.fertilizerKindId &&
                                cr.mainIngredientId === pr.mainIngredientId
                            )
                            .map((cr, index) => {
                              return (
                                <Option key={index} value={cr.id}>
                                  {cr.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </>
                )}
                {pr.type === "m" && (
                  <>
                    <Col md={6} sm={12} xs={24}>
                      <Form.Item
                        label={t("productCategory")}
                        name={["demandProduct", index, "cropCategory"]}
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
                          onChange={(e) =>
                            handleKeyChange(e, index, "cropCategory")
                          }
                        >
                          {options.cropCategories.map((cc, index) => {
                            return (
                              <Option key={index} value={cc.id}>
                                {cc.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={6} sm={12} xs={24}>
                      <Form.Item
                        label={t("product")}
                        name={["demandProduct", index, "cropsId"]}
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
                          onChange={(e) => handleKeyChange(e, index, "cropsId")}
                        >
                          {options.crops
                            .filter((cs) => cs.categoryId === pr.cropCategory)
                            .map((cr, index) => {
                              return (
                                <Option key={index} value={cr.id}>
                                  {cr.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={6} sm={12} xs={24}>
                      <Form.Item
                        label={t("productSorts")}
                        name={["demandProduct", index, "productId"]}
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
                          onChange={(e) =>
                            setMeasurementUnit(e, index, "cropSorts")
                          }
                        >
                          {options.cropSorts
                            .filter((cs) => cs.categoryId === pr.cropsId)
                            .map((cs, index) => {
                              return (
                                <Option key={index} value={cs.id}>
                                  {cs.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </>
                )}
                {pr.type === "e" && (
                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("reserv")}
                      name={["demandProduct", index, "productId"]}
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
                        onChange={(e) =>
                          setMeasurementUnit(e, index, "reserves")
                        }
                      >
                        {options.reserves.map((r, index) => {
                          return (
                            <Option key={index} value={r.id}>
                              {r.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
                <Col md={6} sm={12} xs={24}>
                  <div className="form-lang">
                    <Form.Item
                      label={t("quantity")}
                      name={["demandProduct", index, "quantity"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber className="w-100" />
                    </Form.Item>
                    <div className="input-lang btm">{pr.measurementUnit}</div>
                  </div>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <Form.Item
                    label={t("areaCategory")}
                    name={["demandProduct", index, "parcelCategoryId"]}
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
                      onChange={(e) =>
                        handleKeyChange(e, index, "parcelCategoryId")
                      }
                    >
                      {options.parcelCategories.map((pc, index) => {
                        return (
                          <Option key={index} value={pc.id}>
                            {pc.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <Form.Item
                    label={t("area")}
                    name={["demandProduct", index, "parcelId"]}
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
                      {options.parcels
                        .filter(
                          (pc) => pc.parcelCategoryId === pr.parcelCategoryId
                        )
                        .map((pc, index) => {
                          return (
                            <Option key={index} value={pc.id}>
                              {pc.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <Form.Item
                    label={t("country")}
                    name={["demandProduct", index, "countryId"]}
                    validateTrigger="onChange"
                    rules={[noWhitespace(t("inputError"))]}
                  >
                    <Select>
                      {options.countries.map((c, index) => {
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
                    label={t("demandedPerson")}
                    name={["demandProduct", index, "requestingWorkerId"]}
                    validateTrigger="onChange"
                    rules={[noWhitespace(t("inputError"))]}
                  >
                    <Select>
                      {options.users.map((h, index) => {
                        return (
                          <Option key={index} value={h.id}>
                            {h.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>

                {pr.type === "dg" && (
                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("expirationDate")}
                      name={["demandProduct", index, "expirationDate"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("dataError"))]}
                    >
                      <DatePicker
                        placeholder={t("selectDate")}
                        className="w-100"
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col md={6} sm={12} xs={24}>
                  <Form.Item
                    label={t("dateMustBuy")}
                    name={["demandProduct", index, "requiredDate"]}
                    validateTrigger="onChange"
                    rules={[noWhitespace(t("dataError"))]}
                  >
                    <DatePicker
                      placeholder={t("selectDate")}
                      className="w-100"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div
                className="modalButtons"
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "40px",
                }}
              >
                <Button onClick={() => props.setVisibleAddNewDemand(false)}>
                  {t("cancel")}
                </Button>
                <Button type="primary" className="ml-10" htmlType="submit">
                  {t("save")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(Create);
