import React, { useEffect, useState } from "react";
import {
  Col,
  Select,
  DatePicker,
  Button,
  Row,
  Input,
  InputNumber,
  Form,
  notification,
  Modal,
} from "antd";
import { whiteSpace, noWhitespace } from "../../../../../utils/rules";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import agros from "../../../../../const/api";

const { Option } = Select;
const { TextArea } = Input;

const NewPlan = (props) => {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const [confirmDemand, setConfirmDemand] = useState(false);
  const [demandValues, setDemandValues] = useState([]);

  const [tasks, setTasks] = useState([
    { id: 1, medicines: [], workers: [], reserves: [], tools: [], crops: [] },
  ]);

  const [parcelCategoryId, setParcelCategoryId] = useState(undefined);
  // const [parcel, setParcel] = useState(undefined);
  const [parcelSectors, setParcelSectors] = useState([]);
  const [area, setArea] = useState(0);

  const { getOptions, notify } = props;
  const options = props.options[props.lang];

  useEffect(() => {
    getOptions(
      [
        "parcels",
        "parcelSectors",
        "parcelCategories",

        "annualWorkPlans",
        "todos",
        "positions",

        "fertilizers",
        "fertilizerKinds",
        "mainIngredients",

        "cropCategories",
        "crops",
        "cropSorts",

        "reserves",
        "tools",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const createDemandCancelled = () => {
    setConfirmDemand(false);
  };

  const createDemandConfirmed = () => {
    const vals = form.getFieldsValue();
    agros
      .post("demand", {
        name: `"${vals.name}" adlı günlük plan üçün üçün tələb`,
        demandProduct: demandValues,
      })
      .then((res) => {
        notification.info({
          message: "Əməliyyat uğurlu oldu",
          description: "Yeni tələb yaradıldı",
          icon: <SmileOutlined />,
        });
        form.resetFields();
        props.setVisibleAddNewPlan(false);
        setConfirmDemand(false);
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const addTask = () => {
    const all = [...tasks];
    const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 0;
    all.push({
      id,
      medicines: [],
      workers: [],
      reserves: [],
      tools: [],
      crops: [],
    });
    setTasks(all);
  };

  const deleteTask = (index) => {
    const all = [...tasks];
    all.splice(index, 1);
    setTasks(all);
  };

  const addMedicine = (index) => {
    const all = [...tasks];
    const id = all[index].medicines.length
      ? all[index].medicines[all[index].medicines.length - 1].id + 1
      : 0;
    all[index].medicines.push({
      id,
      mainIngredientId: undefined,
    });
    setTasks(all);
  };

  const deleteMedicine = (index, bindex) => {
    const all = [...tasks];
    all[index].medicines.splice(bindex, 1);
    setTasks(all);
  };

  const addTool = (index) => {
    const all = [...tasks];
    const id = all[index].tools.length
      ? all[index].tools[all[index].tools.length - 1].id + 1
      : 0;
    all[index].tools.push({ id });
    setTasks(all);
  };

  const deleteTool = (index, bindex) => {
    const all = [...tasks];
    all[index].tools.splice(bindex, 1);
    setTasks(all);
  };

  const addReserve = (index) => {
    const all = [...tasks];
    const id = all[index].reserves.length
      ? all[index].reserves[all[index].reserves.length - 1].id + 1
      : 0;
    all[index].reserves.push({ id });
    setTasks(all);
  };

  const deleteReserve = (index, bindex) => {
    const all = [...tasks];
    all[index].reserves.splice(bindex, 1);
    setTasks(all);
  };

  const addCrop = (index) => {
    const all = [...tasks];
    const id = all[index].crops.length
      ? all[index].crops[all[index].crops.length - 1].id + 1
      : 0;
    all[index].crops.push({ id });
    setTasks(all);
  };

  const deleteCrop = (index, bindex) => {
    const all = [...tasks];
    all[index].crops.splice(bindex, 1);
    setTasks(all);
  };

  const savePlan = (values) => {
    agros
      .post("workplan", { ...values })
      .then((res) => {
        if (res.data && res.data.demands.length) {
          setConfirmDemand(true);
          setDemandValues(res.data.demands);
          notification.info({
            message: "Əməliyyat uğursuz oldu",
            description:
              "Çatışmayan resurslar var. Onları əldə etmək üçün tələb yarada bilərsiniz.",
            icon: <FrownOutlined />,
          });
        } else {
          notify("Plan əlavə olundu", true);
          form.resetFields();
          props.setVisibleAddNewPlan(false);
          props.triggerFetch();
        }
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const handleParcelCategoryChange = (e) => {
    form.setFieldsValue({
      parcelId: undefined,
      parcelSectorId: undefined,
    });
    setParcelCategoryId(e);
    // setParcel(null);
  };

  const handleParcelChange = (e) => {
    form.setFieldsValue({ parcelSectorId: undefined });
    // setParcel(e);
    setArea(options.parcels.find((p) => p.id === e).area);
  };

  const handleSectorChange = (e) => {
    let area = 0;
    e.forEach((a) => {
      area += options.parcelSectors.find((p) => p.id === a).area;
    });
    setArea(area);
  };

  const handlePositionChange = (e, index) => {
    const all = [...tasks];
    let values = form.getFieldsValue();
    values.WorkPlanTasks[index].worker = undefined;
    form.setFieldsValue({ ...values });
    agros.get(`data/workers/${e}`).then((res) => {
      all[index].workers = res.data;
      setTasks(all);
    });
  };

  const handleKeyChange = (e, index, bindex, key, key2) => {
    const all = [...tasks];
    all[index][key][bindex][key2] = e;
    setTasks(all);
  };

  const handleAmountChange = (e, index, bindex) => {
    const values = form.getFieldsValue();
    let val = +e * area;
    values.WorkPlanTasks[index].WorkPlanTaskFertilizers[bindex].Quantity = val;

    const all = [...tasks];
    all[index].medicines[bindex]["quantity"] = val;
    setTasks(all);
    form.setFieldsValue({ ...values });
  };

  const handleAnnualPlanChange = (e) => {
    agros.get(`annualworkplan/sectors/${e}`).then((res) => {
      form.setFieldsValue({
        parcelCategoryId: res.data.parcelCategoryId,
        parcelId: res.data.parcelId,
      });
      setParcelCategoryId(res.data.parcelCategoryId);
      // setParcel(res.data.parcelId);
      setParcelSectors(res.data.sectors.map((s) => s.parcelSectorId));
    });
  };

  return (
    <>
      <Form onFinish={savePlan} layout="vertical" form={form}>
        <div className="commontask">
          <Row gutter={[8, 16]}>
            <Col sm={12} xs={24}>
              <Form.Item
                label={t("WorkPlanName")}
                name="name"
                validateTrigger="onChange"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input size={'large'} />
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <Form.Item
                label={t("yearlyWorkPlan")}
                name="AnnualWorkPlanId"
                validateTrigger="onChange"
                rules={[noWhitespace(t("mustSelectWorkPlan"))]}
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
                    onChange={(e) => handleAnnualPlanChange(e)}>
                  {options.annualWorkPlans.map((w, index) => {
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
                label={t("startDate")}
                name="startdate"
                validateTrigger="onChange"
                rules={[noWhitespace(t("dateError"))]}
              >
                <DatePicker placeholder={t("selectDate")} className="w-100" />
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("endDate")}
                name="enddate"
                validateTrigger="onChange"
                rules={[noWhitespace(t("dateError"))]}
              >
                <DatePicker placeholder={t("selectDate")} className="w-100" />
              </Form.Item>
            </Col>
            <Col sm={6} xs={24}>
              <Form.Item
                label={t("areaType")}
                name="parcelCategoryId"
                validateTrigger="onChange"
                rules={[noWhitespace(t("selectCropSort"))]}
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
                    onChange={handleParcelCategoryChange}
                    disabled={true}>
                  {options.parcelCategories.map((w, index) => {
                    return (
                      <Option key={index} value={w.id}>
                        {w.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6} xs={24}>
              <Form.Item
                label={t("area")}
                name="parcelId"
                validateTrigger="onChange"
                rules={[noWhitespace(t("selectCrop"))]}
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
                    onChange={handleParcelChange} disabled={true}>
                  {parcelCategoryId &&
                    options.parcels
                      .filter((p) => p.parcelCategoryId === parcelCategoryId)
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
            <Col sm={12} xs={24}>
              <Form.Item
                label={t("sector")}
                name="parcelSectorId"
                validateTrigger="onChange"
                rules={[noWhitespace(t("sectorMustSelect"))]}
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
                    onChange={handleSectorChange} mode="multiple">
                  {options.parcelSectors
                    .filter((p) => parcelSectors.includes(p.id))
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
            <Col className="pt-15" sm={6} xs={24}>
              <h3
                className="bold mt-20 flex all-center"
                style={{ height: "40px" }}
              >
                {t("totalArea")} {area}
                <span>
                  {/*M<sup>2</sup>*/}
                  ha
                </span>
              </h3>
            </Col>
          </Row>
          {tasks.map((d, index) => {
            return (
              <div key={index} className="task1 border mt-15 p-1">
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <div className="w-100  flex-align-center flex flex-between">
                      <h3>
                        {t("task")} {index + 1}
                      </h3>
                      <div className="flex">
                        {tasks.length > 1 ? (
                          <Button
                            className="mr5-5 btn-danger"
                            onClick={() => deleteTask(index)}
                          >
                            {t("delete")}
                          </Button>
                        ) : null}
                        {index === tasks.length - 1 ? (
                          <Button type="primary" onClick={addTask}>
                            {t("addtask")}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label={t("todos")}
                      name={["WorkPlanTasks", index, "ToDoId"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("workMustSelect"))]}
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
                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("startDate")}
                      name={["WorkPlanTasks", index, "startdate"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("dateError"))]}
                    >
                      <DatePicker
                        placeholder={t("selectDate")}
                        className="w-100"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("endDate")}
                      name={["WorkPlanTasks", index, "enddate"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("dateError"))]}
                    >
                      <DatePicker
                        placeholder={t("selectDate")}
                        className="w-100"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name={["WorkPlanTasks", index, "Description"]}
                      validateTrigger="onChange"
                      rules={[whiteSpace(t("inputError"))]}
                    >
                      <TextArea
                        placeholder={t("additionalNote")}
                        allowClear
                        rows={4}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={6} xs={24}>
                    <Form.Item
                      label={t("positions")}
                      name={["WorkPlanTasks", index, "position"]}
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
                          onChange={(e) => handlePositionChange(e, index)}>
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
                  <Col sm={6} xs={24}>
                    <Form.Item
                      label={t("workers")}
                      name={["WorkPlanTasks", index, "respondentId"]}
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
                        {d.workers.map((w, index) => {
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
                      label={t("manWorkerNumber")}
                      name={["WorkPlanTasks", index, "ManWorkerCount"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("numberMustAdd"))]}
                    >
                      <InputNumber className="w-100" />
                    </Form.Item>
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("womanWorkerNumber")}
                      name={["WorkPlanTasks", index, "WomanWorkerCount"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("numberMustAdd"))]}
                    >
                      <InputNumber className="w-100" />
                    </Form.Item>
                  </Col>
                </Row>
                {/*medicine*/}
                {d.medicines.map((m, bindex) => {
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
                                  onClick={() => deleteMedicine(index, bindex)}
                                >
                                  {t("delete")}
                                </Button>
                                {bindex === d.medicines.length - 1 ? (
                                  <Button
                                    onClick={() => addMedicine(index)}
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
                                "WorkPlanTasks",
                                index,
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
                                  handleKeyChange(
                                    e,
                                    index,
                                    bindex,
                                    "medicines",
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
                                "WorkPlanTasks",
                                index,
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
                                  handleKeyChange(
                                    e,
                                    index,
                                    bindex,
                                    "medicines",
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskFertilizers",
                                bindex,
                                "productId",
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
                                  handleKeyChange(
                                    e,
                                    index,
                                    bindex,
                                    "medicines",
                                    "fertilizerId"
                                  );
                                }}
                              >
                                {m.mainIngredientId &&
                                  options.fertilizers
                                    .filter(
                                      (f) =>
                                        f.mainIngredientId ===
                                          m.mainIngredientId &&
                                        f.fertilizerKindId ===
                                          m.fertilizerKindId
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskFertilizers",
                                bindex,
                                "Amount",
                              ]}
                              validateTrigger="onChange"
                              rules={[noWhitespace(t("inputError"))]}
                            >
                              <div className="form-lang">
                                <InputNumber
                                  onChange={(e) =>
                                    handleAmountChange(e, index, bindex)
                                  }
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskFertilizers",
                                bindex,
                                "Quantity",
                              ]}
                            >
                              <div className="form-lang">
                                <InputNumber
                                  value={m.quantity}
                                  className="w-100"
                                  disabled={true}
                                />
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
                {d.tools.map((m, dindex) => {
                  return (
                    <Col xs={24} key={dindex}>
                      <div className="border p-1 mt-5">
                        <Row gutter={[16, 16]}>
                          <Col xs={24}>
                            <div className="w-100  flex-align-center flex flex-between">
                              <h3>Alət {dindex + 1}</h3>
                              <div className="flex">
                                <Button
                                  onClick={() => deleteTool(index, dindex)}
                                  className="mr5-5 btn-danger"
                                >
                                  {t("delete")}
                                </Button>
                                {dindex === d.tools.length - 1 ? (
                                  <Button
                                    onClick={() => addTool(index)}
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskTools",
                                dindex,
                                "toolId",
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskTools",
                                dindex,
                                "quantity",
                              ]}
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
                {d.crops.map((c, cindex) => {
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
                                  onClick={() => deleteCrop(index, cindex)}
                                  className="mr5-5 btn-danger"
                                >
                                  {t("delete")}
                                </Button>
                                {cindex === d.crops.length - 1 ? (
                                  <Button
                                    onClick={() => addCrop(index)}
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskCrops",
                                cindex,
                                "cropCategoryId",
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
                                  handleKeyChange(
                                    e,
                                    index,
                                    cindex,
                                    "crops",
                                    "cropCategoryId"
                                  )
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskCrops",
                                cindex,
                                "cropsId",
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
                                  handleKeyChange(
                                    e,
                                    index,
                                    cindex,
                                    "crops",
                                    "cropsId"
                                  )
                                }
                              >
                                {options.crops
                                  .filter(
                                    (f) => f.categoryId === c.cropCategoryId
                                  )
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskCrops",
                                cindex,
                                "cropSortId",
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
                                  handleKeyChange(
                                    e,
                                    index,
                                    cindex,
                                    "crops",
                                    "cropSortId"
                                  )
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskCrops",
                                cindex,
                                "quantity",
                              ]}
                              validateTrigger="onChange"
                              rules={[noWhitespace(t("inputError"))]}
                            >
                              <div className="form-lang">
                                <InputNumber className="w-100" />
                                <span className="input-lang">
                                  {
                                    options.cropSorts.find(
                                      (f) => f.id === c.cropSortId
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
                {/*crops*/}
                {/*reserves*/}
                {d.reserves.map((r, dindex) => {
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
                                  onClick={() => deleteReserve(index, dindex)}
                                  className="mr5-5 btn-danger"
                                >
                                  {t("delete")}
                                </Button>
                                {dindex === d.reserves.length - 1 ? (
                                  <Button
                                    onClick={() => addReserve(index)}
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskReserves",
                                dindex,
                                "productId",
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
                                  handleKeyChange(
                                    e,
                                    index,
                                    dindex,
                                    "reserves",
                                    "reserveId"
                                  )
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
                              name={[
                                "WorkPlanTasks",
                                index,
                                "WorkPlanTaskReserves",
                                dindex,
                                "quantity",
                              ]}
                              validateTrigger="onChange"
                              rules={[noWhitespace(t("inputError"))]}
                            >
                              <div className="form-lang">
                                <InputNumber className="w-100" />
                                <span className="input-lang">
                                  {
                                    options.reserves.find(
                                      (f) => f.id === r.reserveId
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
                {/*reserves*/}

                <Col xs={24}>
                  <Row gutter={8}>
                    {!d.medicines.length ? (
                      <Col md={6} sm={12} xs={24}>
                        <div>
                          <Button
                            onClick={() => addMedicine(index)}
                            className="w-100 flex all-center mt-5"
                            type="primary"
                          >
                            {t("addMedicine")}
                          </Button>
                        </div>
                      </Col>
                    ) : null}
                    {!d.tools.length ? (
                      <Col md={6} sm={12} xs={24}>
                        <div>
                          <Button
                            onClick={() => addTool(index)}
                            className="w-100 flex all-center mt-5"
                            type="primary"
                          >
                            Alət əlavə et
                          </Button>
                        </div>
                      </Col>
                    ) : null}
                    {!d.crops.length ? (
                      <Col md={6} sm={12} xs={24}>
                        <div>
                          <Button
                            onClick={() => addCrop(index)}
                            className="w-100 flex all-center mt-5"
                            type="primary"
                          >
                            {t("addProduct")}
                          </Button>
                        </div>
                      </Col>
                    ) : null}
                    {!d.reserves.length ? (
                      <Col md={6} sm={12} xs={24}>
                        <div>
                          <Button
                            onClick={() => addReserve(index)}
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
            );
          })}
          <div
            className="modalButtons"
            style={{ position: "absolute", bottom: "20px", right: "40px" }}
          >
            <Button onClick={() => props.setVisibleAddNewPlan(false)}>
              {t("cancel")}
            </Button>
            <Button type="primary" className="ml-10" htmlType="submit">
              {t("save")}
            </Button>
          </div>
        </div>
      </Form>

      <Modal
        title="Tələb yarat"
        visible={confirmDemand}
        onOk={createDemandConfirmed}
        okText="Bəli"
        cancelText="Xeyr"
        onCancel={createDemandCancelled}
      >
        <p>
          Günlük plan yaratmaq üçün çatışmayan resurslar var. Bu resurslar üçün
          tələb yaratmaq istəyirsiniz? Tələb üzrə satınalmalar gerçəkləşdikdən
          sonra plan yarada biləcəksiz.
        </p>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(NewPlan);
