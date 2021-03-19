import React, { useEffect, useState } from "react";
import {
  Col,
  Button,
  Row,
  Input,
  Select,
  InputNumber,
  DatePicker,
  notification,
  Form,
  Modal,
} from "antd";
import { useTranslation } from "react-i18next";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import { whiteSpace, noWhitespace } from "../../../../../utils/rules";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import agros from "../../../../../const/api";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const NewTask = (props) => {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const [confirmDemand, setConfirmDemand] = useState(false);
  const [demandValues, setDemandValues] = useState([]);


  const [periods, setPeriods] = useState([
    {
      id: 0,
      plans: [
        {
          id: 0,
          medicines: [],
          sectors: [{ id: 0 }],
          crops: [],
          reserves: [],
          tools: [],
        },
      ],
    },
  ]);

  const [params, setParams] = useState({});
  const [names, setNames] = useState([]);
  const [name, setName] = useState("");
  const { getOptions, notify } = props;
  const options = props.options[props.lang];


  const createDemandCancelled = () => {
    setConfirmDemand(false);
  };

  const createDemandConfirmed = () => {
    agros
      .post("demand", {
        name: `"${name}" adlı illik plan üçün üçün tələb`,
        demandProduct: demandValues,
      })
      .then((res) => {
        notification.info({
          message: "Əməliyyat uğurlu oldu",
          description: "Yeni tələb yaradıldı",
          icon: <SmileOutlined />,
        });
        form.resetFields();
        props.setVisibleAddNewTask(false);
        setConfirmDemand(false);
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };



  const handleThirdKeyChange = (e, index, second_index, third_index, key) => {
    const all = [...periods];
    all[index]["plans"][second_index]["medicines"][third_index][key] = e;
    setPeriods(all);
  };

  const handleFertilizerAmountChange = (
    e,
    index,
    second_index,
    third_index
  ) => {
    const all = form.getFieldsValue();
    let sum =
      all.annualWorkPlanPeriod[index].annualWorkPlanPeriodTask[second_index][
        "total"
      ] * e;
    all.annualWorkPlanPeriod[index].annualWorkPlanPeriodTask[
      second_index
    ].annualWorkPlanTaskFertilizer[third_index]["quantity"] = sum;
    form.setFieldsValue(all);
    const all2 = [...periods];
    all2[index]["plans"][second_index]["medicines"][third_index][
      "quantity"
    ] = sum;
    setPeriods(all2);
  };

  const handleThirdCropChange = (e, index, second_index, third_index, key) => {
    const all = [...periods];
    all[index]["plans"][second_index]["crops"][third_index][key] = e;
    setPeriods(all);
  };

  const handleThirdReserveChange = (
    e,
    index,
    second_index,
    third_index,
    key
  ) => {
    const all = [...periods];
    all[index]["plans"][second_index]["reserves"][third_index][key] = e;
    setPeriods(all);
  };

  useEffect(() => {
    form.resetFields();
    setPeriods([
      {
        id: 0,
        plans: [
          {
            id: 0,
            medicines: [],
            sectors: [{ id: 0 }],
            crops: [],
            reserves: [],
            tools: [],
          },
        ],
      },
    ]);
    if (props.task) {
      agros.get(`annualworkplan/${props.task}`).then((res) => {
        const pars = { ...params };
        pars["parcelCategoryId"] = res.data.parcelCategoryId;
        setParams(pars);
        let formField = {
          parcelId: res.data.parcelId,
          parcelCategoryId: res.data.parcelCategoryId,
          id: res.data.id,
          name: res.data.name,
          annualWorkPlanPeriod: res.data.annualWorkPlanPeriod.map((a) => {
            return {
              ...a,
              endDate: moment(a.endDate),
              startDate: moment(a.startDate),
            };
          }),
        };
        form.setFieldsValue(formField);
        res.data.annualWorkPlanPeriod.forEach((el) => {
          const all = [...periods];
          all.push({
            id: el.id,
            plans: el.annualWorkPlanPeriodTask.map((el2) => {
              return {
                id: el2.id,
                medicines: el2.annualWorkPlanTaskFertilizer.map((el3) => {
                  return {
                    id: el3.id,
                    mainIngredientId: el3.mainIngredientId,
                    fertilizerKindId: el3.fertilizerKindId,
                  };
                }),
                sectors: el2.annualWorkPlanTaskSector.map((el4) => {
                  return { id: el4.id };
                }),
                crops: el2.annualWorkPlanTaskCrops.map((el5) => {
                  return {
                    id: el5.id,
                    cropCategoryId: el5.cropCategoryId,
                    cropsId: el5.cropsId,
                  };
                }),
                reserves: el2.annualWorkPlanTaskReserves.map((el6) => {
                  return { id: el6.id };
                }),
                tools: el2.annualWorkPlanTaskTools.map((el7) => {
                  return { id: el7.id };
                }),
              };
            }),
          });
          setPeriods(all);
        });
      });
    }
    getOptions(
      [
        "fertilizerKinds",
        "parcelCategories",
        "parcelSectors",
        "parcels",
        "mainIngredients",
        "todos",
        "fertilizers",
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
  }, [t, props.task]);

  const addPeriod = () => {
    const all = [...periods];
    const id = periods.length ? periods[periods.length - 1].id + 1 : 0;
    all.push({ id, plans: [] });
    setPeriods(all);
  };
  const deletePeriod = (index) => {
    const all = [...periods];
    all.splice(index, 1);
    setPeriods(all);
  };



  const addPlan = (index) => {
    const all = [...periods];
    const id = all[index].plans.length
      ? all[index].plans[all[index].plans.length - 1].id + 1
      : 0;
    all[index].plans.push({
      id,
      medicines: [],
      sectors: [],
      crops: [],
      reserves: [],
      tools: [],
    });
    setPeriods(all);
  };
  const deletePlan = (index, pindex) => {
    const all = [...periods];
    all[index].plans.splice(pindex, 1);
    setPeriods(all);
  };

  const addMedicine = (index, pindex) => {
    const all = [...periods];
    const id = all[index].plans[pindex].length
      ? all[index].plans[pindex].medicines[
          all[index].plans[pindex].medicines.length - 1
        ].id + 1
      : 0;
    all[index].plans[pindex].medicines.push({ id });
    setPeriods(all);
  };
  const deleteMedicine = (index, pindex, mindex) => {
    const all = [...periods];
    all[index].plans[pindex].medicines.splice(mindex, 1);
    setPeriods(all);
  };

  const addCrop = (index, pindex) => {
    const all = [...periods];
    const id = all[index].plans[pindex].length
      ? all[index].plans[pindex].crops[
          all[index].plans[pindex].crops.length - 1
        ].id + 1
      : 0;
    all[index].plans[pindex].crops.push({ id });
    setPeriods(all);
  };
  const deleteCrop = (index, pindex, mindex) => {
    const all = [...periods];
    all[index].plans[pindex].crops.splice(mindex, 1);
    setPeriods(all);
  };

  const addReserve = (index, pindex) => {
    const all = [...periods];
    const id = all[index].plans[pindex].length
      ? all[index].plans[pindex].reserves[
          all[index].plans[pindex].reserves.length - 1
        ].id + 1
      : 0;
    all[index].plans[pindex].reserves.push({ id });
    setPeriods(all);
  };
  const deleteReserve = (index, pindex, mindex) => {
    const all = [...periods];
    all[index].plans[pindex].reserves.splice(mindex, 1);
    setPeriods(all);
  };

  const addTool = (index, pindex) => {
    const all = [...periods];
    const id = all[index].plans[pindex].length
      ? all[index].plans[pindex].tools[
          all[index].plans[pindex].tools.length - 1
        ].id + 1
      : 0;
    all[index].plans[pindex].tools.push({ id });
    setPeriods(all);
  };
  const deleteTool = (index, pindex, sindex) => {
    const all = [...periods];
    all[index].plans[pindex].tools.splice(sindex, 1);
    setPeriods(all);
  };

  const handleParcelCategoryChange = (e) => {
    let all = { ...params };
    all["parcelCategoryId"] = e;
    setParams(all);

    form.setFieldsValue({ parcelId: undefined });
  };

  const handleParcelChange = (e) => {
    let all = { ...params };
    all["parcelId"] = e;
    setParams(all);
    const all2 = [...periods];
    setPeriods(all2);
  };

  const handleParcelSectorChange = (e, index, pindex) => {
    const ids = e.map((a) => +a);
    const sects = options.parcelSectors.filter((s) => ids.includes(s.id));
    let sum = 0;
    sects.forEach((sec) => {
      sum += sec.area;
    });
    const all = form.getFieldsValue();
    all.annualWorkPlanPeriod[index].annualWorkPlanPeriodTask[pindex][
      "total"
    ] = sum;
    form.setFieldsValue(all);
  };

  const cancelNewTask = () => {
    form.resetFields();
    props.setVisibleAddNewTask(false);
  };



  const saveItem = (values) => {
    if (props.task) {
      values.annualWorkPlanPeriod.forEach((p) => {
        p.annualWorkPlanPeriodTask.forEach((t) => {
          t.annualWorkPlanTaskSectors = t.annualWorkPlanTaskSectors.map((s) => {
            return { ParcelSectorId: +s };
          });
        });
      });
      agros
        .put("annualworkplan" + props.task, { ...values })
        .then(() => {
          notify("Planda düzəliş edildi", true);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    } else {
      agros
        .post("annualworkplan", { ...values, name: values.fieldName })
        .then((res) => {
          if (res.data && res.data.demands.length) {
            setName(values.fieldName);
            setConfirmDemand(true);
            setDemandValues(res.data.demands);
            notification.info({
              message: "Əməliyyat uğurlu oldu",
              description:
                "Lakin çatışmayan resurslar var. Onları əldə etmək üçün tələb yarada bilərsiniz.",
              icon: <FrownOutlined />,
            });
          } else {
            notify(t("planIsAdded"), true);
          }
          form.resetFields();
          setPeriods([{ id: 0, plans: [] }]);
          props.setVisibleAddNewTask(false);
          props.triggerFetch();
        })
        .catch((err) => {
          notify(err.response, false);
        });
    }
  };

  const handleNameChange = (e) => {
    let names = options.todos.filter((c) =>
      c.name.toUpperCase().includes(e.toUpperCase())
    );
    names.unshift({ id: null, name: e });
    setNames(names);
  };
  return (
    <>
      <Form onFinish={saveItem} form={form} layout="vertical">
        <div className="commontask">
          <Row gutter={[16, 16]}>
            <Col sm={13} xs={24}>
              <Form.Item
                label={t("WorkPlanName")}
                validateTrigger="onChange"
                name="fieldName"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select
                  showSearch
                  onSearch={handleNameChange}
                  notFoundContent={null}
                >
                  {names.map((n, nindex) => {
                    return (
                      <Option key={nindex} value={n.name}>
                        {n.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={12} xs={24}>
              <Form.Item
                label={t("areaType")}
                name="parcelCategoryId"
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
                    onChange={handleParcelCategoryChange}>
                  {options.parcelCategories.map((pc) => {
                    return (
                      <Option key={pc.id} value={pc.id}>
                        {pc.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} sm={12} xs={24}>
              <Form.Item
                label={t("area")}
                name="parcelId"
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
                  disabled={!params.parcelCategoryId}
                  onChange={handleParcelChange}
                >
                  {options.parcels
                    .filter(
                      (p) => p.parcelCategoryId === params.parcelCategoryId
                    )
                    .map((pc) => {
                      return (
                        <Option key={pc.id} value={pc.id}>
                          {pc.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!periods.length ? (
            <Button onClick={addPeriod} type="primary">
              {t("addPeriod")}
            </Button>
          ) : null}

          {/*add task*/}
          {periods.map((p, index) => {
            return (
              <div key={index} className="task1 border mt-15 p-1">
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <div className="w-100  flex-align-center flex flex-between">
                      <h3>Dövr {index + 1}</h3>
                      <div className="flex">
                        {periods.length > 1 ? (
                          <Button
                            onClick={() => deletePeriod(index)}
                            className="mr5-5 btn-danger"
                          >
                            {t("delete")}
                          </Button>
                        ) : null}
                        {index === periods.length - 1 ? (
                          <Button onClick={addPeriod} type="primary">
                            {t("addPeriod")}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                  <Col md={6} sm={12} xs={24}>
                    <Form.Item
                      label={t("startDate")}
                      name={["annualWorkPlanPeriod", index, "startDate"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
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
                      name={["annualWorkPlanPeriod", index, "endDate"]}
                      validateTrigger="onChange"
                      rules={[noWhitespace(t("inputError"))]}
                    >
                      <DatePicker
                        placeholder={t("selectDate")}
                        className="w-100"
                      />
                    </Form.Item>
                  </Col>

                  {p.plans.map((pl, pindex) => {
                    return (
                      <Col xs={24} key={pindex}>
                        <div className="medicine1 m-10 p-1 border">
                          <Row gutter={[16, 16]}>
                            <Col xs={24}>
                              <div className="w-100  flex-align-center flex flex-between">
                                <h3>
                                  {t("workPlanWillDone")} {pindex + 1}
                                </h3>
                                <div className="flex">
                                  {p.plans.length > 1 ? (
                                    <Button
                                      onClick={() => deletePlan(index, pindex)}
                                      className="mr5-5 btn-danger"
                                    >
                                      {t("delete")}
                                    </Button>
                                  ) : null}
                                  {p.plans.length &&
                                  pindex === p.plans.length - 1 ? (
                                    <Button
                                      onClick={() => addPlan(index)}
                                      type="primary"
                                    >
                                      {t("addWorkWillDonw")}
                                    </Button>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                            <Col md={6} xs={24}>
                              <Form.Item
                                label={t("workWillDone")}
                                name={[
                                  "annualWorkPlanPeriod",
                                  index,
                                  "annualWorkPlanPeriodTask",
                                  pindex,
                                  "toDoId",
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
                                  {options.todos.map((pc) => {
                                    return (
                                      <Option key={pc.id} value={pc.id}>
                                        {pc.name}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col md={3} sm={12} xs={24}>
                              <Form.Item
                                label={t("manWorkerNumber")}
                                name={[
                                  "annualWorkPlanPeriod",
                                  index,
                                  "annualWorkPlanPeriodTask",
                                  pindex,
                                  "manCount",
                                ]}
                                validateTrigger="onChange"
                                rules={[noWhitespace(t("inputError"))]}
                              >
                                <InputNumber className="w-100" />
                              </Form.Item>
                            </Col>

                            <Col md={3} sm={12} xs={24}>
                              <Form.Item
                                label={t("womanWorkerNumber")}
                                name={[
                                  "annualWorkPlanPeriod",
                                  index,
                                  "annualWorkPlanPeriodTask",
                                  pindex,
                                  "womanCount",
                                ]}
                                validateTrigger="onChange"
                                rules={[noWhitespace(t("inputError"))]}
                              >
                                <InputNumber className="w-100" />
                              </Form.Item>
                            </Col>

                            <Col md={8} sm={12} xs={24}>
                              <Form.Item
                                label={t("sector")}
                                name={[
                                  "annualWorkPlanPeriod",
                                  index,
                                  "annualWorkPlanPeriodTask",
                                  pindex,
                                  "parcelSectors",
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
                                    handleParcelSectorChange(e, index, pindex)
                                  }
                                  disabled={!params.parcelId}
                                  mode="multiple"
                                >
                                  {options.parcelSectors
                                    .filter(
                                      (p) => p.parcelId === params.parcelId
                                    )
                                    .map((pc, index) => {
                                      return (
                                        <Option
                                          key={index}
                                          value={pc.id.toString()}
                                        >
                                          {pc.name}
                                        </Option>
                                      );
                                    })}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col md={4}>
                              <div className="form-lang">
                                <Form.Item
                                  label="Ümumi sahə"
                                  name={[
                                    "annualWorkPlanPeriod",
                                    index,
                                    "annualWorkPlanPeriodTask",
                                    pindex,
                                    "total",
                                  ]}
                                >
                                  <Input value={pl.area} disabled={true} />
                                </Form.Item>
                                <span className="input-lang btm">ha</span>
                              </div>
                            </Col>

                            <Col xs={24}>
                              <Form.Item
                                name={[
                                  "annualWorkPlanPeriod",
                                  index,
                                  "annualWorkPlanPeriodTask",
                                  pindex,
                                  "description",
                                ]}
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

                            {pl.medicines.map((m, mindex) => {
                              return (
                                <Col xs={24} key={mindex}>
                                  <div className="border p-1">
                                    <Row gutter={[16, 16]}>
                                      <Col xs={24}>
                                        <div className="w-100  flex-align-center flex flex-between">
                                          <h3>
                                            {t("medicine")} {mindex + 1}
                                          </h3>
                                          <div className="flex">
                                            <Button
                                              onClick={() =>
                                                deleteMedicine(
                                                  index,
                                                  pindex,
                                                  mindex
                                                )
                                              }
                                              className="mr5-5 btn-danger"
                                            >
                                              {t("delete")}
                                            </Button>
                                            {pl.medicines.length &&
                                            mindex ===
                                              pl.medicines.length - 1 ? (
                                              <Button
                                                onClick={() =>
                                                  addMedicine(index, pindex)
                                                }
                                                type="primary"
                                              >
                                                {t("addMedicine")}
                                              </Button>
                                            ) : null}
                                          </div>
                                        </div>
                                      </Col>
                                      <Col md={6} sm={12} xs={24}>
                                        <Form.Item
                                          label={t("typeOf")}
                                          name={[
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskFertilizer",
                                            mindex,
                                            "fertilizerKindId",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
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
                                              handleThirdKeyChange(
                                                e,
                                                index,
                                                pindex,
                                                mindex,
                                                "fertilizerKindId"
                                              )
                                            }
                                          >
                                            {options.fertilizerKinds.map(
                                              (f) => {
                                                return (
                                                  <Option
                                                    key={f.id}
                                                    value={f.id}
                                                  >
                                                    {f.name}
                                                  </Option>
                                                );
                                              }
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col md={6} sm={12} xs={24}>
                                        <Form.Item
                                          label={t("activeSubstance")}
                                          name={[
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskFertilizer",
                                            mindex,
                                            "mainIngredientId",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
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
                                            { handleThirdKeyChange(
                                                e,
                                                index,
                                                pindex,
                                                mindex,
                                                "mainIngredientId"
                                            );
                                              }
                                            }
                                          >
                                            {options.mainIngredients.filter(
                                                (f) =>
                                                    f.categoryId ===
                                                    m.fertilizerKindId
                                            ).map(
                                              (mi, miindex) => {
                                                return (
                                                  <Option
                                                    key={miindex}
                                                    value={mi.id}
                                                  >
                                                    {mi.name}
                                                  </Option>
                                                );
                                              }
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col md={6} sm={12} xs={24}>
                                        <Form.Item
                                          label={t("name")}
                                          name={[
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskFertilizer",
                                            mindex,
                                            "productId",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
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
                                              handleThirdKeyChange(
                                                e,
                                                index,
                                                pindex,
                                                mindex,
                                                "fertilizerId"
                                              )
                                            }
                                          >
                                            {options.fertilizers
                                              .filter(
                                                (f) =>
                                                  f.mainIngredientId ===
                                                    m.mainIngredientId &&
                                                  f.fertilizerKindId ===
                                                    m.fertilizerKindId
                                              )
                                              .map((f, findex) => {
                                                return (
                                                  <Option
                                                    key={findex}
                                                    value={f.id}
                                                  >
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
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskFertilizer",
                                            mindex,
                                            "amount",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
                                        >
                                          <div className="form-lang">
                                            <InputNumber
                                              className="w-100"
                                              onChange={(e) =>
                                                handleFertilizerAmountChange(
                                                  e,
                                                  index,
                                                  pindex,
                                                  mindex,
                                                  "amount"
                                                )
                                              }
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
                                      <Col md={6} sm={12} xs={24}>
                                        <Form.Item
                                          label={t("finalAmount")}
                                          name={[
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskFertilizer",
                                            mindex,
                                            "quantity",
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

                            {pl.crops.map((m, mindex) => {
                              return (
                                <Col xs={24} key={mindex}>
                                  <div className="border p-1">
                                    <Row gutter={[16, 16]}>
                                      <Col xs={24}>
                                        <div className="w-100  flex-align-center flex flex-between">
                                          <h3>
                                            {t("product")} {mindex + 1}
                                          </h3>
                                          <div className="flex">
                                            <Button
                                              onClick={() =>
                                                deleteCrop(
                                                  index,
                                                  pindex,
                                                  mindex
                                                )
                                              }
                                              className="mr5-5 btn-danger"
                                            >
                                              {t("delete")}
                                            </Button>
                                            {pl.crops.length &&
                                            mindex === pl.crops.length - 1 ? (
                                              <Button
                                                onClick={() =>
                                                  addCrop(index, pindex)
                                                }
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
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskCrops",
                                            mindex,
                                            "cropCategoryId",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
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
                                              handleThirdCropChange(
                                                e,
                                                index,
                                                pindex,
                                                mindex,
                                                "cropCategoryId"
                                              )
                                            }
                                          >
                                            {options.cropCategories.map(
                                              (f, findex) => {
                                                return (
                                                  <Option
                                                    key={findex}
                                                    value={f.id}
                                                  >
                                                    {f.name}
                                                  </Option>
                                                );
                                              }
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>

                                      <Col md={6} sm={12} xs={24}>
                                        <Form.Item
                                          label={t("product")}
                                          name={[
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskCrops",
                                            mindex,
                                            "cropsId",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
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
                                              handleThirdCropChange(
                                                e,
                                                index,
                                                pindex,
                                                mindex,
                                                "cropsId"
                                              )
                                            }
                                          >
                                            {options.crops
                                              .filter(
                                                (f) =>
                                                  f.categoryId ===
                                                  m.cropCategoryId
                                              )
                                              .map((f, findex) => {
                                                return (
                                                  <Option
                                                    key={findex}
                                                    value={f.id}
                                                  >
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
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskCrops",
                                            mindex,
                                            "cropSortId",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
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
                                              handleThirdCropChange(
                                                e,
                                                index,
                                                pindex,
                                                mindex,
                                                "cropSortId"
                                              )
                                            }
                                          >
                                            {options.cropSorts
                                              .filter(
                                                (f) =>
                                                  f.categoryId === m.cropsId
                                              )
                                              .map((f, findex) => {
                                                return (
                                                  <Option
                                                    key={findex}
                                                    value={f.id}
                                                  >
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
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskCrops",
                                            mindex,
                                            "quantity",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
                                        >
                                          <div className="form-lang">
                                            <InputNumber className="w-100" />
                                            <span className="input-lang">
                                              {
                                                options.cropSorts.find(
                                                  (c) => c.id === m.cropSortId
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

                            {pl.reserves.map((m, mindex) => {
                              return (
                                <Col xs={24} key={mindex}>
                                  <div className="border p-1">
                                    <Row gutter={[16, 16]}>
                                      <Col xs={24}>
                                        <div className="w-100  flex-align-center flex flex-between">
                                          <h3>
                                            {t("reserv")} {mindex + 1}
                                          </h3>
                                          <div className="flex">
                                            <Button
                                              onClick={() =>
                                                deleteReserve(
                                                  index,
                                                  pindex,
                                                  mindex
                                                )
                                              }
                                              className="mr5-5 btn-danger"
                                            >
                                              {t("delete")}
                                            </Button>
                                            {pl.reserves.length &&
                                            mindex ===
                                              pl.reserves.length - 1 ? (
                                              <Button
                                                onClick={() =>
                                                  addReserve(index, pindex)
                                                }
                                                type="primary"
                                              >
                                                {t("addReserve")}
                                              </Button>
                                            ) : null}
                                          </div>
                                        </div>
                                      </Col>

                                      <Col md={12} sm={12} xs={24}>
                                        <Form.Item
                                          label={t("reserv")}
                                          name={[
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskReserves",
                                            mindex,
                                            "productId",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
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
                                              handleThirdReserveChange(
                                                e,
                                                index,
                                                pindex,
                                                mindex,
                                                "reserveId"
                                              )
                                            }
                                          >
                                            {options.reserves.map(
                                              (f, findex) => {
                                                return (
                                                  <Option
                                                    key={findex}
                                                    value={f.id}
                                                  >
                                                    {f.name}
                                                  </Option>
                                                );
                                              }
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col md={12} sm={12} xs={24}>
                                        <Form.Item
                                          label={t("quantity")}
                                          name={[
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskReserves",
                                            mindex,
                                            "quantity",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
                                        >
                                          <div className="form-lang">
                                            <InputNumber className="w-100" />
                                            <span className="input-lang">
                                              {
                                                options.reserves.find(
                                                  (f) => f.id === m.reserveId
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

                            {pl.tools.map((m, mindex) => {
                              return (
                                <Col xs={24} key={mindex}>
                                  <div className="border p-1">
                                    <Row gutter={[16, 16]}>
                                      <Col xs={24}>
                                        <div className="w-100  flex-align-center flex flex-between">
                                          <h3>Alət {mindex + 1}</h3>
                                          <div className="flex">
                                            <Button
                                              onClick={() =>
                                                deleteTool(
                                                  index,
                                                  pindex,
                                                  mindex
                                                )
                                              }
                                              className="mr5-5 btn-danger"
                                            >
                                              {t("delete")}
                                            </Button>
                                            {pl.tools.length &&
                                            mindex === pl.tools.length - 1 ? (
                                              <Button
                                                onClick={() =>
                                                  addTool(index, pindex)
                                                }
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
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskTools",
                                            mindex,
                                            "toolId",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
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
                                                <Option
                                                  key={findex}
                                                  value={f.id}
                                                >
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
                                            "annualWorkPlanPeriod",
                                            index,
                                            "annualWorkPlanPeriodTask",
                                            pindex,
                                            "annualWorkPlanTaskTools",
                                            mindex,
                                            "quantity",
                                          ]}
                                          validateTrigger="onChange"
                                          rules={[
                                            noWhitespace(t("inputError")),
                                          ]}
                                        >
                                          <InputNumber className="w-100" />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              );
                            })}

                            <Col xs={24}>
                              <Row gutter={8}>
                                {!pl.medicines.length ? (
                                  <Col md={5} sm={12} xs={24}>
                                    <div>
                                      <Button
                                        onClick={() =>
                                          addMedicine(index, pindex)
                                        }
                                        className="w-100 flex all-center formButton"
                                        type="primary"
                                      >
                                        {t("addMedicine")}
                                      </Button>
                                    </div>
                                  </Col>
                                ) : null}
                                {!pl.crops.length ? (
                                  <Col md={5} sm={12} xs={24}>
                                    <div>
                                      <Button
                                        onClick={() => addCrop(index, pindex)}
                                        className="w-100 flex all-center formButton"
                                        type="primary"
                                      >
                                        {t("addProduct")}
                                      </Button>
                                    </div>
                                  </Col>
                                ) : null}
                                {!pl.reserves.length ? (
                                  <Col md={5} sm={12} xs={24}>
                                    <div>
                                      <Button
                                        onClick={() =>
                                          addReserve(index, pindex)
                                        }
                                        className="w-100 flex all-center formButton"
                                        type="primary"
                                      >
                                        {t("addReserve")}
                                      </Button>
                                    </div>
                                  </Col>
                                ) : null}
                                {!pl.tools.length ? (
                                  <Col md={4} sm={12} xs={24}>
                                    <div>
                                      <Button
                                        onClick={() => addTool(index, pindex)}
                                        className="w-100 flex all-center formButton"
                                        type="primary"
                                      >
                                        Alət əlavə et
                                      </Button>
                                    </div>
                                  </Col>
                                ) : null}
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    );
                  })}

                  {/*work plan*/}
                  {!p.plans.length ? (
                    <Col md={6} sm={12} xs={24}>
                      <div>
                        <Button
                          onClick={() => addPlan(index)}
                          className="w-100 flex all-center formButton"
                          type="primary"
                        >
                          {t("addWorkWillDonw")}
                        </Button>
                      </div>
                    </Col>
                  ) : null}
                </Row>
              </div>
            );
          })}
          <div
            className="modalButtons"
            style={{ position: "absolute", bottom: "20px", right: "30px" }}
          >
            <Button onClick={() => cancelNewTask()}>{t("cancel")}</Button>
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
          Plan yaratmaq üçün çatışmayan resurslar var. Bu resurslar üçün tələb
          yaratmaq istəyirsiniz? Tələb üzrə satınalmalar gerçəkləşdikdən sonra
          plan yarada biləcəksiz.
        </p>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(NewTask);
