import React, { useEffect, useState } from "react";
import { Select, Button, Row, Col, Tabs, DatePicker, Tooltip } from "antd";
import { connect } from "react-redux";
import { getOptions } from "../../../redux/actions";
import { useTranslation } from "react-i18next";
import {
  ClearOutlined,
  UserOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import "./stats.css";
import moment from "moment";
import agros from "../../../const/api";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const getInitialFilters = () => {
  return {
    medicines: {
      mainIngredientId: undefined,
      fertilizerKindId: undefined,
      fertilizerId: undefined,
    },
    tools: { toolId: undefined },
    reserves: { reserveId: undefined },
    crops: {
      cropCategoryId: undefined,
      cropId: undefined,
      cropSortId: undefined,
    },
    type: 4,
    dateRange: [moment("01-01-2020"), moment("01-01-2021")],
  };
};

const Statistics = (props) => {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({ ...getInitialFilters() });

  const [todoId, setTodoId] = useState(0);
  const [parcelCategoryId, setParcelCategoryId] = useState(0);
  const [parcelId, setParcelId] = useState(0);

  const [workers, setWorkers] = useState({});
  const [workersFetched, setWorkersFetched] = useState(false);

  const [tasks, setTasks] = useState({});
  const [tasksFetched, setTasksFetched] = useState(false);

  const [ms, setMS] = useState([]);
  const [rs, setRS] = useState([]);
  const [ts, setTS] = useState([]);
  const [ps, setPS] = useState([]);

  const { getOptions } = props;
  const options = props.options[props.lang];

  useEffect(() => {
    getOptions(
      [
        "fertilizerKinds",
        "mainIngredients",
        "fertilizers",

        "parcelCategories",
        "parcelSectors",
        "parcels",

        "cropCategories",
        "crops",
        "cropSorts",

        "reserves",
        "tools",

        "todos",
        "positions",
        "users",
      ],
      props.options,
      i18n.language
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const handleParcelCategoryChange = (e) => {
    setParcelCategoryId(e);
    setParcelId(0);
  };
  const handleParcelChange = (e) => {
    setParcelId(e);
  };

  const handleTodoChange = (e) => {
    setTodoId(e);
  };

  const clearAllFilters = () => {
    const newFilters = { ...getInitialFilters() };
    setFilters(newFilters);
  };

  const clearSectionFilter = (key) => {
    const all = { ...filters };
    all[key] = getInitialFilters()[key];
    setFilters(all);
  };

  // const handleTypeChange = (e) => {
  //   const all = { ...filters };
  //   all.type = +e;
  //   setFilters(all);
  // };

  const handleKeyChange = (e, key, filt, filts) => {
    const all = { ...filters };
    all[key][filt] = e;
    setFilters(all);
  };

  const handleRangeChange = (e) => {
    const all = { ...filters };
    all.dateRange = e;
    setFilters(all);
  };

  const searchByGroup = (filter, group) => {
    const m = filter === "medicines" ? filters[filter].fertilizerId : 0;
    const r = filter === "reserves" ? filters[filter].reserveId : 0;
    const t = filter === "tools" ? filters[filter].toolId : 0;
    const cs = filter === "crops" ? filters[filter].cropSortId : 0;
    const c = filter === "crops" ? filters[filter].cropId : 0;
    agros
      .get("statistics/usage", {
        params: {
          ...filters[filter],
          group,
          type: filters.type,
          startDate: filters.dateRange
            ? filters.dateRange[0].format("DD-MM-YYYY")
            : null,
          endDate: filters.dateRange
            ? filters.dateRange[1].format("DD-MM-YYYY")
            : null,
        },
      })
      .then((res) => {
        const annual = {
          count: res.data.annual ? res.data.annual.length : 0,
          sum: res.data.annual
            ? res.data.annual.reduce((a, b) => a + b.amount, 0)
            : 0,
          unit: res.data.annual.length > 1 ? res.data.annual[0].unit : "",
        };
        const daily = {
          count: res.data.daily ? res.data.daily.length : 0,
          sum: res.data.daily
            ? res.data.daily.reduce((a, b) => a + b.amount, 0)
            : 0,
          unit: res.data.daily.length > 1 ? res.data.daily[0].unit : "",
        };
        const reports = {
          count: res.data.reports ? res.data.reports.length : 0,
          sum: res.data.reports
            ? res.data.reports.reduce((a, b) => a + b.amount, 0)
            : 0,
          unit: res.data.reports.length > 1 ? res.data.reports[0].unit : "",
        };
        switch (group) {
          case 1:
            const all1 = [...ms.filter((a) => a.id !== m)];
            all1.push({
              annual,
              daily,
              reports,
              id: m,
              name: options.fertilizers.find((f) => f.id === m).name,
            });
            setMS(all1);
            break;
          case 2:
            const all2 = [...rs.filter((a) => a.id !== r)];
            all2.push({
              annual,
              daily,
              reports,
              id: r,
              name: options.reserves.find((f) => f.id === r).name,
            });
            setRS(all2);
            break;
          case 3:
            const all3 = [...ts.filter((a) => a.id !== t)];
            all3.push({
              annual,
              daily,
              reports,
              id: t,
              name: options.tools.find((f) => f.id === t).name,
            });
            setTS(all3);
            break;
          case 4:
            const all4 = [...ps.filter((a) => a.id !== c)];
            all4.push({
              annual,
              daily,
              reports,
              id: cs ? cs : c,
              name: cs
                ? options.crops.find((f) => f.id === c).name +
                  "(" +
                  options.cropSorts.find((f) => f.id === cs).name +
                  ")"
                : options.crops.find((f) => f.id === c).name,
            });
            setPS(all4);
            break;
          default:
            break;
        }
      });
  };

  const getParams = () => {
    let obj = {
      type: filters.type,
      parcelId: parcelId ? parcelId : undefined,
      todoId: todoId ? todoId : undefined,
      startDate: filters.dateRange[0]._d,
      endDate: filters.dateRange[1]._d,
      //       startDate: filters.dateRange[0].format('DD-MM-YYYY'),
      // endDate: filters.dateRange[1].format('DD-MM-YYYY'),
    };
    return obj;
  };

  const getUserStatistics = () => {
    agros.get("statistics/workers", { params: getParams() }).then((res) => {
      setWorkers(res.data);
      setWorkersFetched(true);
    });
  };

  const getTaskStatistics = () => {
    agros.get("statistics/general", { params: getParams() }).then((res) => {
      let annual = {
        count: res.data.annual.length,
        sum: res.data.annual.reduce((a, b) => a + b.count, 0),
      };
      let daily = {
        count: res.data.daily.length,
        sum: res.data.daily.reduce((a, b) => a + b.count, 0),
      };
      let reports = {
        count: res.data.reports.length,
        sum: res.data.reports.reduce((a, b) => a + b.count, 0),
      };
      setTasks({
        annual,
        daily,
        reports,
      });
      setTasksFetched(true);
    });
  };

  return (
    <>
      <div className="filter-box mb-10">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Tabs type="card">
              <TabPane tab="Dərman və gübrə" key="1">
                <Row className="mt-5" gutter={[16, 16]}>
                  <Col span={6}>
                    <Select
                      className="w-100"
                      value={filters.medicines.fertilizerKindId}
                      onChange={(e) =>
                        handleKeyChange(
                          e,
                          "medicines",
                          "fertilizerKindId",
                          "fertilizerKinds"
                        )
                      }
                      allowClear
                    >
                      {options.fertilizerKinds.map((f, index) => {
                        return (
                          <Option key={index} value={f.id}>
                            {f.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      className="w-100"
                      value={filters.medicines.mainIngredientId}
                      onChange={(e) =>
                        handleKeyChange(
                          e,
                          "medicines",
                          "mainIngredientId",
                          "mainIngredients"
                        )
                      }
                      allowClear
                    >
                      {options.mainIngredients.map((f, index) => {
                        return (
                          <Option key={index} value={f.id}>
                            {f.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      className="w-100"
                      value={filters.medicines.fertilizerId}
                      onChange={(e) =>
                        handleKeyChange(
                          e,
                          "medicines",
                          "fertilizerId",
                          "fertilizers"
                        )
                      }
                      allowClear
                    >
                      {options.fertilizers
                        .filter(
                          (f) =>
                            f.fertilizerKindId ===
                              filters.medicines.fertilizerKindId &&
                            f.mainIngredientId ===
                              filters.medicines.mainIngredientId
                        )
                        .map((f, index) => {
                          return (
                            <Option key={index} value={f.id}>
                              {f.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Tooltip
                      className="mr-5"
                      placement="rightTop"
                      title="Dərman və gübrə filterini təmizlə"
                    >
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => clearSectionFilter("medicines")}
                      >
                        <ClearOutlined />
                      </Button>
                    </Tooltip>
                    <Button
                      disabled={!filters.medicines.fertilizerId}
                      onClick={() => searchByGroup("medicines", 1)}
                      size="large"
                      type="primary"
                    >
                      Axtar
                    </Button>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Ehtiyat" key="2">
                <Row className="mt-5" gutter={[16, 16]}>
                  <Col span={6}>
                    <Select
                      className="w-100"
                      value={filters.reserves.reserveId}
                      onChange={(e) =>
                        handleKeyChange(e, "reserves", "reserveId", "reserves")
                      }
                      allowClear
                    >
                      {options.reserves.map((f, index) => {
                        return (
                          <Option key={index} value={f.id}>
                            {f.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Tooltip
                      className="mr-5"
                      placement="rightTop"
                      title="Ehtiyat filterini təmizlə"
                    >
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => clearSectionFilter("reserves")}
                      >
                        <ClearOutlined />
                      </Button>
                    </Tooltip>
                    <Button
                      disabled={!filters.reserves.reserveId}
                      onClick={() => searchByGroup("reserves", 2)}
                      size="large"
                      type="primary"
                    >
                      Axtar
                    </Button>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Alət" key="3">
                <Row className="mt-5" gutter={[16, 16]}>
                  <Col span={6}>
                    <Select
                      className="w-100"
                      value={filters.tools.toolId}
                      onChange={(e) =>
                        handleKeyChange(e, "tools", "toolId", "tools")
                      }
                      allowClear
                    >
                      {options.tools.map((f, index) => {
                        return (
                          <Option key={index} value={f.id}>
                            {f.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Tooltip
                      className="mr-5"
                      placement="rightTop"
                      title="Alət filterini təmizlə"
                    >
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => clearSectionFilter("tools")}
                      >
                        <ClearOutlined />
                      </Button>
                    </Tooltip>
                    <Button
                      disabled={!filters.tools.toolId}
                      onClick={() => searchByGroup("tools", 3)}
                      size="large"
                      type="primary"
                    >
                      Axtar
                    </Button>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Məhsul" key="4">
                <Row className="mt-5" gutter={[16, 16]}>
                  <Col span={6}>
                    <Select
                      className="w-100"
                      value={filters.crops.cropCategoryId}
                      onChange={(e) =>
                        handleKeyChange(
                          e,
                          "crops",
                          "cropCategoryId",
                          "cropCategories"
                        )
                      }
                      allowClear
                    >
                      {options.cropCategories.map((f, index) => {
                        return (
                          <Option key={index} value={f.id}>
                            {f.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      className="w-100"
                      value={filters.crops.cropId}
                      onChange={(e) =>
                        handleKeyChange(e, "crops", "cropId", "crops")
                      }
                      allowClear
                    >
                      {options.crops
                        .filter(
                          (f) => f.categoryId === filters.crops.cropCategoryId
                        )
                        .map((f, index) => {
                          return (
                            <Option key={index} value={f.id}>
                              {f.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      className="w-100"
                      value={filters.crops.cropSortId}
                      onChange={(e) =>
                        handleKeyChange(e, "crops", "cropSortId", "cropSorts")
                      }
                      allowClear
                    >
                      {options.cropSorts
                        .filter((f) => f.categoryId === filters.crops.cropId)
                        .map((f, index) => {
                          return (
                            <Option key={index} value={f.id}>
                              {f.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Tooltip
                      className="mr-5"
                      placement="rightTop"
                      title="Məhsul filterini təmizlə"
                    >
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => clearSectionFilter("crops")}
                      >
                        <ClearOutlined />
                      </Button>
                    </Tooltip>
                    <Button
                      disabled={
                        !filters.crops.cropId && !filters.crops.cropSortId
                      }
                      onClick={() => searchByGroup("crops", 4)}
                      size="large"
                      type="primary"
                    >
                      Axtar
                    </Button>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={5}>
            <RangePicker
              value={filters.dateRange}
              onChange={(e) => handleRangeChange(e)}
            />
          </Col>
          {/* <Col span={4}>
            <Select
              className="w-100"
              value={filters.type.toString()}
              onChange={handleTypeChange}
              allowClear
            >
              <Option value="1">İllik planlar əsasında</Option>
              <Option value="2">Günlük planlar əsasında</Option>
              <Option value="3">Hesabatlar əsasında</Option>
              <Option value="4">Müqayisəli</Option>
            </Select>
          </Col> */}
          <Col span={4}>
            <Select
              className="w-100"
              value={todoId}
              onChange={handleTodoChange}
              allowClear
            >
              <Option key={10000000} value={0}>
                Bütün işlər
              </Option>
              {options.todos.map((f, index) => {
                return (
                  <Option key={index} value={f.id}>
                    {f.name}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              className="w-100"
              value={parcelCategoryId}
              onClear={handleParcelCategoryChange}
              onChange={handleParcelCategoryChange}
              allowClear
            >
              <Option key={100000} value={0}>
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
          </Col>
          <Col span={3}>
            <Select
              disabled={!parcelCategoryId}
              className="w-100"
              value={parcelId}
              onChange={handleParcelChange}
              allowClear
            >
              <Option key={100000} value={0}>
                Bütün sahələr
              </Option>
              {options.parcels
                .filter((p) => p.parcelCategoryId === parcelCategoryId)
                .map((pc, index) => {
                  return (
                    <Option key={index} value={pc.id}>
                      {pc.name}
                    </Option>
                  );
                })}
            </Select>
          </Col>
          <Col span={6}>
            <Tooltip placement="top" title="Filteri təmizlə">
              <Button
                type="primary"
                size="large"
                onClick={() => clearAllFilters()}
              >
                <ClearOutlined />
              </Button>
            </Tooltip>
            <Tooltip
              placement="top"
              title="İşçi statistikasına bax"
              className="ml-5"
            >
              <Button type="primary" size="large" onClick={getUserStatistics}>
                <UserOutlined />
              </Button>
            </Tooltip>
            <Tooltip
              placement="top"
              title="Tapşırıqların statistikasına bax"
              className="ml-5"
            >
              <Button type="primary" size="large" onClick={getTaskStatistics}>
                <FileDoneOutlined />
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </div>
      {workersFetched && (
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
                  <td>
                    {workers.daily?.taskCount || 0} ədəd günlük tapşırıqda
                  </td>
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
                  <td>{workers.reports?.reportCount || 0} ədəd hesabatda</td>
                </tr>
                <tr>
                  <td>Kişi işçi</td>
                  <td>{workers.reports?.womanCount || 0}</td>
                </tr>
                <tr>
                  <td>Qadın işçi</td>
                  <td>{workers.reports?.womanCount || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tasksFetched && (
        <div className="worker-stats mt-10 mb-10">
          <div className="worker-stat">
            <table className="customtable">
              <tbody>
                <tr className="headtr">
                  <td></td>
                  <td>
                    {tasks.annual.count}
                    {""} ədəd illik planda
                  </td>
                </tr>
                <tr>
                  <td>Tapşırıq sayı</td>
                  <td>{tasks.annual.sum}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="worker-stat">
            <table className="customtable">
              <tbody>
                <tr className="headtr">
                  <td></td>
                  <td>
                    {tasks.daily.count}
                    {""} ədəd illik planda
                  </td>
                </tr>
                <tr>
                  <td>Günlük tapşırıq sayı</td>
                  <td>{tasks.daily.sum}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="worker-stat">
            <table className="customtable">
              <tbody>
                <tr className="headtr">
                  <td>
                    {Math.ceil((tasks.reports.sum * 100) / tasks.daily.sum)}%
                  </td>
                  <td>
                    {tasks.reports.count}
                    {""} ədəd illik planda
                  </td>
                </tr>
                <tr>
                  <td>Hesabat sayı</td>
                  <td>{tasks.reports.sum}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ms.length ? (
        <table className="customtable2">
          <thead>
            <tr className="headtr">
              <td>Dərman və ya gübrə</td>
              <td>İllik</td>
              <td>İllik miqdar</td>
              <td>Günlük</td>
              <td>Tapşırıqlarda miqdar</td>
              <td>Hesabat</td>
              <td>Hesabatlarda miqdar</td>
            </tr>
          </thead>
          <tbody>
            {ms.map((m, index) => {
              return (
                <tr key={index}>
                  <td>{m.name}</td>
                  <td>{m.annual.count} plan</td>
                  <td>
                    {m.annual.sum} {m.annual.unit}
                  </td>
                  <td>{m.daily.count} tapşırıq</td>
                  <td>
                    {m.daily.sum} {m.daily.unit}
                  </td>
                  <td>{m.reports.count} hesabat</td>
                  <td>
                    {m.reports.sum} {m.reports.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      {rs.length ? (
        <table className="customtable2 mt-5">
          <thead>
            <tr className="headtr">
              <td>Ehtiyat</td>
              <td>İllik</td>
              <td>İllik miqdar</td>
              <td>Günlük</td>
              <td>Tapşırıqlarda miqdar</td>
              <td>Hesabat</td>
              <td>Hesabatlarda miqdar</td>
            </tr>
          </thead>
          <tbody>
            {rs.map((m, index) => {
              return (
                <tr key={index}>
                  <td>{m.name}</td>
                  <td>{m.annual.count} plan</td>
                  <td>
                    {m.annual.sum} {m.annual.unit}
                  </td>
                  <td>{m.daily.count} tapşırıq</td>
                  <td>
                    {m.daily.sum} {m.daily.unit}
                  </td>
                  <td>{m.reports.count} hesabat</td>
                  <td>
                    {m.reports.sum} {m.reports.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      {ts.length ? (
        <table className="customtable2 mt-5">
          <thead>
            <tr className="headtr">
              <td>Alət</td>
              <td>İllik</td>
              <td>İllik say</td>
              <td>Günlük</td>
              <td>Tapşırıqlarda say</td>
              <td>Hesabat</td>
              <td>Hesabatlarda say</td>
            </tr>
          </thead>
          <tbody>
            {ts.map((m, index) => {
              return (
                <tr key={index}>
                  <td>{m.name}</td>
                  <td>{m.annual.count} plan</td>
                  <td>
                    {m.annual.sum} {m.annual.unit}
                  </td>
                  <td>{m.daily.count} tapşırıq</td>
                  <td>
                    {m.daily.sum} {m.daily.unit}
                  </td>
                  <td>{m.reports.count} hesabat</td>
                  <td>
                    {m.reports.sum} {m.reports.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      {ps.length ? (
        <table className="customtable2 mt-5">
          <thead>
            <tr className="headtr">
              <td>Məhsul</td>
              <td>İllik</td>
              <td>İllik miqdar</td>
              <td>Günlük</td>
              <td>Tapşırıqlarda miqdar</td>
              <td>Hesabat</td>
              <td>Hesabatlarda miqdar</td>
            </tr>
          </thead>
          <tbody>
            {ps.map((m, index) => {
              return (
                <tr key={index}>
                  <td>{m.name}</td>
                  <td>{m.annual.count} plan</td>
                  <td>
                    {m.annual.sum} {m.annual.unit}
                  </td>
                  <td>{m.daily.count} tapşırıq</td>
                  <td>
                    {m.daily.sum} {m.daily.unit}
                  </td>
                  <td>{m.reports.count} hesabat</td>
                  <td>
                    {m.reports.sum} {m.reports.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
    </>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions })(Statistics);
