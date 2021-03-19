import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  InputNumber,
  DatePicker,
  Select,
  Input,
} from "antd";
import { noWhitespace } from "../../../../utils/rules";
import { useTranslation } from "react-i18next";
import { getOptions, notify } from "../../../../redux/actions";
import { connect } from "react-redux";
import agros from "./../../../../const/api";

const { Option } = Select;
const { TextArea } = Input;

const DetailedReports = (props) => {
  const [form] = Form.useForm();

  const [crops, setCrops] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [reserves, setReserves] = useState([]);
  const [tools, setTools] = useState([]);
  const { t, i18n } = useTranslation();

  const [workers, setWorkers] = useState([]);

  const { getOptions, task, notify } = props;
  const options = props.options[props.lang];

  useEffect(() => {
    getOptions(
      [
        "parcels",
        "parcelSectors",

        "parcelSectors",
        "parcels",
        "parcelCategories",

        "todos",
        "reserves",
        "tools",

        "fertilizers",
        "fertilizerKinds",
        "mainIngredients",

        "positions",
        "users",

        "cropCategories",
        "crops",
        "cropSorts",
      ],
      props.options,
      i18n.language
    );
    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, props.task]);

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

  const addCrop = () => {
    const all = [...crops];
    all.push({});
    setCrops(all);
  };

  const deleteCrop = (index) => {
    const all = [...crops];
    all.splice(index, 1);
    setCrops(all);
  };

  const addMedicine = () => {
    const all = [...medicines];
    all.push({});
    setMedicines(all);
  };

  const deleteMedicine = (index) => {
    const all = [...medicines];
    all.splice(index, 1);
    setMedicines(all);
  };

  const addReserve = () => {
    const all = [...reserves];
    all.push({});
    setReserves(all);
  };

  const deleteReserve = (index) => {
    const all = [...reserves];
    all.splice(index, 1);
    setReserves(all);
  };

  const addTool = () => {
    const all = [...tools];
    all.push({});
    setTools(all);
  };

  const deleteTool = (index) => {
    const all = [...tools];
    all.splice(index, 1);
    setTools(all);
  };

  const saveReport = (values) => {
    agros
      .post("workplanreport", { ...values, WorkPlanTaskId: task.id })
      .then((res) => {
        notify("", true);
        props.setVisibleViewReports(false);
        props.triggerFetch();
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const handlePositionsChange = (e) => {
    agros
      .get("data/workers/bulk", { params: { ids: e.join(",") } })
      .then((res) => {
        setWorkers(res.data);
      });
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("heading")}</td>
                <td>{task.toDoName}</td>
              </tr>
              <tr>
                <td>{t("shortStory")}</td>
                <td>{task.description}</td>
              </tr>
              <tr>
                <td>{t("status")}</td>
                <td>
                  <span className="text-primary">
                    {task.workStatusName?.props.children}
                  </span>{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col md={12} xs={24}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("startDate")}:</td>
                <td>{task.startDate}</td>
              </tr>
              <tr>
                <td>{t("endDate")}:</td>
                <td>{task.endDate}</td>
              </tr>
              <tr>
                <td>{t("isEndsDate")}: </td>
                <td>{task.finishDate}</td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col md={12} xs={24}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("respondentPeople")}:</td>
                <td>{task.respondent}</td>
              </tr>
              <tr>
                <td>{t("manWorkerNumber")}: </td>
                <td>{task.manWorkerCount}</td>
              </tr>
              <tr>
                <td>{t("womanWorkerNumber")}:</td>
                <td>{task.womanWorkerCount}</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      {props.task.workStatus !== 3 && (
        <Form layout="vertical" onFinish={saveReport} form={form}>
          <div className="commontask">
            <h3 className="p-5 mb-15 mt-20 border-bottom">{t("newReport")}</h3>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label={t("additionalNote")}
                  validateTrigger="onChange"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: t("inputError"),
                      whitespace: true,
                    },
                  ]}
                >
                  <TextArea allowClear rows={4} />
                </Form.Item>
              </Col>
              <Col md={6} sm={12} xs={24}>
                <Form.Item
                  label={t("date")}
                  validateTrigger="onChange"
                  name="repoDate"
                  rules={[noWhitespace(t("inputError"))]}
                >
                  <DatePicker placeholder={t("selectDate")} className="w-100" />
                </Form.Item>
              </Col>
              <Col md={3} sm={12} xs={12}>
                <Form.Item
                  label="Kişi işçi sayı"
                  name="manCount"
                  required
                  rules={[noWhitespace(t("inputError"))]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col md={3} sm={12} xs={12}>
                <Form.Item
                  label="Qadın işçi sayı"
                  name="womanCount"
                  required
                  rules={[noWhitespace(t("inputError"))]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col md={12} sm={12} xs={24}>
                <Form.Item label={t("position")}>
                  <Select mode="tags" onChange={handlePositionsChange}>
                    {options.positions.map((p, index) => {
                      return (
                        <Option key={index} value={p.id.toString()}>
                          {p.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={24} sm={24} xs={24}>
                <Form.Item
                  label={t("workers")}
                  validateTrigger="onChange"
                  name="workers"
                  rules={[noWhitespace(t("inputError"))]}
                >
                  <Select mode="tags">
                    {workers.map((w, index) => {
                      return (
                        <Option key={index} value={w.id.toString()}>
                          {w.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {medicines.map((m, index) => {
              return (
                <div key={index} className="task1 border mt-20 p-2">
                  <Row gutter={[8, 16]}>
                    <Col xs={24}>
                      <div className="w-100 flex-align-center flex flex-between">
                        <h3>
                          {t("medicine")} {index + 1}
                        </h3>
                        <div className="flex">
                          <Button
                            className="mr5-5 btn-danger"
                            onClick={() => deleteMedicine(index)}
                          >
                            {t("delete")}
                          </Button>
                          {medicines.length &&
                          index === medicines.length - 1 ? (
                            <Button
                              onClick={() => addMedicine(index)}
                              type="primary"
                            >
                              Dərman əlavə et
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </Col>
                    <Col md={6} sm={12} xs={24}>
                      <Form.Item
                        label={t("typeOf")}
                        name={["WorkPlanFertilizer", index, "fertilizerKindId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select
                          onChange={(e) =>
                            handleMedicineKeyChange(
                              e,
                              index,
                              "fertilizerKindId"
                            )
                          }
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
                    <Col md={6} sm={12} xs={24}>
                      <Form.Item
                        label={t("activeSubstance")}
                        name={["WorkPlanFertilizer", index, "mainIngredientId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select
                          onChange={(e) =>
                            handleMedicineKeyChange(
                              e,
                              index,
                              "mainIngredientId"
                            )
                          }
                        >
                          {options.mainIngredients.map((w, index) => {
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
                        label={t("name")}
                        name={["WorkPlanFertilizer", index, "productId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select
                          onChange={(e) =>
                            handleMedicineKeyChange(e, index, "productId")
                          }
                        >
                          {options.fertilizers
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
                        name={["WorkPlanFertilizer", index, "Quantity"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <div className="form-lang">
                          <InputNumber className="w-100" />
                          <span className="input-lang">
                            {
                              options.fertilizers.find(
                                (f) => f.id === m.productId
                              )?.measurementUnit
                            }
                          </span>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              );
            })}
            {tools.map((m, index) => {
              return (
                <div key={index} className="task1 border mt-20 p-2">
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <div className="w-100  flex-align-center flex flex-between">
                        <h3>Alət {index + 1}</h3>
                        <div className="flex">
                          <Button
                            onClick={() => deleteTool(index)}
                            className="mr5-5 btn-danger"
                          >
                            {t("delete")}
                          </Button>
                          {tools.length && index === tools.length - 1 ? (
                            <Button
                              onClick={() => addTool(index)}
                              type="primary"
                            >
                              Alət əlavə et
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </Col>
                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                        label="Alət"
                        name={["WorkPlanTools", index, "toolId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select>
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
                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                        label={t("quantity")}
                        name={["WorkPlanTools", index, "quantity"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <InputNumber className="w-100" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              );
            })}
            {crops.map((c, index) => {
              return (
                <div key={index} className="task1 border mt-20 p-2">
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <div className="w-100  flex-align-center flex flex-between">
                        <h3>
                          {t("products")} {index + 1}
                        </h3>
                        <div className="flex">
                          <Button
                            onClick={() => deleteCrop(index)}
                            className="mr5-5 btn-danger"
                          >
                            {t("delete")}
                          </Button>
                          {crops.length && index === crops.length - 1 ? (
                            <Button
                              onClick={() => addCrop(index)}
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
                        name={["WorkPlanCrops", index, "cropCategoryId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select
                          onChange={(e) =>
                            handleCropKeyChange(e, index, "cropCategoryId")
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
                        name={["WorkPlanCrops", index, "cropId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select
                          onChange={(e) =>
                            handleCropKeyChange(e, index, "cropsId")
                          }
                        >
                          {options.crops
                            .filter((d) => d.categoryId === c.cropCategoryId)
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
                        name={["WorkPlanCrops", index, "productId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select
                          onChange={(e) =>
                            handleCropKeyChange(e, index, "productId")
                          }
                        >
                          {options.cropSorts
                            .filter((d) => d.categoryId === c.cropsId)
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
                        name={["WorkPlanCrops", index, "quantity"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <div className="form-lang">
                          <InputNumber className="w-100" />
                          <span className="input-lang">
                            {
                              options.cropSorts.find(
                                (f) => f.id === c.productId
                              )?.measurementUnit
                            }
                          </span>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              );
            })}
            {reserves.map((m, index) => {
              return (
                <div key={index} className="task1 border mt-20 p-2">
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <div className="w-100  flex-align-center flex flex-between">
                        <h3>
                          {t("reserv")} {index + 1}
                        </h3>
                        <div className="flex">
                          <Button
                            onClick={() => deleteReserve(index)}
                            className="mr5-5 btn-danger"
                          >
                            {t("delete")}
                          </Button>
                          {reserves.length && index === reserves.length - 1 ? (
                            <Button
                              onClick={() => addReserve(index)}
                              type="primary"
                            >
                              Ehtiyat əlavə et
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </Col>
                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                        label={t("reserv")}
                        name={["WorkPlanReserves", index, "productId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select
                          onChange={(e) =>
                            handleReserveKeyChange(e, index, "productId")
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
                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                        label={t("quantity")}
                        name={["WorkPlanReserves", index, "quantity"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <div className="form-lang">
                          <InputNumber className="w-100" />
                          <span className="input-lang">
                            {
                              options.reserves.find((f) => f.id === m.productId)
                                ?.measurementUnit
                            }
                          </span>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              );
            })}
            <Col xs={24}>
              <Row gutter={8}>
                {!medicines.length ? (
                  <Col md={6} sm={12} xs={24}>
                    <div>
                      <Button
                        onClick={() => addMedicine()}
                        className="w-100 flex all-center formButton"
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
                        className="w-100 flex all-center formButton"
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
                        className="w-100 flex all-center formButton"
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
                        className="w-100 flex all-center formButton"
                        type="primary"
                      >
                        {t("addReserve")}
                      </Button>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </Col>

            <div
              className="modalButtons"
              style={{ position: "absolute", bottom: "20px", right: "40px" }}
            >
              <Button onClick={() => props.setVisibleViewReports(false)}>
                {t("cancel")}
              </Button>
              <Button type="primary" className="ml-10" htmlType="submit">
                {t("save")}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(
  DetailedReports
);
