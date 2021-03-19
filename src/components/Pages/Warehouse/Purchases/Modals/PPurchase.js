import React from "react";
import { Col, Row, Table } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../../utils/columnconverter";

const PurchaseDocumentView = (props) => {
  const { purchase } = props;
  const { t } = useTranslation();
  const cols = [
    { key: "name", value: t("name"), con: true },
    { key: "productType", value: t("demandType"), con: true },
    { key: "product", value: t("demandObject"), con: true },
    { key: "quantity", value: t("quantityOf"), con: true },
    { key: "countryName", value: t("originCountry"), con: true },
    { key: "price", value: t("price"), con: true },
    { key: "discount", value: t("discount"), con: true },
    { key: "discount", value: t("discount"), con: true },
    { key: "lastPrice", value: t("finalPrice"), con: true },
    { key: "earning", value: t("extraIncome"), con: true },
    { key: "legalName", value: t("officalName"), con: true },
    { key: "industry", value: t("activityOf"), con: true },
    { key: "country", value: t("country"), con: true },
    { key: "city", value: t("city"), con: true },
    { key: "contactPerson", value: t("relatedPerson"), con: true },
    { key: "phone", value: t("phone"), con: true },
    { key: "email", value: t("email"), con: true },
  ];

  const findType = (prod) => {
    if (prod.reserveName !== null) {
      return <span>{t("reserv")}</span>;
    } else if (prod.mainIngredient !== null) {
      return <span>{t("drugAndFertilizer")}</span>;
    } else if (prod.cropCategory !== null) {
      return <span>{t("product")}</span>;
    }
  };
  const findObject = (prod) => {
    let demandObject = "";
    let vals = Object.keys(prod).filter(
      (pr) => prod[pr] !== null && pr !== "measurementUnit"
    );
    vals.forEach((k, index) => {
      demandObject += prod[k];
      if (index !== vals.length - 1) {
        demandObject += " / ";
      }
    });
    return <span>{demandObject}</span>;
  };

  const detailsModal = [
    {
      title: t("demandType"),
      key: 1,
      dataIndex: "productType",
      // render: (p) => findType(p),
    },
    {
      title: t("demandObject"),
      key: 2,
      dataIndex: "product",
      // render: (p) => findObject(p),
    },
    {
      title: t("quantityOf"),
      key: 3,
      dataIndex: "quantity",
    },
    {
      title: t("originCountry"),
      key: 5,
      dataIndex: "countryName",
    },
    {
      title: t("price"),
      key: 6,
      dataIndex: "price",
    },
    {
      title: t("discount"),
      key: 7,
      dataIndex: "discount",
    },
    {
      title: t("finalPrice"),
      key: 8,
      dataIndex: "lastPrice",
    },
    {
      title: t("extraIncome"),
      key: 9,
      dataIndex: "earning",
    },
  ];

  const detailsTopModal = [
    {
      title: t("name"),
      key: 1,
      dataIndex: "name",
    },
    {
      title: t("officalName"),
      key: 2,
      dataIndex: "legalName",
    },
    {
      title: t("activityOf"),
      key: 3,
      dataIndex: "industry",
    },
    {
      title: t("country"),
      key: 4,
      dataIndex: "country",
    },
    {
      title: t("city"),
      key: 5,
      dataIndex: "city",
    },
    {
      title: t("relatedPerson"),
      key: 6,
      dataIndex: "contactPerson",
    },
    {
      title: t("phone"),
      key: 7,
      dataIndex: "phone",
    },
    {
      title: t("email"),
      key: 8,
      dataIndex: "email",
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col md={24}>
          <p className="pb-1">{t("supplier")}</p>
          <Table
            size="small"
            className="bg-white"
            columns={detailsTopModal}
            dataSource={convertColumns(
              [{ ...purchase.customer, key: 1 }],
              cols
            )}
            pagination={false}
          />
        </Col>
        <Col md={12}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("paymentType")}:</td>
                <td>{purchase.paymentKindName}</td>
              </tr>
              <tr>
                <td>{t("paymentTerm")}:</td>
                <td>{purchase.paymentTermName}</td>
              </tr>
              <tr>
                <td>{t("paymentTime")}:</td>
                <td>{purchase.paymentPeriod}</td>
              </tr>
              <tr>
                <td>{t("lastPaymentDate")}:</td>
                <td>
                  {moment(purchase.paymentLastDate).format(
                    "DD MMMM YYYY, hh:mm"
                  )}
                </td>
              </tr>
              <tr>
                <td>{t("customsCosts")}:</td>
                <td>
                  {purchase.customsInclude
                    ? purchase.customsCost
                    : t("thereNo")}
                </td>
              </tr>
              <tr>
                <td>{t("customsDuties")}:</td>
                <td>{purchase.customsCost}</td>
              </tr>
              <tr>
                <td>{t("ApproximatecustomsCosts")}:</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col md={12}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("deliveryTern")}:</td>
                <td>{purchase.deliveryTermName}</td>
              </tr>
              <tr>
                <td>{t("deliveryDate")}:</td>
                <td>{purchase.deliveryPeriod}</td>
              </tr>
              <tr>
                <td>{t("transportCosts")}:</td>
                <td>
                  {purchase.transportInclude
                    ? purchase.transportCost
                    : t("thereNo")}
                </td>
              </tr>
              <tr>
                <td>{t("transportDuties")}:</td>
                <td>{purchase.transportCost}</td>
              </tr>
              <tr>
                <td>{t("approximateTransportFee")}:</td>
                <td></td>
              </tr>
              <tr>
                <td>{t("ApproximatePriceProducts")}:</td>
                <td></td>
              </tr>
              <tr>
                <td>{t("approvedPerson")}:</td>
                <td>{purchase.approvedWorkerName}</td>
              </tr>
              <tr>
                <td>{t("DateOfApproval")}:</td>
                <td>
                  {moment(purchase.approvedDate).format("DD MMMM YYYY, hh:mm")}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>

        <Col md={24}>
          <p className="pb-1">{t("products")}</p>
          <Table
            size="small"
            className="bg-white"
            columns={detailsModal}
            dataSource={convertColumns(
              purchase.purchaseProductList.map((p, index) => {
                const productsObject = p.product;
                return {
                  ...p,
                  key: index + 1,
                  earning: p.lastPrice - p.price,
                  productType: findType(productsObject),
                  product: findObject(productsObject),
                };
              }),
              cols
            )}
            // dataSource={purchase.purchaseProductList.map((p, index) => {
            //   const productsObject =  p.product
            //   return { ...p, key: index + 1, earning: p.lastPrice - p.price,
            //     productType: findType(productsObject),
            //     product: findObject(productsObject),
            //   };
            // })}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseDocumentView;
