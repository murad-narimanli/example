import React from "react";
import { Col, Row } from "antd";
import {useTranslation} from "react-i18next";




const ImportExportModal = ({ inout }) => {
  const { t } = useTranslation();
  return (
    <Row gutter={[16, 16]}>
      <Col sm={12} xs={24}>
        <table className="customtable">
          <tbody>
            <tr>
              <td>{t('documentNumber')}:</td>
              <td>{inout.documentNumber}</td>
            </tr>
            <tr>
              <td>{t('type')}</td>
              <td>{inout.fertilizerKind}</td>
            </tr>
            <tr>
              <td>{t('activeSubstance')}</td>
              <td>{inout.mainIngredient}</td>
            </tr>
            <tr>
              <td>{t('productName')}</td>
              <td>{inout.productName}</td>
            </tr>
          </tbody>
        </table>
      </Col>
      <Col sm={12} xs={24}>
        <table className="customtable">
          <tbody>
            <tr>
              <td>{t('quantity')}</td>
              <td>{inout.quantity}</td>
            </tr>
            <tr>
              <td>{t('warehouse')}</td>
              <td>{inout.warehouse}</td>
            </tr>

            <tr>
              <td>{t('operation')}</td>
              <td>{inout.operation}</td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  );
};

export default ImportExportModal;
