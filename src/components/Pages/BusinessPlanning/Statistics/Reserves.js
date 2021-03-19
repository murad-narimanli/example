import React, { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { Form, DatePicker, Row, Table, Col, Button, Tooltip, Select } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getOptions } from "./../../../../redux/actions";
import { connect } from "react-redux";
import agros from "../../../../const/api";

const { Option } = Select;

const Reserves = (props) => {
  const [form] = useForm();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);

  const { t, i18n } = useTranslation();

  const { getOptions } = props;
  const options = props.options[props.lang];

  const handleKeyChange = (e, key) => {
    const all = { ...filters };
    all[key] = e;
    setFilters(all);
  };

  const clearFilter = () => {
    form.resetFields();
    form.setFieldsValue({ parcelId: 0, parcelCategoryId: 0 });
  };

  const search = (values) => {
    agros.get("statistics/reserves", { params: formatParams(values) }).then((res) => {
      setData(
        mapData([...res.data.annual, ...res.data.daily, ...res.data.report])
      );
    });
  };

  const formatParams = (values) => {
    values.parcelId = values.parcelId === 0 ? null : values.parcelId;
    values.parcelCategoryId =
      values.parcelCategoryId === 0 ? null : values.parcelCategoryId;
    values.startDate = values.startDate?.format("YYYY-MM-DD");
    values.endDate = values.endDate?.format("YYYY-MM-DD");
    return values;
  };

  const columns = [
    {
      title: "İllik planlarda",
      key: 3,
      dataIndex: "annual",
    },
    {
      title: "Günlük tapşırıqlarda",
      key: 4,
      dataIndex: "daily",
    },
    {
      title: "Hesabatlarda",
      key: 5,
      dataIndex: "report",
    },
    {
      title: "Ölçü vahidi",
      key: 6,
      dataIndex: "unit",
    },
  ];

  const mapIds = (obj) => {
    let ids = [];
    obj.forEach((o) => {
      if (!ids.includes(o.id)) {
        ids.push(o.id);
      }
    });
    return ids;
  };

  const mapData = (obj) => {
    let ids = mapIds(obj);
    let result = [];
    ids.forEach((i) => {
      let ob = obj.filter((f) => f.id === i)[0];
      let name = ob.name;
      let unit = ob.unit;
      let id = ob.id;
      let annual = obj.find((f) => f.id === i && f.type === 1)?.amount || "0";
      let daily = obj.find((f) => f.id === i && f.type === 2)?.amount || "0";
      let report = obj.find((f) => f.id === i && f.type === 3)?.amount || "0";
      result.push({
        name,
        unit,
        id,
        annual,
        daily,
        report,
        key: id,
      });
    });
    return result;
  };
  useEffect(() => {
    getOptions(
      [
        "reserves",

        "parcelCategories",
        "parcelSectors",
        "parcels",

        "todos",
        "positions",
        "users",
      ],
      props.options,
      i18n.language
    );
    form.setFieldsValue({ parcelId: 0, parcelCategoryId: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return (
    <Form form={form} onFinish={search} layout="vertical" className="mt-10">
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="startDate" label="Başlanğıc tarixi">
            <DatePicker className="w-100" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="endDate" label="Son tarix">
            <DatePicker className="w-100" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="reserveId" label="Ehtiyat">
            <Select
              className="w-100"
              allowClear
              onChange={(e) => handleKeyChange(e, "reserveId")}
            >
              {options.reserves.map((f, index) => {
                return (
                  <Option key={index} value={f.id}>
                    {f.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="parcelCategoryId" label="Sahə kateqoriyası">
            <Select
              className="w-100"
              onChange={(e) => handleKeyChange(e, "parcelCategoryId")}
              onClear={(e) => handleKeyChange(e, "parcelCategoryId")}
              allowClear
            >
              <Option key={0} value={0}>
                Bütün sahə kateqoriyaları
              </Option>
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
        <Col span={5}>
          <Form.Item name="parcelId" label="Sahə">
            <Select
              disabled={!filters.parcelCategoryId}
              className="w-100"
              onChange={(e) => handleKeyChange(e, "parcelId")}
              allowClear
            >
              <Option key={0} value={0}>
                Bütün sahələr
              </Option>
              {options.parcels
                .filter((p) => p.parcelCategoryId === filters.parcelCategoryId)
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
        <Col span={6}>
          <Form.Item label={<span style={{ opacity: 0 }}>.</span>}>
            <Tooltip
              className="mr-5"
              placement="rightTop"
              title="Ethiyatlar filterini təmizlə"
            >
              <Button type="primary" size="large" onClick={() => clearFilter()}>
                <ClearOutlined />
              </Button>
            </Tooltip>
            <Button
              htmlType="submit"
              size="large"
              type="primary"
            >
              Axtar
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Table dataSource={data} columns={columns} />
    </Form>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions })(Reserves);
