import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, Select, Modal } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import AddNewModal from "./Modals/AddNewModal";
import agros from "../../../const/api";
import moment from "moment";
import {useTranslation} from "react-i18next";
import { convertColumns } from "../../../utils/columnconverter";
import {connect} from "react-redux";
const { Option } = Select;

const DailyFinancialReports = (props) => {
  const { t } = useTranslation();

  const cols = [
    { key: "tableIndex", value: "#", con: true },
    { key: "user", value: t("demandedPerson"), con: true },
    { key: "quantity", value: t("moneyQuantity"), con: true },
    { key: "temporaryOperationKind", value: t("operationType"), con: true },
    { key: "temporaryInAndOutItems", value: t("operationItem"), con: true },
    { key: "temporaryAccountKind", value: t("paymentType"), con: true },
    { key: "temporaryCustomer", value: t("client"), con: true },
    { key: "temporaryPayAccount", value: t("bankAccountName"), con: true },
    { key: "temporaryParcel", value: t("areaName"), con: true },
    { key: "temporarySector", value: t("sector"), con: true },
    { key: "date", value: t("date"), con: true },
    { key: "id", value: "", con: false },
  ];

  const [tables, setTables] = useState({
    all: { data: [] },
    import: { data: [] },
    export: { data: [] },
  });
  const [selected, setSelected] = useState("all");
  const [visibleAddNew, setVisibleAddNew] = useState(false);
  let [trigger, setTrigger] = useState(0);

  const getTable = (val) => {
    switch (val) {
      case "all":
        return "";
      case "import":
        return "9";
      case "export":
        return "8";
      default:
        break;
    }
  };

  const triggerFetch = () => {
    setTrigger(++trigger);
  };

  useEffect(() => {
    const getData = () => {
      agros
        .get(`temporaryexsels?operationkindid=${getTable(selected)}`)
        .then((res) => {
          const all = { ...tables };
          all[selected].data = res.data.map((r, index) => {
            return {
              ...r,
              key: index + 1,
              index,
              tableIndex: index + 1,
              date: moment(r.date).format("DD MM YYYY"),
            };
          });
          setTables(all);
        });
    };
    if (!tables[selected].data.length) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, t, trigger]);

  // table data columns
  const initialColumns = [
    {
      title: "#",
      dataIndex: "tableIndex",
      key: "1",
      width: 60,
    },
    {
      title: t("demandedPerson"),
      dataIndex: "user",
      key: "2",
    },
    {
      title: t("moneyQuantity"),
      dataIndex: "quantity",
      key: "4",
    },
    {
      title: t("date"),
      dataIndex: "date",
      key: "5",
    },
    {
      title: t("operationType"),
      dataIndex: "temporaryOperationKind",
      key: "6",
    },
    {
      title: t("operationItem"),
      dataIndex: "temporaryInAndOutItems",
      key: "7",
    },
    {
      title: t("client"),
      dataIndex: "temporaryCustomer",
      key: "8",
    },
    {
      title: t("paymentType"),
      dataIndex: "temporaryAccountKind",
      key: "9",
    },
    {
      title: t("bankAccountName"),
      dataIndex: "temporaryPayAccount",
      key: "10",
    },
    {
      title: t("areaName"),
      dataIndex: "temporaryParcel",
      key: "11",
    },
    {
      title: t("sector"),
      dataIndex: "temporarySector",
      key: "12",
    },
  ];

  const handleSelectedChange = (val) => {
    setSelected(val);
  };

  return (
    <div>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="border  page-heading flex p-2 mt-0 bg-white">
            <div className="page-name small-name">
              <UnorderedListOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("dailyreports")}</span>
            </div>
            {props.perms.dailyFinancialReports.perms.create &&
            <Button onClick={() => setVisibleAddNew(true)} type="primary">
              {t("addTo")}
            </Button>
            }
          </div>
        </Col>
        <Col xs={24}>
          <Select
            className="w-100 mb-10"
            defaultValue="all"
            onChange={handleSelectedChange}
          >
            <Option value="all">{t("allOf")}</Option>
            <Option value="import">{t("import")}</Option>
            <Option value="export">{t("export")}</Option>
          </Select>
          <Table
            size="small"
            className="bg-white"
            columns={initialColumns}
            dataSource={convertColumns(tables[selected].data, cols)}
            pagination={{
              pageSize: 10,
              current_page: 1,
            }}
          />
        </Col>
      </Row>

      <Modal
        title={t("addTo")}
        centered
        className="addTaskModal padModal"
        visible={visibleAddNew}
        onOk={() => setVisibleAddNew(false)}
        onCancel={() => setVisibleAddNew(false)}
        footer={false}
      >
        <AddNewModal
          triggerFetch={triggerFetch}
          visibleAddNew={visibleAddNew}
          setVisibleAddNew={setVisibleAddNew}
        />
      </Modal>
    </div>
  );
};
const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};
export default connect(mapStateToProps )(DailyFinancialReports);
