import React from "react";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";

const View = (props) => {
  const { t } = useTranslation();
  const c = props.consumer;

  return (
    <Row gutter={[16, 16]}>
      <Col lg={12} xs={24}>
        <table className="customtable">
          <tbody>
            <tr>
              <td>{t("name")}:</td>
              <td>{c?.name}</td>
            </tr>
            <tr>
              <td>{t("officalName")}:</td>
              <td>{c?.legalName}</td>
            </tr>
            <tr>
              <td>{t("industry")}:</td>
              <td>{c?.industry}</td>
            </tr>
            <tr>
              <td>{t("country")}:</td>
              <td>{c?.country}</td>
            </tr>
            <tr>
              <td>{t("city")}:</td>
              <td>{c?.city}</td>
            </tr>
            <tr>
              <td>{t("adress")}:</td>
              <td>{c?.address}</td>
            </tr>
            <tr>
              <td>{t("relatedPerson")}:</td>
              <td>{c?.contactPerson}</td>
            </tr>
            <tr>
              <td>{t("email")}:</td>
              <td>{c?.email}</td>
            </tr>
            <tr>
              <td>{t("phone")}:</td>
              <td>{c?.phone}</td>
            </tr>
            <tr>
              <td>{t("agreementDocumentNumber")}:</td>
              <td>{c?.agreementNumber}</td>
            </tr>
          </tbody>
        </table>
      </Col>
      <Col lg={12} xs={24}>
        <table className="customtable">
          <tbody>
            <tr>
              <td>{t("agreementDocumentDate")}:</td>
              <td>{c?.agreementDate}</td>
            </tr>
            <tr>
              <td>{t("paymentTerm")}:</td>
              <td>{c?.paymentTerm}</td>
            </tr>
            <tr>
              <td>{t("paymentType")}:</td>
              <td>{c?.paymentKind}</td>
            </tr>
            <tr>
              <td>{t("paymentTime")}:</td>
              <td>{c?.paymentPeriod}</td>
            </tr>
            <tr>
              <td>{t("advanceCondition")}:</td>
              <td>{c?.advancePaymentTerm}</td>
            </tr>
            <tr>
              <td>{t("advancePaymentType")}:</td>
              <td>{c?.advancePaymentKind}</td>
            </tr>
            <tr>
              <td>{t("advancePaymentTime")}:</td>
              <td>{c?.advancePaymentPeriod}</td>
            </tr>
            <tr>
              <td>{t("deliveryTern")}:</td>
              <td>{c?.deliveryTerm}</td>
            </tr>
            <tr>
              <td>{t("deliveryDate")}:</td>
              <td>{c?.deliveryPeriod}</td>
            </tr>
            <tr>
              <td>{t("status")}:</td>
              <td>{c?.positionStatus}</td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  );
};

export default View;
