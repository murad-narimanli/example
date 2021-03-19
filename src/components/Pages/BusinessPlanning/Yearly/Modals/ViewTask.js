import React from "react";
import { Row, Col, Button } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";

const ViewTask = (props) => {
  const { t } = useTranslation();

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <table className="customtable">
            <tbody>
              <tr>
                <td className="bold">{t("heading")}:</td>
                <td>{props.plan.name}</td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col span={12}>
          <table className="customtable">
            <tbody>
              <tr>
                <td className="bold">{t("parsel")}:</td>
                <td>{props.plan.parcelName}</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <h3 className="mt-15 mb-15 bold">{t("periods")}</h3>
      {props.plan.annualWorkPlanPeriod.map((p, index) => {
        return (
          <div key={index} className="border p-1">
            <Row className="border-bottom">
              <Col md={12} xs={24}>
                <div className="flex p-1 flex-between">
                  <p>{t("startDate")}</p>
                  <Button shape="round" type="primary" size="small">
                    {moment(p.startDate).format("DD-MM-YYYY")}
                  </Button>
                </div>
              </Col>
              <Col md={12} xs={24}>
                <div className="flex p-1 flex-between">
                  <p>{t("endDate")}</p>
                  <Button shape="round" type="primary" size="small">
                    {moment(p.endDate).format("DD-MM-YYYY")}
                  </Button>
                </div>
              </Col>
            </Row>
            {p.annualWorkPlanPeriodTask.map((d, tindex) => {
              return (
                <div key={tindex}>
                  <h3 className="mt-15 mb-15 pl-1 bold">
                    {t("task")} {tindex + 1}
                  </h3>
                  <Row gutter={[16, 16]}>
                    <Col lg={12} xs={24}>
                      <table className="customtable">
                        <tbody>
                          <tr>
                            <td>{t("name")}:</td>
                            <td>{d.name}</td>
                          </tr>
                          <tr>
                            <td>{t("note")}:</td>
                            <td>{d.description}</td>
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
                              {d.manCount} {t("personCount")}
                            </td>
                          </tr>
                          <tr>
                            <td>{t("womanWorkerNumber")}:</td>
                            <td>
                              {d.womanCount} {t("personCount")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    {d.annualWorkPlanTaskSector?.length ? (
                      <Col span={24}>
                        <Row gutter={16}>
                          {d.annualWorkPlanTaskSector.map((s, sindex) => {
                            return (
                              <Col span={8} key={sindex}>
                                <table className="customtable">
                                  <tbody>
                                    <tr>
                                      <td className="bold">Sektor</td>
                                      <td>{s.parcelSectorName}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </Col>
                            );
                          })}
                        </Row>
                      </Col>
                    ) : null}
                    {d.annualWorkPlanTaskFertilizer?.length ? (
                      <Col span={24}>
                        {/* <p className="mt-10 mb-10 bold">Dərman və gübrələr</p> */}
                        <Row gutter={16}>
                          {d.annualWorkPlanTaskFertilizer.map((f, findex) => {
                            return (
                              <>
                                <Col span={6} key={findex}>
                                  <table className="customtable">
                                    <tbody>
                                      <tr>
                                        <td className="bold">Məhsul:</td>
                                        <td>{f.productName}</td>
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
                                        <td className="bold">
                                          Əsas inqredient:
                                        </td>
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
                    {d.annualWorkPlanTaskCrops?.length ? (
                      <Col span={24}>
                        {/* <p className="mt-10 mb-10">Məhsullar</p> */}
                        <Row gutter={16}>
                          {d.annualWorkPlanTaskCrops.map((f, findex) => {
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
                    {d.annualWorkPlanTaskTools?.length ? (
                      <Col span={24}>
                        {/* <p className="mt-10 mb-10">Alətlər</p> */}
                        <Row gutter={16}>
                          {d.annualWorkPlanTaskTools.map((f, findex) => {
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
                    {d.annualWorkPlanTaskReserves?.length ? (
                      <Col span={24}>
                        {/* <p className="mt-15 mb-10">Ehtiyatlar</p> */}
                        <Row gutter={16}>
                          {d.annualWorkPlanTaskReserves.map((f, findex) => {
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
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ViewTask;
