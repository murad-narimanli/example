import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, Tooltip, Modal } from "antd";
import { FileSyncOutlined, PlusCircleOutlined } from "@ant-design/icons";
import AddReserve from "./Modals/AddReserve";
import agros from "../../../../const/api";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import Authorize from "../../../Elements/Authorize";

const PurchasesOnWait = (props) => {
  const { t } = useTranslation();
  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "productName", value: t("name"), con: true },
    { key: "supplierName", value: t("consumer"), con: true },
    { key: "fertilizerKind", value: t("typeOf"), con: true },
    { key: "mainIngredient", value: t("activeSubstance"), con: true },
    { key: "quantity", value: t("quantityOf"), con: true },
    { key: "index", value: "", con: false },
  ];

  const [purchases, setPurchases] = useState([]);
  const [selected, setSelected] = useState(0);
  let [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const getPurchases = () => {
      agros.get("medicalstock/medicalpurchase").then((res) => {
        setPurchases(
          res.data.map((r, index) => {
            return { ...r, key: index + 1, index, tableIndex: index + 1 };
          })
        );
      });
    };
    getPurchases();
  }, [trigger , t]);
  const [visibleViewReserves, setVisibleViewReserves] = React.useState(false);

  const initialColumns = [
    {
      title: "#",
      dataIndex: "tableIndex",
      key: "1",
      width: 60,
    },
    {
      title: t("consumer"),
      dataIndex: "supplierName",
      key: "2",
    },
    {
      title: t("name"),
      dataIndex: "productName",
      key: "3",
    },
    {
      title: t("typeOf"),
      dataIndex: "fertilizerKind",
      key: "4",
    },
    {
      title: t("activeSubstance"),
      dataIndex: "mainIngredient",
      key: "5",
    },
    {
      title: t("quantityOf"),
      dataIndex: "quantity",
      key: "6",
    },
    {
      title: "",
      dataIndex: "index",
      key: "9",
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Authorize
                mainMenu={'warehouse'}
                page={['purchasesOnWait','perms']}
                type={'addToReserves'}
            >
              <Tooltip
                placement="leftBottom"
                className="ml-5"
                title={t("addToReserves")}
              >
                <Button
                  className="border-none"
                  shape="circle"
                  onClick={() => setViewingRow(i)}
                >
                  <PlusCircleOutlined />
                </Button>
              </Tooltip>
            </Authorize>
          </div>
        );
      },
    },
  ];

  const setViewingRow = (index) => {
    setSelected(index);
    setVisibleViewReserves(true);
  };

  const triggerFetch = () => {
    setTrigger(++trigger);
  };

  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="border  flex p-2 mt-0 bg-white">
            <div>
              <FileSyncOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("purchasesOnWait")}</span>
            </div>
          </div>
        </Col>
        <Col xs={24}>
          <Table
            size="small"
            className="bg-white"
            columns={initialColumns}
            dataSource={convertColumns(purchases, cols)}
            pagination={{
              current_page: 1,
              pageSizeOptions: ["10", "15", "20", "25", "30"],
              showSizeChanger: true,
            }}
          />
        </Col>
      </Row>

      <Modal
        title={t("addToReserves")}
        centered
        className="addTaskModal padModal"
        visible={visibleViewReserves}
        onCancel={() => setVisibleViewReserves(false)}
        footer={null}
      >
        <AddReserve
          reserve={purchases[selected]}
          visibleViewReserves={visibleViewReserves}
          triggerFetch={triggerFetch}
          setVisibleViewReserves={setVisibleViewReserves}
        />
      </Modal>
    </div>
  );
}

export default PurchasesOnWait;
