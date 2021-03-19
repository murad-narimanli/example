import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import { useTranslation } from "react-i18next";
import agros from "../../../../const/api";
import moment from "moment";

const View = (props) => {
  const { t } = useTranslation();
  const [task, setTask] = useState(null);
  useEffect(() => {
    agros.get("workplan/task/" + props.task).then((res) => {
      setTask(res.data[0]);
    });
  }, [props.task]);
  return task != null ? (
    <div>
      <Row>
        <Col xs={8}>
          <table className="customtable">
            <tbody>
              <tr>
                <td className="bold">{t("heading")}</td>
                <td>{task.toDoName}</td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col xs={8}>
          <table className="customtable">
            <tbody>
              <tr>
                <td className="bold">Cəmi sahə</td>
                <td>
                  {task.sectorsArea} m<sup>2</sup>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col xs={8}>
          <table className="customtable">
            <tbody>
              <tr>
                <td className="bold">{t("status")}</td>
                <td>
                  <span className="text-primary">{task.workStatus}</span>{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col xs={24}>
          <table className="customtable">
            <tbody>
              <tr>
                <td className="bold">{t("shortStory")}</td>
                <td>{task.description}</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <div className="border p-1">
        <Row className="border-bottom">
          <Col md={12} xs={24}>
            <div className="flex p-1 flex-between">
              <p>{t("startDate")}</p>
              <Button shape="round" type="primary" size="small">
                {moment(task.startDate).format("DD-MM-YYYY")}
              </Button>
            </div>
          </Col>
          <Col md={12} xs={24}>
            <div className="flex p-1 flex-between">
              <p>{t("endDate")}</p>
              <Button shape="round" type="primary" size="small">
                {moment(task.endDate).format("DD-MM-YYYY")}
              </Button>
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col lg={12} xs={24}>
            <table className="customtable">
              <tbody>
                <tr>
                  <td>{t("name")}:</td>
                  <td>{task.toDoName}</td>
                </tr>
                <tr>
                  <td>{t("note")}:</td>
                  <td>{task.description}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col lg={12} xs={24}>
            <table className="customtable">
              <tbody>
                <tr>
                  <td>{t("manWorkerNumber")}:</td>
                  <td>
                    {task.manWorkerCount} {t("personCount")}
                  </td>
                </tr>
                <tr>
                  <td>{t("womanWorkerNumber")}:</td>
                  <td>
                    {task.womanWorkerCount} {t("personCount")}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          {task.workPlanTaskSectors?.length ? (
            <Col span={24}>
              <Row gutter={16}>
                <Col span={6}>
                  <table className="customtable">
                    <tbody>
                      <tr>
                        <td className="bold">Sahə kateqoriyası:</td>
                        <td>{task.workPlanTaskSectors[0].parcelCategory}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col span={6}>
                  <table className="customtable">
                    <tbody>
                      <tr>
                        <td className="bold">Sahə:</td>
                        <td>{task.workPlanTaskSectors[0].parcel}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                {task.workPlanTaskSectors.map((f, findex) => {
                  return (
                    <>
                      <Col span={6} key={findex}>
                        <table className="customtable">
                          <tbody>
                            <tr>
                              <td className="bold">
                                Sektor
                                {task.workPlanTaskSectors.length > 1
                                  ? ` ${findex + 1}`
                                  : null}
                                :
                              </td>
                              <td>{f.sectorName}</td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </>
                  );
                })}
              </Row>
            </Col>
          ) : null}
          {task.workPlanTaskFertilizers?.length ? (
            <Col span={24}>
              {/* <p className="mt-10 mb-10 bold">Dərman və gübrələr</p> */}
              <Row gutter={16}>
                {task.workPlanTaskFertilizers.map((f, findex) => {
                  return (
                    <>
                      <Col span={6} key={findex}>
                        <table className="customtable">
                          <tbody>
                            <tr>
                              <td className="bold">Məhsul:</td>
                              <td>{f.name}</td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      <Col span={6} key={findex}>
                        <table className="customtable">
                          <tbody>
                            <tr>
                              <td className="bold">Növü:</td>
                              <td>{f.fertilizerKind}</td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      <Col span={6} key={findex}>
                        <table className="customtable">
                          <tbody>
                            <tr>
                              <td className="bold">Əsas inqredient:</td>
                              <td>{f.mainIngredient}</td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      <Col span={6} key={findex}>
                        <table className="customtable">
                          <tbody>
                            <tr>
                              <td className="bold">Miqdar:</td>
                              <td>
                                {f.quantity} {f.measurementUnit}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </>
                  );
                })}
              </Row>
            </Col>
          ) : null}
          {task.workPlanTaskCrops?.length ? (
            <Col span={24}>
              {/* <p className="mt-10 mb-10">Məhsullar</p> */}
              <Row gutter={16}>
                {task.workPlanTaskCrops.map((f, findex) => {
                  return (
                    <Col span={24} key={findex}>
                      <Row gutter={16}>
                        <Col span={6} key={findex}>
                          <table className="customtable">
                            <tbody>
                              <tr>
                                <td className="bold">Kateqoriya:</td>
                                <td>{f.cropCategory}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col span={6} key={findex}>
                          <table className="customtable">
                            <tbody>
                              <tr>
                                <td className="bold">Məhsul:</td>
                                <td>{f.crop}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col span={6} key={findex}>
                          <table className="customtable">
                            <tbody>
                              <tr>
                                <td className="bold">Sort:</td>
                                <td>{f.name}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col span={6} key={findex}>
                          <table className="customtable">
                            <tbody>
                              <tr>
                                <td className="bold">Miqdar:</td>
                                <td>
                                  {f.quantity} {f.measurementUnit}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          ) : null}
          {task.workPlanTaskTools?.length ? (
            <Col span={24}>
              {/* <p className="mt-10 mb-10">Alətlər</p> */}
              <Row gutter={16}>
                {task.workPlanTaskTools.map((f, findex) => {
                  return (
                    <Col span={12} key={findex}>
                      <table className="customtable">
                        <tbody>
                          <tr>
                            <td>{f.name}</td>
                            <td>{f.quantity} ədəd</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          ) : null}
          {task.workPlanTaskReserves?.length ? (
            <Col span={24}>
              {/* <p className="mt-15 mb-10">Ehtiyatlar</p> */}
              <Row gutter={16}>
                {task.workPlanTaskReserves.map((f, findex) => {
                  return (
                    <Col span={12} key={findex}>
                      <table className="customtable">
                        <tbody>
                          <tr>
                            <td>{f.name}</td>
                            <td>
                              {f.quantity} {f.measurementUnit}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          ) : null}
        </Row>
      </div>
    </div>
  ) : null;
};

export default View;
