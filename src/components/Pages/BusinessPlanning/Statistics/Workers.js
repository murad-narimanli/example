import React, { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { Form, DatePicker, Row, Col, Button, Tooltip, Select } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getOptions } from "./../../../../redux/actions";
import { connect } from "react-redux";
import agros from "../../../../const/api";

const { Option } = Select;

const Workers = (props) => {
  const [form] = useForm();
  const [filters, setFilters] = useState({});
  const [workers, setWorkers] = useState({});

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
    agros
      .get("statistics/workers", { params: formatParams(values) })
      .then((res) => {
        console.log(res.data);
        setWorkers({
          annual: res.data.annual.length > 0 ? res.data.annual[0] : null,
          daily: res.data.daily.length > 0 ? res.data.daily[0] : null,
          report: res.data.report.length > 0 ? res.data.report[0] : null,
        });
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

  useEffect(() => {
    getOptions(
      [
        "tools",

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
    <>
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
                  .filter(
                    (p) => p.parcelCategoryId === filters.parcelCategoryId
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
          <Col span={6}>
            <Form.Item>
              <Tooltip
                className="mr-5"
                placement="rightTop"
                title="Ethiyatlar filterini təmizlə"
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() => clearFilter()}
                >
                  <ClearOutlined />
                </Button>
              </Tooltip>
              <Button htmlType="submit" size="large" type="primary">
                Axtar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="worker-stats mb-10">
        <div className="worker-stat">
          <table className="customtable">
            <tbody>
              <tr className="headtr">
                <td></td>
                <td>{workers.annual?.taskCount || 0} ədəd illik planda</td>
              </tr>
              <tr>
                <td>Kişi işçi</td>
                <td>{workers.annual?.manCount || 0}</td>
              </tr>
              <tr>
                <td>Qadın işçi</td>
                <td>{workers.annual?.womanCount || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="worker-stat">
          <table className="customtable">
            <tbody>
              <tr className="headtr">
                <td></td>
                <td>{workers.daily?.taskCount || 0} ədəd günlük tapşırıqda</td>
              </tr>
              <tr>
                <td>Kişi işçi</td>
                <td>{workers.daily?.manCount || 0}</td>
              </tr>
              <tr>
                <td>Qadın işçi</td>
                <td>{workers.daily?.womanCount || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="worker-stat">
          <table className="customtable">
            <tbody>
              <tr className="headtr">
                <td></td>
                <td>{workers.report?.reportCount || 0} ədəd hesabatda</td>
              </tr>
              <tr>
                <td>Kişi işçi</td>
                <td>{workers.report?.womanCount || 0}</td>
              </tr>
              <tr>
                <td>Qadın işçi</td>
                <td>{workers.report?.womanCount || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions })(Workers);
