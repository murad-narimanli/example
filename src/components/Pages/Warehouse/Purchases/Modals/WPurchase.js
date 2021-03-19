import React from "react";
import { Button, Col, Row, Table } from "antd";
import moment from "moment";
import agros from "../../../../../const/api";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../../utils/columnconverter";
import { connect } from "react-redux";
import { notify } from "../../../../../redux/actions";

const Details = (props) => {
  const { t } = useTranslation();
  const { notify } = props;
  const cols = [
    { key: "demandType", value: t("demandType"), con: true },
    { key: "demandObject", value: t("demandObject"), con: true },
    { key: "quantity", value: t("quantityOf"), con: true },
    {
      key: "parcel",
      value: <span>{t("area")}</span>,
      con: true,
    },
    { key: "country", value: t("originCountry"), con: true },
    { key: "requestingWorker", value: t("demandedPerson"), con: true },
    { key: "expirationDate", value: t("expirationDate"), con: true },
    { key: "requiredDate", value: t("dateToBuy"), con: true },
  ];

  const p = props.purchase ? props.purchase : null;
  const access = p.estimatedValue < props.purchaseLimit;

  const data = props.purchase?.demandProducts.map((dp, dpindex) => {
    let demandType = "";
    let demandObject = "";
    let vals = Object.keys(dp.product).filter(
      (pr) => dp.product[pr] !== null && pr !== "measurementUnit"
    );
    vals.forEach((k, index) => {
      demandObject += dp.product[k];
      if (index !== vals.length - 1) {
        demandObject += " / ";
      }
    });
    if (dp.product.reserveName !== null) {
      demandType = "Ehtiyat";
    } else if (dp.product.mainIngredient !== null) {
      demandType = "Dərman və gübrə";
    } else if (dp.product.cropCategory !== null) {
      demandType = "Məhsul";
    }
    return {
      ...dp,
      demandType,
      demandObject,
      key: dpindex,
      quantity: dp.quantity + " " + dp.product.measurementUnit,
      requiredDate: moment(dp.requiredDate).format("DD-MM-YYYY"),
    };
  });

  // details modal
  const detailsModal = [
    {
      title: t("demandType"),
      key: 1,
      dataIndex: "demandType",
    },
    {
      title: t("demandObject"),
      key: 2,
      dataIndex: "demandObject",
    },
    {
      title: t("quantityOf"),
      key: 3,
      dataIndex: "quantity",
    },
    {
      title: <span>{t("area")}</span>,
      key: 4,
      dataIndex: "parcel",
    },
    {
      title: t("originCountry"),
      key: 5,
      dataIndex: "country",
    },
    {
      title: t("demandedPerson"),
      key: 6,
      dataIndex: "requestingWorker",
    },
    {
      title: t("dateToBuy"),
      key: 7,
      dataIndex: "requiredDate",
    },
  ];

  const approvePurchase = async () => {
    await agros
      .put(`purchase/approve/${p.id}`)
      .then(() => {
        notify("", true);
      })
      .catch((err) => {
        notify(err.response, false);
      });
    props.triggerFetch();
    props.setVisibleWPurchase(false);
  };

  const cancelPurchase = async () => {
    await agros
      .put(`purchase/reject/${p.id}`)
      .then(() => {
        notify("", true);
      })
      .catch((err) => {
        notify(err.response, false);
      });
    props.triggerFetch();
    props.setVisibleWPurchase(false);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col md={12}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("name")}:</td>
                <td>{p.name}</td>
              </tr>
              <tr>
                <td>{t("demmandNo")}:</td>
                <td>{p.demandNumber}</td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col md={12}>
          <table className="customtable">
            <tbody>
              <tr>
                <td>{t("createdDate")}:</td>
                <td>{p.createDate}</td>
              </tr>
            </tbody>
          </table>
        </Col>

        <Col md={24}>
          <p className="pb-1">{t("products")}</p>
          <Table
            size="small"
            className="bg-white border-top"
            columns={detailsModal}
            dataSource={convertColumns(data, cols)}
            pagination={false}
          />
        </Col>
      </Row>
      <div className="modalButtons padModal purchase">
        <div className="flex flex-between">
          {access && (
            <div>
              <Button className="btn-danger" onClick={cancelPurchase}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                className="ml-10"
                onClick={approvePurchase}
              >
                {t("doConfirm")}
              </Button>
            </div>
          )}
          <div>
            <Button onClick={() => props.setVisibleWPurchase(false)}>
              {t("close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return {
    purchaseLimit: user.data.purchaseLimit,
  };
};
export default connect(mapStateToProps, { notify })(Details);
