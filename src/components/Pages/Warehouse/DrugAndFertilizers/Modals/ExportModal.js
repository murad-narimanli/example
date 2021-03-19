import React, { useState, useEffect } from "react";
import { Button, Col, Input, Row, Table, Form, Select } from "antd";
import moment from "moment";
import agros from "../../../../../const/api";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../../utils/columnconverter";
import { getOptions, notify } from "../../../../../redux/actions";
import { noWhitespace, whiteSpace } from "../../../../../utils/rules";

const { Option } = Select;

const ExportModal = (props) => {
  const { t, i18n } = useTranslation();

  const cols = [
    { key: "productName", value: t("name"), con: true },
    { key: "fertilizerKind", value: t("typeOf"), con: true },
    { key: "mainIngredient", value: t("activeSubstance"), con: true },
    { key: "quantity", value: t("quantityOf"), con: true },
    { key: "price", value: t("price"), con: true },
    { key: "documentNumber", value: t("documentNumber"), con: true },
    { key: "warehouseName", value: t("warehouse"), con: true },
    { key: "quantity", value: t("quantity"), con: true },
    { key: "operation", value: t("operation"), con: true },
    { key: "productName", value: t("productName"), con: true },
    { key: "takenPerson", value: t("person"), con: true },
    { key: "expireDate", value: t("expirationDate"), con: false },
    { key: "usedStatus", value: "", con: false },
    { key: "index", value: "", con: false },
  ];

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const { notify } = props;
  const [data, setData] = useState([]);
  const [params, setParams] = useState({});
  const [stockId, setStockId] = useState(null);
  const setStock = (selectedRows) => {
    setStockId(selectedRows[0].id);
  };

  const [vals, setVals] = useState({});

  const handleKeyChange = (e, key) => {
    const all = { ...vals };
    all[key] = e;
    setVals(all);
  };

  const { getOptions } = props;
  const options = props.options[props.lang];

  const handleParamChange = (e, key) => {
    let par = { ...params };
    par[key] = e;
    setParams(par);
  };
  useEffect(() => {
    getOptions(
      [
        "fertilizerKinds",
        "mainIngredients",
        "fertilizers",
        "parcels",
        "parcelCategories",
        "parcelSectors",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // table data columns
  const columns = [
    {
      title: t("name"),
      key: 1,
      dataIndex: "productName",
    },
    {
      title: t("typeOf"),
      key: 2,
      dataIndex: "fertilizerKind",
    },
    {
      title: t("activeSubstance"),
      key: 3,
      dataIndex: "mainIngredient",
    },
    {
      title: t("quantityOf"),
      key: 4,
      dataIndex: "quantity",
    },
    {
      title: t("expirationDate"),
      key: 5,
      dataIndex: "expireDate",
      render: (d) => <span>{moment(d).format("DD-MM-YYYY")}</span>,
    },
    {
      title: t("price"),
      key: 6,
      dataIndex: "price",
    },
    {
      title: t("warehouse"),
      key: 7,
      dataIndex: "warehouseName",
    },
    {
      title: t("status"),
      key: 8,
      dataIndex: "usedStatus",
      render: (i) => {
        return (
          <div className="flex statusTd">
            <p>{t("status")}</p>
            {i ? (
              <p className="text-primary">{t("isUsed")}</p>
            ) : (
              <p className="text-danger">{t("isNotUsed")}</p>
            )}
          </div>
        );
      },
    },
  ];

  const getData = () => {
    agros
      .get(
        `medicalstock/export?productId=${params.productId}&&mainIngredientId=${params.mainIngredientId}`
      )
      .then((res) => {
        setData(
          res.data.map((r, index) => {
            return {
              ...r,
              index,
              key: index + 1,
              quantity: r.quantity + " " + r.measurementUnit,
            };
          })
        );
      });
  };

  const saveExport = (values) => {
    if (stockId) {
      agros
        .post("medicalstock/export", { ...values, stockId })
        .then((res) => {
          notify("", true);
          form.resetFields();
          form2.resetFields();
          props.setVisibleExport(false);
          props.triggerFetch();
        })
        .catch((err) => {
          notify(err.response, false);
        });
    } else {
      notify("", false);
    }
  };

  return (
    <>
      <Form form={form2}>
        <Row gutter={[10, 10]}>
          <Col span={6}>
            <Form.Item name="fertilizerKindId">
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
                onChange={(e) => handleParamChange(e, "fertilizerKindId")}
              >
                {options.fertilizerKinds.map((c, cindex) => {
                  return (
                    <Option key={cindex} value={c.id}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="mainIngredientId">
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
                onChange={(e) => handleParamChange(e, "mainIngredientId")}
              >
                {options.mainIngredients.filter((f) => f.categoryId === params.fertilizerKindId)
                    .map((c, cindex) => {
                  return (
                    <Option key={cindex} value={c.id}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="productId">
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
                  onChange={(e) => handleParamChange(e, "productId")}>
                {options.fertilizers
                  .filter(
                    (c) =>
                      c.fertilizerKindId === params.fertilizerKindId &&
                      c.mainIngredientId === params.mainIngredientId
                  )
                  .map((c, cindex) => {
                    return (
                      <Option key={cindex} value={c.id}>
                        {c.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button className="w-100 h-100" onClick={getData} type="primary">
              {t("search")}
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col className="mt-20" span={24}>
          <Table
            size="small"
            className="w-100"
            columns={columns}
            rowSelection={{
              type: "radio",
              onChange: (selectedRowKeys, selectedRows) => {
                setStock(selectedRows);
              },
            }}
            dataSource={convertColumns(data, cols)}
            pagination={{ pageSize: 5, current_page: 1 }}
          />
        </Col>
      </Row>

      <Form form={form} layout="vertical" onFinish={saveExport}>
        <div className="mt-5">
          <Row gutter={[16, 8]}>
            <Col lg={8} sm={12} xs={24}>
              <Form.Item
                label={t("areaCategory")}
                validateTrigger="onChange"
                name="parcelCategoryId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select
                  onChange={(e) => handleKeyChange(e, "parcelCategoryId")}
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
            <Col lg={8} sm={12} xs={24}>
              <Form.Item
                label={t("area")}
                validateTrigger="onChange"
                name="parcelId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select onChange={(e) => handleKeyChange(e, "parcelId")}>
                  {options.parcels
                    .filter((p) => p.parcelCategoryId === vals.parcelCategoryId)
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

            <Col lg={8} sm={12} xs={24}>
              <Form.Item
                label={t("areasSector")}
                validateTrigger="onChange"
                name="parcelSectorId"
                rules={[noWhitespace(t("inputError"))]}
              >
                <Select>
                  {options.parcelSectors
                    .filter((p) => p.parcelId === vals.parcelId)
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

            <Col lg={8} sm={12} xs={24}>
              <Form.Item
                label={t("quantityOf")}
                validateTrigger="onChange"
                name="quantity"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={8} sm={12} xs={24}>
              <Form.Item
                label={t("acceptedPerson")}
                validateTrigger="onChange"
                name="handingPerson"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={8} sm={12} xs={24}>
              <Form.Item
                label={t("acceptedCarNumber")}
                validateTrigger="onChange"
                name="handingCarNumber"
                rules={[whiteSpace(t("inputError"))]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <div
            className="modalButtons"
            style={{ position: "absolute", bottom: "20px", right: "25px" }}
          >
            <Button onClick={() => props.setVisibleExport(false)}>
              {t("cancel")}
            </Button>
            <Button type="primary" className="ml-10" htmlType="submit">
              {t("save")}
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(ExportModal);
