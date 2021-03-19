import React from "react";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";

const View = (props) => {
  const w = props.worker;
  const { t } = useTranslation();

  return (
    <Row gutter={[16, 16]}>
      <Col lg={12} xs={24}>
        <table className="customtable">
          <tbody>
            <tr>
              <td>{t("name")}:</td>
              <td>{w.name}</td>
            </tr>
            <tr>
              <td>{t("fin")}</td>
              <td>{w.fin}</td>
            </tr>
            <tr>
              <td>{t("seriaNo")}:</td>
              <td>{w.serialNumber}</td>
            </tr>
            <tr>
              <td>SSN:</td>
              <td>{w.ssn}</td>
            </tr>
            <tr>
              <td>{t("sex")}:</td>
              <td>{!w.gender ? t("man") : t("woman")}</td>
            </tr>
            <tr>
              <td>{t("birthdate")}:</td>
              <td>{moment(w.birthday).format("DD MM YYYY")}</td>
            </tr>
          </tbody>
        </table>
      </Col>
      <Col lg={12} xs={24}>
        <table className="customtable">
          <tbody>
            <tr>
              <td>{t("email")}:</td>
              <td>{w.email}</td>
            </tr>
            <tr>
              <td>{t("phone")}:</td>
              <td>{w.tel}</td>
            </tr>
            <tr>
              <td>{t("adress")}:</td>
              <td>{w.adress}</td>
            </tr>
            <tr>
              <td>{t("workStartDate")}:</td>
              <td>{w.startDate}</td>
            </tr>
            <tr>
              <td>{t("totalSalary")}:</td>
              <td>{w.grossSalary}</td>
            </tr>
            <tr>
              <td>{t("salary")}:</td>
              <td>{w.netSalary}</td>
            </tr>
            <tr>
              <td>{t("salaryForm")}:</td>
              <td>
                {w.workStatus === "1" ? t("salaryForWork") : t("dailySalary")}
              </td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  );
};

export default View;
