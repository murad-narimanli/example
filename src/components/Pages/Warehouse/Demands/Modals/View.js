import React from "react";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../../utils/columnconverter";
import moment from "moment";

const View = ({ demand }) => {
  const { t } = useTranslation();
  const cols = [
    {
      key: "parcel",
      value: <div>{t("area")} </div>,
      con: true,
    },
    { key: "demandType", value: t("demandType"), con: true },
    { key: "demandObject", value: t("demandObject"), con: true },
    { key: "amount", value: t("quantityOf"), con: true },
    { key: "country", value: t("countryOfOrigin"), con: true },
    { key: "requiredDate", value: t("dateMustBuy"), con: true },
    { key: "expirationDate", value: t("expirationDate"), con: true },
    { key: "requestingWorker", value: t("demandedPerson"), con: true },
    { key: "id", value: "", con: false },
  ];
  const modalColumns = [
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
      dataIndex: "amount",
    },
    {
      title: <div>{t("area")} </div>,
      key: 4,
      dataIndex: "parcel",
    },
    {
      title: t("demandedPerson"),
      key: 5,
      dataIndex: "requestingWorker",
    },
    {
      title: t("countryOfOrigin"),
      key: 6,
      dataIndex: "country",
    },
    {
      title: t("dateMustBuy"),
      key: 7,
      dataIndex: "requiredDate",
    },
    {
      title: t("expirationDate"),
      key: 8,
      dataIndex: "expirationDate",
    },
  ];

  const values = demand.demandProducts.map((p, index) => {
    let pr = p.product;
    let demandType = "";
    let demandObject = "";
    if (pr.reserveName !== null) {
      demandType = "Ehtiyat";
      demandObject = pr.reserveName;
    } else if (pr.fertilizerKind !== null) {
      demandType = "Dərman və gübrə";
      demandObject =
        (pr.fertilizerKind ? pr.fertilizerKind + " / " : "") +
        (pr.mainIngredient ? pr.mainIngredient + " / " : "") +
        (pr.name || "");
    } else if (pr.cropCategory !== null) {
      demandType = "Məhsul";
      demandObject =
        (pr.cropCategory ? pr.cropCategory + " / " : "") +
        (pr.cropSortName ? pr.cropSortName + " / " : "") +
        (pr.cropName || "");
    }
    return {
      ...p,
      key: index + 1,
      requiredDate: moment(p.requiredDate).format("DD-MM-YYYY"),
      expirationDate: moment(p.expirationDate).format("DD-MM-YYYY"),
      demandType,
      demandObject,
      amount: p.quantity + " " + (pr.measurementUnit || "kq"),
    };
  });

  return (
    <Table
      size="small"
      className="bg-white w-100"
      columns={modalColumns}
      dataSource={convertColumns(values, cols)}
      pagination={{ pageSize: 10, current_page: 1 }}
    />
  );
};

export default View;
