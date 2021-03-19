import React, { useEffect, useState } from "react";
import {
  DatePicker,
  Col,
  Input,
  InputNumber,
  Form,
  Row,
  Select,
  Button,
} from "antd";
import { connect } from "react-redux";
import { getOptions, notify } from "./../../../../../redux/actions";
import { useTranslation } from "react-i18next";
import moment from "moment";
import agros from "../../../../../const/api";
import { noWhitespace, whiteSpace } from "../../../../../utils/rules";
const { Option } = Select;

const EditArea = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [sectors, setSectors] = useState([]);
  const [showTree , setShowtree] = useState(true)
  const [workers, setWorkers] = useState([]);
  const [keys, setKeys] = useState({});
  const [sectorsSum, setSectorsSum] = useState(0);

  const [names, setNames] = useState([]);

  const { getOptions, notify } = props;
  const options = props.options[props.lang];

  const handleKeyChange = (e, key) => {
    const all = { ...keys };
    console.log(all)
    all[key] = e;
    setKeys(all);
  };


  const handleKeyChangeIndex = (e, index, key) => {
    const all = [...sectors];
    sectors[index][key] = e;
    setSectors(all);
  };

  const handleNameChange = (e) => {
    let names = options.crops.filter((c) =>
      c.name.toUpperCase().includes(e.toUpperCase())
    );
    names.unshift({ id: null, name: e });
    setNames(names);
  };

  useEffect(() => {
    getOptions(
      [
        "cropCategories",
        "cropSorts",
        "crops",
        "positions",
        "parcelRegions",
        "parcelCategories",
      ],
      props.options,
      i18n.language
    );

    form.resetFields();

    if (props.editing) {
      agros.get(`parcel/${props.editing}`).then((res) => {
        console.log(res);
        setNames([{ name: res.data.name }]);
        let obj = {
          ...res.data,
          fieldName: res.data.name,
          profession: res.data.professionId,
          createdDate: moment(res.data.createdDate),
        };
        form.setFieldsValue(obj);
        onProfessionChange(res.data.professionId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, props.editing]);

  const onProfessionChange = async (e) => {
    setWorkers([]);
    await agros.get("data/workers/" + e).then((res) => {
      let all = { ...workers };
      all = res.data;
      setWorkers(all);
      form.setFieldsValue({ respondedUser: undefined });
    });
  };

  const addSector = () => {
    const all = [...sectors];
    const id = all.length ? all[all.length - 1].id + 1 : 0;
    all.push({ id });
    setSectors(all);
  };

  const removeSector = (index) => {
    const all = [...sectors];
    all.splice(index, 1);
    setSectors(all);
  };

  const setSectorArea = (e, index) => {
    const all = [...sectors];
    all[index]["area"] = +e;
    setSectors(all);
    calculateSectorsSum();
  };

  const selectedParcelCategory = (value) =>{
    value === 2  ? setShowtree(false) :  setShowtree(true)
    handleKeyChange(value, "parcelCategoryId")
  }

  const calculateSectorsSum = () => {
    let sum = 0;
    sectors.forEach((element) => {
      sum += element.area;
    });
    form.setFieldsValue({ sectorsTotal: sum });
    setSectorsSum(sum);
    console.log(sectorsSum);
  };

  const saveItem = async (values) => {
    if (props.editing) {
      agros
        .put(`parcel/${props.editing}`, {
          ...values,
          name: values.fieldName,
          id: props.editing,
        })
        .then(() => {
          notify("Düzəliş edildi", true);
          form.resetFields();
          props.triggerFetch();
          props.setVisibleAddArea(false);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    } else {
      await agros
        .post("parcel", { ...values, name: values.fieldName })
        .then(() => {
          notify(t("areaIsAdded"), true);
          form.resetFields();
          props.triggerFetch();
          props.setVisibleAddArea(false);
        })
        .catch((err) => {
          notify(err.response, false);
        });
    }
  };

  return (
    <Form form={form} onFinish={saveItem} layout="vertical">
      <Row gutter={[8, 8]}>
        <Col md={6} sm={12} xs={24}>
          <Form.Item
            label={t("region")}
            validateTrigger="onChange"
            name="parcelRegionId"
            rules={[noWhitespace(t("regionMustSelectError"))]}
          >
            <Select>
              {options.parcelRegions.map((pr, index) => {
                return (
                  <Option key={index} value={pr.id}>
                    {pr.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>

        <Col md={6} sm={12} xs={24}>
          <Form.Item
            label="Ərazinin kateqoriyası"
            validateTrigger="onChange"
            name="parcelCategoryId"
            rules={[noWhitespace(t("categoryMustSelectError"))]}
          >
            <Select onChange={(value)=>{selectedParcelCategory(value)}}>
              {options.parcelCategories.map((pr, index) => {
                return (
                  <Option key={index} value={pr.id}>
                    {pr.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>

        <Col md={6} sm={12} xs={24}>
          <Form.Item
            label="Ərazinin adı"
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

        {!props.editing && (
          <Col md={6} sm={12} xs={24}>
            <Form.Item
              label="Məhsulların kateqoriyası"
              validateTrigger="onChange"
              name="cropCategoryId"
              rules={[noWhitespace(t("categoryMustSelectError"))]}
            >
              <Select onChange={(e) => handleKeyChange(e, "categoryId")}>
                {options.cropCategories
                    .filter((pr) => pr.parcelCategoryId === keys.parcelCategoryId)
                    .map((pr, index) => {
                  return (
                    <Option key={index} value={pr.id}>
                      {pr.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        )}

        <Col md={4} sm={12} xs={24}>
          <div className="form-lang">
            <Form.Item
              label="Ərazi"
              validateTrigger="onChange"
              name="area"
              rules={[noWhitespace(t("inputError"))]}
            >
              <InputNumber className="w-100" />
            </Form.Item>
            <span className="input-lang btm">
              ha
            </span>{" "}
          </div>
        </Col>

        <Col md={4} sm={12} xs={24}>
          <div className="form-lang">
            <Form.Item label="Sektorların cəmi sahəsi" name="sectorsTotal">
              <InputNumber
                value={sectorsSum}
                disabled={true}
                className="w-100"
              />
            </Form.Item>
            <span className="input-lang btm">
              ha
            </span>{" "}
          </div>
        </Col>



        <Col md={6} sm={12} xs={24}>
          <Form.Item
            label="Cavabdeh şəxsin vəzifəsi"
            validateTrigger="onChange"
            name="profession"
            rules={[noWhitespace(t("inputError"))]}
          >
            <Select onChange={onProfessionChange}>
              {options.positions.map((pr, index) => {
                return (
                  <Option key={index} value={pr.id}>
                    {pr.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>

        <Col md={6} sm={12} xs={24}>
          <Form.Item
            label={t("respondentPeople")}
            validateTrigger="onChange"
            name="respondentId"
            rules={[noWhitespace(t("inputError"))]}
          >
            <Select>
              {workers.map((pr, index) => {
                return (
                  <Option key={index} value={pr.id}>
                    {pr.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>

        <Col md={4} sm={12} xs={24}>
          <Form.Item
            label={t("createdDate")}
            validateTrigger="onChange"
            name="createdDate"
            rules={[noWhitespace(t("inputError"))]}
          >
            <DatePicker className="w-100" />
          </Form.Item>
        </Col>

        {/*sektor*/}
        <Col className="mt-10" xs={24}>
          {!props.editing &&
            sectors.map((s, index) => {
              return (
                <div key={index} className="border p-2">
                  <Row gutter={[8, 8]}>
                    <Col xs={24}>
                      <div className="w-100  flex-align-center flex flex-between">
                        <h3>
                          {t("sector")} {index + 1}
                        </h3>
                        <div className="flex">
                          <Button
                            className="mr5-5 btn-danger"
                            onClick={() => removeSector(index)}
                          >
                            {t("delete")}
                          </Button>
                        </div>
                      </div>
                    </Col>

                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                        label={t("sectorName")}
                        validateTrigger="onChange"
                        name={["ParcelSectors", index, "name"]}
                        rules={[whiteSpace(t("inputError"))]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                        label={t("sectorArea")}
                        validateTrigger="onChange"
                        name={["ParcelSectors", index, "Area"]}
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <div className="form-lang">
                          <InputNumber
                            onChange={(e) => setSectorArea(e, index)}
                            className="w-100"
                          />
                          <span className="input-lang">
                            {/*m<sup>2</sup>*/}
                            ha
                          </span>
                        </div>
                      </Form.Item>
                    </Col>
                    {showTree &&
                    <Col md={4} sm={12} xs={24}>
                      <Form.Item
                        label={t("treeNumber")}
                        validateTrigger="onChange"
                        name={["ParcelSectors", index, "TreeCount"]}
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <InputNumber className="w-100" />
                      </Form.Item>
                    </Col>
                    }

                    <Col md={showTree ? 4 : 8} sm={12} xs={24}>
                      <Form.Item
                        label={t("createdDate")}
                        validateTrigger="onChange"
                        name={["ParcelSectors", index, "CreatedDate"]}
                        rules={[noWhitespace(t("dateError"))]}
                      >
                        <DatePicker
                          placeholder={t("selectDate")}
                          className="w-100"
                        />
                      </Form.Item>
                    </Col>

                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                        label={t("product")}
                        name={["ParcelSectors", index, "productId"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select
                          onChange={(e) =>
                            handleKeyChangeIndex(e, index, "productId")
                          }
                        >
                          {options.crops
                            .filter((c) => c.categoryId === keys.categoryId)
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
                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                        label="Məhsul sortları"
                        name={["ParcelSectors", index, "CropSortIds"]}
                        validateTrigger="onChange"
                        rules={[noWhitespace(t("inputError"))]}
                      >
                        <Select mode="multiple" allowClear>
                          {options.cropSorts
                            .filter((c) => c.categoryId === s.productId)
                            .map((c, index) => {
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
                    <Col md={8} sm={12} xs={24}>
                      <Form.Item
                          label={t("company")}
                          validateTrigger="onChange"
                          name={["ParcelSectors", index, "createdCompany"]}
                          rules={[whiteSpace(t("inputError"))]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              );
            })}
        </Col>

        {!props.editing && (
          <Col xs={24}>
            <Button type="primary" onClick={addSector}>
              {t("addSector")}
            </Button>
          </Col>
        )}
      </Row>
      <div
        className="modalButtons"
        style={{ position: "absolute", bottom: "20px", right: "40px" }}
      >
        <Button onClick={() => props.setVisibleAddArea(false)}>
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

export default connect(mapStateToProps, { getOptions, notify })(EditArea);
