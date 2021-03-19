import React from "react";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";
function ImportExportModal(props) {
  const { t } = useTranslation();
  const { doc } = props;
  // acceptDate: "2020-11-19T19:16:00.5690755"
  const newKeys = {
    documentNumber: "documentNumber",
    // type: "type",
    cropName: "productName",
    productName: "productSorts",
    cropCategoryName:'category',
    quantity: "quantity",
    price:'price',
    warehouse: "warehouse",
    parcelName: 'areaName',
    parcelSectorName: "areasSector",
    purchaseNumber:'Satınalma sənədinin nömrəsi',
    customerName:'customerName',
    accepter: "acceptedPerson",
    respondentName:'respondentPeople',
    handingPerson: "sendedPerson",
    handingCarNumber: "acceptedCarNumber",
    reproductionName: 'reproductions',
  }
  return (
    <Row gutter={[16, 16]}>
      <Col sm={24} xs={24}>
        <table className="customtable">
          <tbody>
          {doc.operation &&
          <tr>
            <td>{t("operation")}</td>
            <td>{doc.operation === 1 ? "Mədaxil" : "Məxaric"}</td>
          </tr>
          }
          {
            Object.keys(newKeys).map(key => {
              return (
                  <>
                    {
                      doc[key] !== null &&
                      <tr>
                        <td>{t(newKeys[key])}</td>
                        <td>{doc[key]}</td>
                      </tr>
                    }
                  </>
              )
            })
          }
          {doc.acceptDate &&
          <tr>
            <td>{t("acceptedDate")}</td>
            <td>{  moment(doc.acceptDate).format("DD-MM-YYYY")}</td>
          </tr>
          }
          </tbody>
        </table>
      </Col>
    </Row>
  );
}

export default ImportExportModal;
