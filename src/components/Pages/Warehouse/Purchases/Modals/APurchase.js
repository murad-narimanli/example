import React, { useState, useEffect } from "react";
import "@ant-design/compatible/assets/index.css";
import { Button, Col, DatePicker, Row, Select, InputNumber, Form } from "antd";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import agros from "../../../../../const/api";
import { useTranslation } from "react-i18next";
import { noWhitespace } from "../../../../../utils/rules";
const { Option } = Select;

const PurchaseDocument = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);

  // const [transportDuties , setTransportDuties] = useState(0)
  const [formObject , setObjectForm] = useState({})
  const [totalCost , setTotalCost] = useState(0)
  const [lastPrice , setLastPrice] = useState(0)
  const { notify } = props;
  const { getOptions } = props;
  const options = props.options[props.lang];

  const mapData = () => {
    let formData = [];
    let prods = [];
    console.log(props.purchase.demandProducts);
    props.purchase.demandProducts.forEach((d) => {
      let obj = {
        CountryId: d.countryId,
        FertilizerKindId: d.product.fertilizerKindId,
        MainIngredientId: d.product.mainIngredientId,
        CropCategoryId: d.product.cropCategoryId,
        CropId: d.product.cropId,
        Quantity: d.quantity,
        ProductId: d.product.productId,
      };
      let type = "";
      if (d.product.fertilizerKindId !== null) {
        type = "dg";
      } else if (d.product.cropCategoryId !== null) {
        type = "m";
      } else {
        type = "e";
      }
      prods.push({
        type,
        FertilizerKindId: d.product.fertilizerKindId,
        MainIngredientId: d.product.mainIngredientId,
        CropCategoryId: d.product.cropCategoryId,
        CropId: d.product.cropId,
        measurementUnit: d.product.measurementUnit,
        quantity: d.quantity,
      });
      obj["type"] = type;
      formData.push(obj);
    });
    console.log(prods);
    setProducts(prods);
    form.setFieldsValue({ PurchaseProductList: formData });
  };

  const handleTypeChange = (e, index) => {
    const all = [...products];
    all[index].type = e;
    setProducts(all);
  };

  const handleKeyChange = (e, index, key) => {
    const all = [...products];
    all[index][key] = e;
    setProducts(all);
  };

  useEffect(() => {
    form.resetFields();
    mapData();
    setObjectForm(form.getFieldsValue())
    getOptions(
      [
        "parcelCategories",
        "crops",
        "cropSorts",
        "customers",
        "cropCategories",
        "reserves",
        "parcels",
        "paymentKinds",
        "fertilizers",
        "paymentTerms",
        "countries",
        "deliveryTerms",
        "fertilizerKinds",
        "mainIngredients",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.purchase, t , form]);


  const Calculate = () =>{
    let quantityData = [];
    let newTotalCost = 0;
    console.log(formObject)
    form.getFieldsValue().PurchaseProductList &&  form.getFieldsValue().PurchaseProductList.forEach((d) =>{
      let lastprice = parseInt(
          (
              ((d.Price  !== undefined ? d.Price: 0)*(d.Quantity  !== undefined ? d.Quantity: 0))+
              (
                  ((d.Price  !== undefined ? d.Price : 0)*(d.Quantity  !== undefined ? d.Quantity: 0))*
                  ((d.VATPercentage  !== undefined ? d.VATPercentage : 0)/100)
              )
              - (d.Discount  !== undefined ? d.Discount : 0)
              + (d.CustomsCost  !== undefined ? d.CustomsCost : 0)
              + (form.getFieldsValue().TransportCost !== undefined ? form.getFieldsValue().TransportCost : 0)
          ).toFixed(1)
      );
      let obj = {
        CountryId: d.CountryId,
        CropCategoryId: d.CropCategoryId,
        MainIngredientId: d.MainIngredientId,
        CropId: d.CropId,
        ProductId: d.ProductId,
        type: d.type,
        FertilizerKindId: d.FertilizerKindId,
        Price:d.Price,
        Quantity: d.Quantity,
        CustomsCost:d.CustomsCost,
        Discount:d.Discount,
        VATPercentage:d.VATPercentage,
        VAT: (((d.Price !== undefined ? d.Price : 0)*(d.Quantity  !== undefined ? d.Quantity : 0))
            *(d.VATPercentage  !== undefined ? d.VATPercentage: 0)/100),
        LastPrice: lastprice
      };
      newTotalCost+= lastprice;
      quantityData.push(obj);
    })
    form.setFieldsValue({
      PurchaseProductList: quantityData,
      TotalCost:newTotalCost
    });
    setTotalCost(newTotalCost)
  }

  const addProduct = () => {
    const all = [...products];
    all.push({ type: "dg" });
    setProducts(all);
  };

  const removeProduct = (index) => {
    const all = [...products];
    all.splice(index, 1);
    setProducts(all);
  };

  const saveDocument = (values) => {
    agros
      .post("purchase", { ...values, PaymentPeriod: "after 20 day" })
      .then((res) => {
        notify(t("newDocumentCreated"), true);
        hideModal();
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const hideModal = () => {
    form.resetFields();
    props.setVisibleAPurchase(false);
  };

  const setMeasurementUnit = (e, index, obj) => {
    const all = [...products];
    all[index]["measurementUnit"] = options[obj].find(
      (o) => o.id === e
    ).measurementUnit;
    setProducts(all);
  };

  return (
    <Form layout="vertical" form={form} onFinish={saveDocument}>
      <div className="commontask">
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label={t("supplier")}
              name="CustomerId"
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
                {options.customers.map((c, index) => {
                  return (
                    <Option key={index} value={c.id}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("customsCosts")}
              name="CustomsInclude"
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
                <Option value="true">{t("thereIs")}</Option>
                <Option value="false">{t("thereNo")}</Option>
              </Select>
            </Form.Item>
          </Col>

          {/*<Col md={8} sm={12} xs={24}>*/}
          {/*  <div className="form-lang">*/}
          {/*    <Form.Item*/}
          {/*      label={t("customsDuties")}*/}
          {/*      name="CustomsCost"*/}
          {/*      validateTrigger="onChange"*/}
          {/*      rules={[noWhitespace(t("inputError"))]}*/}
          {/*    >*/}
          {/*      <InputNumber  onChange={()=>{Calculate()}}  className="w-100" />*/}
          {/*    </Form.Item>*/}
          {/*    <span className="input-lang btm">azn</span>*/}
          {/*  </div>*/}
          {/*</Col>*/}

          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("transportCosts")}
              name="TransportInclude"
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
                  }>
                <Option value="true">{t("thereIs")}</Option>
                <Option value="false">{t("thereNo")}</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col md={8} sm={12} xs={24}>
            <div className="form-lang">
              <Form.Item
                label={t("transportDuties")}
                name="TransportCost"
                validateTrigger="onChange"
                rules={[noWhitespace(t("inputError"))]}
              >
                <InputNumber min={0} onChange={(value)=>{Calculate()}} className="w-100" />
              </Form.Item>
              <span className="input-lang btm">azn</span>
            </div>
          </Col>

          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("paymentType")}
              name="PaymentKindId"
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
                {options.paymentKinds.map((c, index) => {
                  return (
                    <Option key={index} value={c.id}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("paymentTerm")}
              name="PaymentTermId"
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
                  }>
                {options.paymentTerms.map((c, index) => {
                  return (
                    <Option key={index} value={c.id}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("deliveryTern")}
              name="DeliveryTermId"
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
                {options.deliveryTerms.map((c, index) => {
                  return (
                    <Option key={index} value={c.id}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("mustDeliverDate")}
              name="DeliveryPeriod"
              validateTrigger="onChange"
              rules={[noWhitespace(t("dateError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>

          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("lastPaymentDate")}
              name="PaymentLastDate"
              validateTrigger="onChange"
              rules={[noWhitespace(t("dateError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>


          <Col md={8} sm={12} xs={24}>
            <div className="form-lang">
              <Form.Item
                  label={'Ümumi yekun qiymət'}
                  name={'TotalCost'}
                  validateTrigger="onChange"
                  rules={[noWhitespace(t("inputError"))]}
              >
                <InputNumber className="w-100"   readOnly/>
              </Form.Item>
              <div className="input-lang btm">azn</div>
            </div>
          </Col>


        </Row>

        {products.map((pr, index) => {
          return (
            <div key={index} className="task1 border mt-20  p-2">
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <div className="w-100  flex-align-center flex flex-between">
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
                    name={["PurchaseProductList", index, "type"]}
                    initialValue={pr.type}
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
                        onChange={(e) => handleTypeChange(e, index)}>
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
                        name={[
                          "PurchaseProductList",
                          index,
                          "FertilizerKindId",
                        ]}
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
                            handleKeyChange(e, index, "FertilizerKindId")
                          }
                        >
                          {options.fertilizerKinds.map((c, index) => {
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
                        name={[
                          "PurchaseProductList",
                          index,
                          "MainIngredientId",
                        ]}
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
                            handleKeyChange(e, index, "MainIngredientId")
                          }
                        >
                          {options.mainIngredients.filter(
                              (f) =>
                                  f.categoryId ===
                                  pr.FertilizerKindId
                          ).map((cr, index) => {
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
                        name={["PurchaseProductList", index, "ProductId"]}
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
                                cr.fertilizerKindId === pr.FertilizerKindId &&
                                cr.mainIngredientId === pr.MainIngredientId
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
                        name={["PurchaseProductList", index, "CropCategoryId"]}
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
                            handleKeyChange(e, index, "CropCategoryId")
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
                        name={["PurchaseProductList", index, "CropId"]}
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
                          onChange={(e) => handleKeyChange(e, index, "CropId")}
                        >
                          {options.crops
                            .filter((cs) => cs.categoryId === pr.CropCategoryId)
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
                        name={["PurchaseProductList", index, "ProductId"]}
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
                            .filter((cs) => cs.categoryId === pr.CropId)
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
                      name={["PurchaseProductList", index, "ProductId"]}
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
                  <Form.Item
                    label={t("originCountry")}
                    name={["PurchaseProductList", index, "CountryId"]}
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
                  <div className="form-lang">
                    <Form.Item
                        label={t("customsDuties")}
                        name={["PurchaseProductList", index, "CustomsCost"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber  onChange={()=>{Calculate()}}  className="w-100" />
                    </Form.Item>
                    <span className="input-lang btm">azn</span>
                  </div>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <div className="form-lang">
                    <Form.Item
                      label={t("quantity")}
                      name={["PurchaseProductList", index, "Quantity"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber onChange={()=>{Calculate()}}  className="w-100" />
                    </Form.Item>
                    <div className="input-lang btm">{pr.measurementUnit}</div>
                  </div>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <div className="form-lang">
                    <Form.Item
                      label={t("price")}
                      name={["PurchaseProductList", index, "Price"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber onChange={()=>{Calculate()}}  className="w-100" />
                    </Form.Item>
                    <div className="input-lang btm">azn</div>
                  </div>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <div className="form-lang">
                    <Form.Item
                      label={t("discount")}
                      name={["PurchaseProductList", index, "Discount"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber  onChange={()=>{Calculate()}}  className="w-100" />
                    </Form.Item>
                    <div className="input-lang btm">azn</div>
                  </div>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <div className="form-lang">
                    <Form.Item
                        label='Ədv faizi'
                        name={["PurchaseProductList", index, "VATPercentage"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber onChange={()=>{Calculate()}}  className="w-100" />
                    </Form.Item>
                    <div className="input-lang btm">%</div>
                  </div>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <div className="form-lang">
                    <Form.Item
                        label={t("AdditionalTax")}
                        name={["PurchaseProductList", index, "VAT"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber readOnly className="w-100" />
                    </Form.Item>
                    <div className="input-lang btm">azn</div>
                  </div>
                </Col>

                <Col md={6} sm={12} xs={24}>
                  <div className="form-lang">
                    <Form.Item
                      label={t("finalPrice")}
                      name={["PurchaseProductList", index, "LastPrice"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber readOnly className="w-100" />
                    </Form.Item>
                    <div className="input-lang btm">azn</div>
                  </div>
                </Col>

              </Row>
            </div>
          );
        })}
        <div
          className="modalButtons"
          style={{ position: "absolute", bottom: "20px", right: "40px" }}
        >
          <Button onClick={() => props.setVisibleAPurchase(false)}>
            {t("cancel")}
          </Button>
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

export default connect(mapStateToProps, { getOptions, notify })(
  PurchaseDocument
);
