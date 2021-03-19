import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import { useTranslation } from "react-i18next";
import agros from "../../../../../const/api";
import moment from "moment";

const ViewEndReport = (props) => {
    const { t } = useTranslation();
    const [report, setReport] = useState(null);
    useEffect(() => {
        agros.get("workplanreport/reports/" + props.id).then((res) => {
            setReport(res.data[0]);
            console.log(res.data[0]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.task]);
    return report != null ? (
        <div>
            <Row>
                <Col xs={24}>
                    <table className="customtable">
                        <tbody>
                        <tr>
                            <td>{t("heading")}</td>
                            <td>{report.toDoName}</td>
                        </tr>
                        <tr>
                            <td>{t("shortStory")}</td>
                            <td>{report.description}</td>
                        </tr>
                        <tr>
                            <td>{t("status")}</td>
                            <td>
                                <span className="text-primary">{report.workStatus}</span>{" "}
                            </td>
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
                                {moment(report.startDate).format("DD-MM-YYYY")}
                            </Button>
                        </div>
                    </Col>
                    <Col md={12} xs={24}>
                        <div className="flex p-1 flex-between">
                            <p>{t("endDate")}</p>
                            <Button shape="round" type="primary" size="small">
                                {moment(report.endDate).format("DD-MM-YYYY")}
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
                            <td>{report.toDoName}</td>
                        </tr>
                        <tr>
                            <td>{t("note")}:</td>
                            <td>{report.description}</td>
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
                                {report.manWorkerCount} {t("personCount")}
                            </td>
                        </tr>
                        <tr>
                            <td>{t("womanWorkerNumber")}:</td>
                            <td>
                                {report.womanWorkerCount} {t("personCount")}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Col>
                {report.workPlanTaskFertilizers?.length ? (
                    <Col span={24}>
                        {/* <p className="mt-10 mb-10 bold">Dərman və gübrələr</p> */}
                        <Row gutter={16}>
                            {report.workPlanTaskFertilizers.map((f, findex) => {
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
                {report.workPlanTaskCrops?.length ? (
                    <Col span={24}>
                        {/* <p className="mt-10 mb-10">Məhsullar</p> */}
                        <Row gutter={16}>
                            {report.workPlanTaskCrops.map((f, findex) => {
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
                {report.workPlanTaskTools?.length ? (
                    <Col span={24}>
                        {/* <p className="mt-10 mb-10">Alətlər</p> */}
                        <Row gutter={16}>
                            {report.workPlanTaskTools.map((f, findex) => {
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
                {report.workPlanTaskReserves?.length ? (
                    <Col span={24}>
                        {/* <p className="mt-15 mb-10">Ehtiyatlar</p> */}
                        <Row gutter={16}>
                            {report.workPlanTaskReserves.map((f, findex) => {
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
}


export default ViewEndReport;
