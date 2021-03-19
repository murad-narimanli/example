import React, { useState, useEffect } from "react";
import {
  Col,
  Input,
  Select,
  DatePicker,
  Row,
  Button,
  InputNumber,
  Form,
} from "antd";
import agros from "../../../../../const/api";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { getOptions, notify } from "../../../../../redux/actions";
import { whiteSpace, noWhitespace } from "../../../../../utils/rules";

const { Option } = Select;
const { TextArea } = Input;

const NewTask = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [medicines, setMedicines] = useState([]);
  const [crops, setCrops] = useState([]);
  const [reserves, setReserves] = useState([]);
  const [tools, setTools] = useState([]);
  const [workers, setWorkers] = useState([]);

  const { getOptions, notify } = props;
  const options = props.options[props.lang];

  const handleMedicineKeyChange = (e, index, key) => {
    const all = [...medicines];
    all[index][key] = e;
    setMedicines(all);
  };

  const handleCropKeyChange = (e, index, key) => {
    const all = [...crops];
    all[index][key] = e;
    setCrops(all);
  };

  const handleReserveKeyChange = (e, index, key) => {
    const all = [...reserves];
    all[index][key] = e;
    setReserves(all);
  };

  useEffect(() => {
    form.resetFields();
    getOptions(
      [
        "mainIngredients",
        "fertilizerKinds",
        "fertilizers",

        "todos",
        "positions",

        "cropCategories",
        "crops",
        "cropSorts",

        "tools",
        "reserves",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const addMedicine = () => {
    const all = [...medicines];
    const id = medicines.length ? medicines[medicines.length - 1].id + 1 : 0;
    all.push({ id, fertilizerKindId: null });
    setMedicines(all);
  };

  const deleteMedicine = (index) => {
    const all = [...medicines];
    all.splice(index, 1);
    setMedicines(all);
  };

  const addReserve = () => {
    const all = [...reserves];
    const id = reserves.length ? reserves[reserves.length - 1].id + 1 : 0;
    all.push({ id });
    setReserves(all);
  };

  const deleteReserve = (index) => {
    const all = [...reserves];
    all.splice(index, 1);
    setReserves(all);
  };

  const addTool = () => {
    const all = [...tools];
    const id = tools.length ? tools[tools.length - 1].id + 1 : 0;
    all.push({ id });
    setTools(all);
  };

  const deleteTool = (index) => {
    const all = [...tools];
    all.splice(index, 1);
    setTools(all);
  };

  const addCrop = () => {
    const all = [...crops];
    const id = crops.length ? crops[crops.length - 1].id + 1 : 0;
    all.push({ id, cropCategoryId: null });
    setCrops(all);
  };

  const deleteCrop = (index) => {
    const all = [...crops];
    all.splice(index, 1);
    setCrops(all);
  };

  const handlePositionChange = (e) => {
    let values = form.getFieldsValue();
    values.worker = undefined;
    form.setFieldsValue({ ...values });
    agros.get(`data/workers/${e}`).then((res) => {
      setWorkers(res.data);
    });
  };

  const saveTask = (values) => {
    agros
      .post("workplan/createtask", [{ ...values, WorkPlanId: props.plan }])
      .then(() => {
        notify("", true);
        props.triggerFetch();
        props.setVisibleAddNewTask(false);
      });
  };

  const handleAmountChange = (e, bindex) => {
    const values = form.getFieldsValue();
    let val = +e * 500;
    values.WorkPlanTaskFertilizers[bindex].Quantity = val.toString();
    form.setFieldsValue({ ...values });
  };

  return (
    <Form onFinish={saveTask} form={form} layout="vertical">
      <div className="task">
        <Row gutter={[16, 16]}>
          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("workWillDo")}
              name="ToDoId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("workWillMustSelect"))]}
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
                {options.todos.map((w, index) => {
                  return (
                    <Option key={index} value={w.id}>
                      {w.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("positions")}
              name="position"
              validateTrigger="onChange"
              rules={[noWhitespace(t("positionMustSelectError"))]}
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
                  onChange={(e) => handlePositionChange(e)}>
                {options.positions.map((w, index) => {
                  return (
                    <Option key={index} value={w.id}>
                      {w.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("workers")}
              name="RespondentId"
              validateTrigger="onChange"
              rules={[noWhitespace(t("personMustSelect"))]}
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
                {workers.map((w, index) => {
                  return (
                    <Option key={index} value={w.id}>
                      {w.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("startDate")}
              name="startdate"
              validateTrigger="onChange"
              rules={[noWhitespace(t("dateError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={8} sm={12} xs={24}>
            <Form.Item
              label={t("endDate")}
              name="enddate"
              validateTrigger="onChange"
              rules={[noWhitespace(t("dateError"))]}
            >
              <DatePicker placeholder={t("selectDate")} className="w-100" />
            </Form.Item>
          </Col>
          <Col md={4} sm={12} xs={24}>
            <Form.Item
              label={t("manWorkerNumber")}
              name="ManWorkerCount"
              validateTrigger="onChange"
              rules={[noWhitespace(t("numberMustAdd"))]}
            >
              <InputNumber className="w-100" />
            </Form.Item>
          </Col>
          <Col md={4} sm={12} xs={24}>
            <Form.Item
              label={t("womanWorkerNumber")}
              name="WomanWorkerCount"
              validateTrigger="onChange"
              rules={[noWhitespace(t("numberMustAdd"))]}
            >
              <InputNumber className="w-100" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="Description"
              validateTrigger="onChange"
              rules={[whiteSpace(t("inputError"))]}
            >
              <TextArea placeholder={t("additionalNote")} allowClear rows={4} />
            </Form.Item>
          </Col>
        </Row>

        {medicines.map((m, bindex) => {
          return (
            <Col span={24} key={bindex}>
              <div className="medicine1 p-1 mt-5 border">
                <Row gutter={[8, 16]}>
                  <Col xs={24}>
                    <div className="w-100  flex-align-center flex flex-between">
                      <h3>
                        {t("medicine")} {bindex + 1}
                      </h3>
                      <div className="flex">
                        <Button
                          className="mr5-5 btn-danger"
                          onClick={() => deleteMedicine(bindex)}
                        >
                          {t("delete")}
                        </Button>
                        {bindex === medicines.length - 1 ? (
                          <Button
                            onClick={() => addMedicine()}
                            className="w-100 flex all-center"
                            type="primary"
                          >
                            Dərman əlavə et
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                  <Col md={8} sm={12} xs={24}>
                    <Form.Item
                      label={t("typeOf")}
                      name={[
                        "WorkPlanTaskFertilizers",
                        bindex,
                        "fertilizerKindId",
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
                        onChange={(e) => {
                          handleMedicineKeyChange(
                            e,
                            bindex,
                            "fertilizerKindId"
                          );
                        }}
                      >
                        {options.fertilizerKinds.map((w, index) => {
                          return (
                            <Option key={index} value={w.id}>
                              {w.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={12} xs={24}>
                    <Form.Item
                      label={t("activeSubstance")}
                      name={[
                        "WorkPlanTaskFertilizers",
                        bindex,
                        "mainIngredientId",
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
                        onChange={(e) => {
                          handleMedicineKeyChange(
                            e,
                            bindex,
                            "mainIngredientId"
                          );
                        }}
                      >
                        {options.mainIngredients.filter(
                            (f) =>
                                f.categoryId ===
                                m.fertilizerKindId
                        ).map((w, index) => {
                          return (
                            <Option key={index} value={w.id}>
                              {w.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={12} xs={24}>
                    <Form.Item
                      label={t("name")}
                      name={["WorkPlanTaskFertilizers", bindex, "productId"]}
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
                        onChange={(e) => {
                          handleMedicineKeyChange(e, bindex, "fertilizerId");
                        }}
                      >
                        {m.mainIngredientId &&
                          options.fertilizers
                            .filter(
                              (f) =>
                                f.mainIngredientId === m.mainIngredientId &&
                                f.fertilizerKindId === m.fertilizerKindId
                            )
                            .map((w, index) => {
                              return (
                                <Option key={index} value={w.id}>
                                  {w.name}
                                </Option>
                              );
                            })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("quantity")}
                      name={["WorkPlanTaskFertilizers", bindex, "Amount"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <div className="form-lang">
                        <InputNumber
                          onChange={(e) => handleAmountChange(e, bindex)}
                          className="w-100"
                        />
                        <span className="input-lang">
                          {
                            options.fertilizers.find(
                              (f) => f.id === m.fertilizerId
                            )?.measurementUnit
                          }{" "}
                          / m<sup>2</sup>
                        </span>
                      </div>
                    </Form.Item>
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("finalAmount")}
                      name={["WorkPlanTaskFertilizers", bindex, "Quantity"]}
                    >
                      <div className="form-lang">
                        <InputNumber className="w-100" disabled={true} />
                        <span className="input-lang">
                          {
                            options.fertilizers.find(
                              (f) => f.id === m.fertilizerId
                            )?.measurementUnit
                          }
                        </span>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          );
        })}
        {/*tools*/}
        {tools.map((m, dindex) => {
          return (
            <Col xs={24} key={dindex}>
              <div className="border p-1 mt-5">
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <div className="w-100  flex-align-center flex flex-between">
                      <h3>Alət {dindex + 1}</h3>
                      <div className="flex">
                        <Button
                          onClick={() => deleteTool(dindex)}
                          className="mr5-5 btn-danger"
                        >
                          {t("delete")}
                        </Button>
                        {dindex === tools.length - 1 ? (
                          <Button
                            onClick={() => addTool()}
                            className="w-100 flex all-center"
                            type="primary"
                          >
                            Alət əlavə et
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                  <Col md={12} sm={12} xs={24}>
                    <Form.Item
                      label="Alət"
                      name={["WorkPlanTaskTools", dindex, "toolId"]}
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
                        {options.tools.map((f, findex) => {
                          return (
                            <Option key={findex} value={f.id}>
                              {f.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={12} xs={24}>
                    <Form.Item
                      label={t("quantity")}
                      name={["WorkPlanTaskTools", dindex, "quantity"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <InputNumber className="w-100" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          );
        })}
        {/*tools*/}
        {/*crops*/}
        {crops.map((c, cindex) => {
          return (
            <Col xs={24} key={cindex}>
              <div className="border p-1 mt-5">
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <div className="w-100  flex-align-center flex flex-between">
                      <h3>
                        {t("products")} {cindex + 1}
                      </h3>
                      <div className="flex">
                        <Button
                          onClick={() => deleteCrop(cindex)}
                          className="mr5-5 btn-danger"
                        >
                          {t("delete")}
                        </Button>
                        {cindex === crops.length - 1 ? (
                          <Button
                            onClick={() => addCrop()}
                            className="w-100 flex all-center"
                            type="primary"
                          >
                            {t("addProduct")}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Col>

                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("productCategory")}
                      name={["WorkPlanTaskCrops", cindex, "cropCategoryId"]}
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
                          handleCropKeyChange(e, cindex, "cropCategoryId")
                        }
                      >
                        {options.cropCategories.map((f, findex) => {
                          return (
                            <Option key={findex} value={f.id}>
                              {f.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("product")}
                      name={["WorkPlanTaskCrops", cindex, "cropsId"]}
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
                          handleCropKeyChange(e, cindex, "cropsId")
                        }
                      >
                        {options.crops
                          .filter((f) => f.categoryId === c.cropCategoryId)
                          .map((f, findex) => {
                            return (
                              <Option key={findex} value={f.id}>
                                {f.name}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("productSorts")}
                      name={["WorkPlanTaskCrops", cindex, "cropSortId"]}
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
                          handleCropKeyChange(e, cindex, "cropSortId")
                        }
                      >
                        {options.cropSorts
                          .filter((f) => f.categoryId === c.cropsId)
                          .map((f, findex) => {
                            return (
                              <Option key={findex} value={f.id}>
                                {f.name}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("quantity")}
                      name={["WorkPlanTaskCrops", cindex, "quantity"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <div className="form-lang">
                        <InputNumber className="w-100" />
                        <span className="input-lang">
                          {
                            options.cropSorts.find((f) => f.id === c.cropSortId)
                              ?.measurementUnit
                          }
                        </span>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          );
        })}
        {/*crops*/}
        {/*reserves*/}
        {reserves.map((r, dindex) => {
          return (
            <Col xs={24} key={dindex}>
              <div className="border p-1 mt-5">
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <div className="w-100  flex-align-center flex flex-between">
                      <h3>
                        {t("reserv")} {dindex + 1}
                      </h3>
                      <div className="flex">
                        <Button
                          onClick={() => deleteReserve(dindex)}
                          className="mr5-5 btn-danger"
                        >
                          {t("delete")}
                        </Button>
                        {dindex === reserves.length - 1 ? (
                          <Button
                            onClick={() => addReserve()}
                            className="w-100 flex all-center"
                            type="primary"
                          >
                            Ehtiyat əlavə et
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("reserv")}
                      name={["WorkPlanTaskReserves", dindex, "productId"]}
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
                          handleReserveKeyChange(e, dindex, "reserveId")
                        }
                      >
                        {options.reserves.map((f, findex) => {
                          return (
                            <Option key={findex} value={f.id}>
                              {f.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("quantity")}
                      name={["WorkPlanTaskReserves", dindex, "quantity"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <div className="form-lang">
                        <InputNumber className="w-100" />
                        <span className="input-lang">
                          {
                            options.reserves.find((f) => f.id === r.reserveId)
                              ?.measurementUnit
                          }
                        </span>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          );
        })}
        {/*reserves*/}

        <Col xs={24}>
          <Row gutter={8}>
            {!medicines.length ? (
              <Col md={6} sm={12} xs={24}>
                <div>
                  <Button
                    onClick={() => addMedicine()}
                    className="w-100 flex all-center mt-5"
                    type="primary"
                  >
                    {t("addMedicine")}
                  </Button>
                </div>
              </Col>
            ) : null}
            {!tools.length ? (
              <Col md={6} sm={12} xs={24}>
                <div>
                  <Button
                    onClick={() => addTool()}
                    className="w-100 flex all-center mt-5"
                    type="primary"
                  >
                    Alət əlavə et
                  </Button>
                </div>
              </Col>
            ) : null}
            {!crops.length ? (
              <Col md={6} sm={12} xs={24}>
                <div>
                  <Button
                    onClick={() => addCrop()}
                    className="w-100 flex all-center mt-5"
                    type="primary"
                  >
                    {t("addProduct")}
                  </Button>
                </div>
              </Col>
            ) : null}
            {!reserves.length ? (
              <Col md={6} sm={12} xs={24}>
                <div>
                  <Button
                    onClick={() => addReserve()}
                    className="w-100 flex all-center mt-5"
                    type="primary"
                  >
                    {t("addReserve")}
                  </Button>
                </div>
              </Col>
            ) : null}
          </Row>
        </Col>
      </div>
      <div
        className="modalButtons"
        style={{ position: "absolute", bottom: "20px", right: "40px" }}
      >
        <Button onClick={() => props.setVisibleAddNewTask(false)}>
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

export default connect(mapStateToProps, { getOptions, notify })(NewTask);
