import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  Row,
  Table,
  Form,
  Select,
  InputNumber,
} from "antd";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../../utils/columnconverter";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import agros from "../../../../../const/api";
import { noWhitespace, whiteSpace } from "../../../../../utils/rules";
const { Option } = Select;

const ExportModal = (props) => {
  const { notify } = props;
  const { t, i18n } = useTranslation();
  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "productCategory", value: t("productCategory"), con: true },
    { key: "product", value: t("product"), con: true },
    { key: "productSorts", value: t("productSorts"), con: true },
    { key: "reproductionName", value: t("reproduction"), con: true },
    { key: "quantity", value: t("quantity"), con: true },
    { key: "price", value: t("price"), con: true },
    { key: "warehouse", value: t("warehouse"), con: true },
  ];
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [data, setData] = useState([]);

  const [params, setParams] = useState({
    cropCategoryId: undefined,
    cropId: undefined,
    cropSortId: undefined,
  });

  const [stockId, setStockId] = useState(null);
  const [unit, setUnit] = useState("");

  const handleParamChange = (e, key) => {
    let par = { ...params };
    par[key] = e;
    setParams(par);
  };

  const { getOptions } = props;
  const options = props.options[props.lang];
  // table data columns
  const columns = [
    {
      title: "#",
      key: 1,
      dataIndex: "key",
      width: 70,
    },
    {
      title: t("productCategory"),
      key: 2,
      dataIndex: "cropCategory",
    },
    {
      title: t("product"),
      key: 3,
      dataIndex: "crop",
    },
    {
      title: t("productSorts"),
      key: 4,
      dataIndex: "cropSortName",
    },
    {
      title: t("reproduction"),
      key: 6,
      dataIndex: "reproduction",
    },
    {
      title: t("quantity"),
      key: 7,
      dataIndex: "quantity",
    },
    // {
    //   title: t("price"),
    //   key: 8,
    //   dataIndex: "price",
    // },
    {
      title: t("warehouse"),
      key: 9,
      dataIndex: "warehouseName",
    },
  ];

  useEffect(() => {
    getOptions(
      [
        "cropCategories",
        "cropSorts",
        "crops",
        "parcelCategories",
        "parcels",
        "customers",
        "parcelSectors",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const getData = () => {
    agros.get(`cropstock/export`, { params }).then((res) => {
      setData(
        res.data.map((r, index) => {
          return {
            ...r,
            key: index + 1,
            quantity: r.quantity + " " + r.measurementUnit,
            index: index,
          };
        })
      );
    });
  };

  const setStock = (selectedRows) => {
    setUnit(selectedRows[0].measurementUnit);
    setStockId(selectedRows[0].id);
  };

  const saveExport = (values) => {
    if (stockId) {
      agros
        .post("cropstock/export", { ...values, stockId })
        .then((res) => {
          notify("", true);
          form.resetFields();
          form2.resetFields();
          setData([]);
          props.triggerFetch();
          setStockId(null);
          setUnit("");
          setData([]);
          props.setVisibleExport(false);
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
      <Form form={form2} onFinish={getData}>
        <Row gutter={[10, 10]}>
          <Col span={6}>
            <Form.Item
              name="cropCategoryId"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select onChange={(e) => handleParamChange(e, "cropCategoryId")}>
                {options.cropCategories.map((c, cindex) => {
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
            <Form.Item name="cropId" rules={[noWhitespace(t("inputError"))]}>
              <Select onChange={(e) => handleParamChange(e, "cropId")}>
                {options.crops
                  .filter((c) => c.categoryId === params.cropCategoryId)
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
            <Form.Item name="cropSortId">
              <Select
                onChange={(e) => handleParamChange(e, "cropSortId")}
                allowClear
              >
                {options.cropSorts
                  .filter((c) => c.categoryId === params.cropId)
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
            <Button
              className="w-100"
              size="large"
              type="primary"
              htmlType="submit"
            >
              {t("search")}
            </Button>
          </Col>
        </Row>
      </Form>
      <Form form={form} layout="vertical" onFinish={saveExport}>
        <Row gutter={[16, 0]}>
          <Col className="mt-20" span={24}>
            <Table
              size="small"
              rowSelection={{
                type: "radio",
                onChange: (selectedRowKeys, selectedRows) => {
                  setStock(selectedRows);
                },
              }}
              className="bg-white  mb-10 w-100"
              columns={columns}
              dataSource={convertColumns(data, cols)}
              pagination={{ pageSize: 5, current_page: 1 }}
            />
          </Col>

          <Col lg={8} sm={12} xs={24}>
            <Form.Item
              label={t("areaCategory")}
              validateTrigger="onChange"
              name="parcelCategoryId"
              rules={[noWhitespace(t("inputError"))]}
            >
              <Select>
                {options.parcelCategories.map((pc, pindex) => {
                  return (
                    <Option key={pindex} value={pc.id}>
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
              <Select>
                {options.parcels.map((pc, pindex) => {
                  return (
                    <Option key={pindex} value={pc.id}>
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
                {options.parcelSectors.map((pc, pindex) => {
                  return (
                    <Option key={pindex} value={pc.id}>
                      {pc.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={8} sm={12} xs={24}>
            <div className="form-lang">
              <Form.Item
                label={t("quantityOf")}
                validateTrigger="onChange"
                name="quantity"
                rules={[noWhitespace(t("inputError"))]}
              >
                <InputNumber />
              </Form.Item>
              <span className="input-lang btm">{unit}</span>
            </div>
          </Col>
          <Col lg={8} sm={12} xs={24}>
            <Form.Item
              label={t("acceptedPerson")}
              validateTrigger="onChange"
              name="HandingPerson"
              rules={[whiteSpace(t("inputError"))]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={8} sm={12} xs={24}>
            <Form.Item
              label={t("acceptedCarNumber")}
              validateTrigger="onChange"
              name="HandingCarNumber"
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
      </Form>
    </>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(ExportModal);
