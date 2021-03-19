import React from "react";
import "@ant-design/compatible/assets/index.css";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Tooltip,
  Popconfirm,
  Select,
} from "antd";
import {
  UnorderedListOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import StoreHouseForm from "./Forms/StoreForm";
import MedicinesForm from "./Forms/MedicinesForm";
import ActiveIngredientsForm from "./Forms/ActiveIngredientsForm";
import PlantCategoryForm from "./Forms/PlantCategoryForm";
import PlantProductsForm from "./Forms/PlantProductsForm";
import PlantSortsForm from "./Forms/PlantSortsForm";
import Reproduction from "./Forms/Reproduction";
import ReservesForm from "./Forms/ReservesForm";
import ToolsForm from "./Forms/ToolForm";
import WarehouseCategories from "./Forms/WarehouseCategories";
import agros from "./../../../../const/api";
import { withTranslation } from "react-i18next";
import { convertColumns } from "../../../../utils/columnconverter";
import {connect} from "react-redux";
import {notify} from "../../../../redux/actions";

const { Option } = Select;

const urls = {
  StoreHouse: "warehouse",
  StoreHouseCategories: "warehousecategories",
  Medicines: "drugandfertilizer",
  ActiveIngredients: "mainingredient",
  PlantCategories: "cropcategories",
  PlantProducts: "crop",
  Plantsorts: "cropsort",
  Reproduction: "reproduction",
  Reserves: "reserve",
  Tools: "tools",
};

const mappers = {
  StoreHouse: "warehouses",
  StoreHouseCategories: "warehouseCategories",
  Medicines: "drugandFertilizers",
  ActiveIngredients: "mainIngredients",
  PlantCategories: "cropCategories",
  PlantProducts: "plantProducts",
  Plantsorts: "plantProductSorts",
  Reproduction: "reproductions",
  Reserves: "reserves",
  Tools: "tools",
};

class StorageSettings extends React.Component {
  admin = this.props.perms.administrator.subs;

  cols = [
    { key: "index", value: "#", con: true },
    { key: "category", value: this.props.t("typeOf"), con: true },
    {
      key: "measurementUnit",
      value: this.props.t("measurementUnit"),
      con: true,
    },
    {
      key: "quantityPerHundred",
      value: this.props.t("hundredliterRatio"),
      con: true,
    },
    { key: "name", value: this.props.t("name"), con: true },
    { key: "buttons", value: "", con: false },
  ];
  // table data columns
  initialColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "1",
    },
    {
      title: this.props.t("name"),
      dataIndex: "name",
      key: "2",
    },
    {
      title: "",
      dataIndex: "buttons",
      key: "3",
      width: 30,
      render: (b) => <>{b}</>,
    },
  ];

  extraColumns = {
    StoreHouse: [
      {
        title: this.props.t("typeOf"),
        dataIndex: "category",
        key: "4",
      },
    ],
    StoreHouseCategories: [],
    Medicines: [
      {
        title: this.props.t("typeOf"),
        dataIndex: "fertilizerKind",
        key: "4",
      },
      {
        title: this.props.t("hundredliterRatio"),
        dataIndex: "quantityPerHundred",
        key: "5",
      },
      {
        title: this.props.t("measurementUnit"),
        dataIndex: "measurementUnit",
        key: "7",
      },
    ],
    ActiveIngredients: [
      {
        title: this.props.t("typeOf"),
        dataIndex: "category",
        key: "4",
      },
    ],
    PlantCategories: [],
    Tools: [],
    PlantProducts: [
      {
        title: this.props.t("typeOf"),
        dataIndex: "category",
        key: "4",
      },
    ],
    Plantsorts: [
      {
        title: this.props.t("typeOf"),
        dataIndex: "category",
        key: "4",
      },
    ],
    Reproduction: [],
    Reserves: [
      {
        title: this.props.t("measurementUnit"),
        dataIndex: "measurementUnit",
        key: "4",
      },
    ],
  };

  state = {
    forms: {
      StoreHouse: {
        items: [],
        page: 1,
        editing: null,
      },
      StoreHouseCategories: {
        items: [],
        page: 1,
        editing: null,
      },
      Medicines: {
        items: [],
        page: 1,
        editing: null,
      },
      ActiveIngredients: {
        items: [],
        page: 1,
        editing: null,
      },
      PlantCategories: {
        items: [],
        page: 1,
        editing: null,
      },
      Tools: {
        items: [],
        page: 1,
        editing: null,
      },
      PlantProducts: {
        items: [],
        page: 1,
        editing: null,
      },
      Plantsorts: {
        items: [],
        page: 1,
        editing: null,
      },
      Reproduction: {
        items: [],
        page: 1,
        editing: null,
      },
      Reserves: {
        items: [],
        page: 1,
        editing: null,
      },
    },
    selected: "StoreHouse",
    columns: this.initialColumns,
    editing: null,
  };

  // notification component
  openNotification = () => {
    this.props.notify("", true);
  };

  insertExtraColumns = () => {
    const columns = [...this.initialColumns];
    this.extraColumns[this.state.selected].forEach((e, index) => {
      columns.splice(2 + index, 0, e);
    });
    this.setState({ columns });
  };

  selectHandleChange = (selected) => {
    this.setState({ selected }, () => {
      this.getTableData();
      this.insertExtraColumns();
    });
  };

  cancelEdit = () => {
    const s = this.state.selected;
    const forms = { ...this.state.forms };
    if (forms[s].editing === null) {
      forms[s].editing = undefined;
    } else {
      forms[s].editing = null;
    }
    this.setState({ forms });
  };

  renderRightSide = () => {
    const s = this.state.selected;
    switch (s) {
      case "StoreHouse":
        return (
          <StoreHouseForm
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"StoreHouse"}
            editing={this.state.forms[s].editing}
          />
        );
        case "StoreHouseCategories":
        return (
          <WarehouseCategories
              cancelEdit={this.cancelEdit}
              saveItem={this.saveItem}
              name={"StoreHouseCategories"}
              editing={this.state.forms[s].editing}
          />
        );
      case "Medicines":
        return (
          <MedicinesForm
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"Medicines"}
            editing={this.state.forms[s].editing}
          />
        );
      case "ActiveIngredients":
        return (
          <ActiveIngredientsForm
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"ActiveIngredients"}
            editing={this.state.forms[s].editing}
          />
        );
      case "PlantCategories":
        return (
          <PlantCategoryForm
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"PlantCategories"}
            items={this.state.forms[this.state.selected]}
            editing={this.state.forms[s].editing}
          />
        );
      case "Tools":
        return (
          <ToolsForm
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"Tools"}
            editing={this.state.forms[s].editing}
          />
        );
      case "PlantProducts":
        return (
          <PlantProductsForm
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"PlantProducts"}
            editing={this.state.forms[s].editing}
          />
        );
      case "Plantsorts":
        return (
          <PlantSortsForm
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"Plantsorts"}
            editing={this.state.forms[s].editing}
          />
        );
      case "Reproduction":
        return (
          <Reproduction
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"Reproduction"}
            editing={this.state.forms[s].editing}
          />
        );
      case "Reserves":
        return (
          <ReservesForm
            cancelEdit={this.cancelEdit}
            saveItem={this.saveItem}
            name={"Reserves"}
            editing={this.state.forms[s].editing}
          />
        );
      default:
        return null;
    }
  };

  getTableData = async () => {
    await agros.get(urls[this.state.selected]).then((res) => {
      const forms = this.state.forms;
      console.log(res.data)
      forms[this.state.selected].items = res.data.map((d, index) => ({
        ...d,
        index: index + 1,
        key: d.id,
        category:
          this.state.selected !== "Medicines"
            ? d.category
            : d.category === 1
            ? this.props.t("medicine")
            : this.props.t("fertilizer"),
        buttons: (
          <div className="flex flex-end">
            {this.admin.warehouseSettings.subs[mappers[this.state.selected]]
              .perms.delete && (
              <Popconfirm
                placement="topRight"
                title={this.props.t("areYouSure")}
                onConfirm={() => this.deleteItem(d.id)}
                okText={this.props.t("yes")}
                cancelText={this.props.t("no")}
              >
                <Tooltip
                  className="ml-5"
                  title={this.props.t("delete")}
                  placement="leftBottom"
                >
                  <Button className="border-none" type="text" shape="circle">
                    <DeleteFilled />
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
            {this.admin.warehouseSettings.subs[mappers[this.state.selected]]
              .perms.update && (
              <Tooltip
                className="ml-5"
                title={this.props.t("edit")}
                placement="topRight"
              >
                <Button
                  className="border-none"
                  type="text"
                  shape="circle"
                  onClick={() => this.setEditingObject(d.id)}
                >
                  <EditFilled />
                </Button>
              </Tooltip>
            )}
          </div>
        ),
      }));
      this.setState({ forms });
    });
  };

  setEditingObject = async (id) => {
    const s = this.state.selected;
    await agros.get(urls[s] + "/" + id).then((res) => {
      const forms = { ...this.state.forms };
      forms[s].editing = res.data;
      this.setState({ forms }, () => {});
    });
  };

  deleteItem = async (id) => {
    await agros.delete(`${urls[this.state.selected]}/${id}`).then((res) => {
      this.openNotification();
      this.getTableData();
    });
  };

  componentDidMount() {
    this.getTableData();
    this.insertExtraColumns();
  }

  saveItem = (object) =>
    new Promise(async (resolve, reject) => {
      const s = this.state.selected;
      if (this.state.forms[s].editing) {
        await agros
          .put(`${urls[s]}/${object.id}`, object)
          .then((res) => {
            const forms = { ...this.state.forms };
            forms[s].editing = null;
            this.setState({ forms });
            this.openNotification();
            this.getTableData();
            resolve();
          })
          .catch((err) => {
            this.props.notify("", false);
          });
      } else {
        await agros
          .post(urls[s], object)
          .then((res) => {
            const forms = { ...this.state.forms };
            forms[s].editing = undefined;
            this.setState({ forms });
            this.openNotification();
            this.getTableData();
            resolve();
          })
          .catch((err) => {
            this.props.notify("", false);
          });
      }
    });

  render() {
    const { t } = this.props;
    return (
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="border p-2 mt-0 bg-white">
            <UnorderedListOutlined className="f-20 mr5-15" />
            <span className="f-20 bold">{t("storageSettings")}</span>
          </div>
        </Col>
        <Col lg={12} xs={24}>
          <Select
            className="w-100 mb-5 menu-options"
            defaultValue="StoreHouse"
            onChange={this.selectHandleChange}
          >
            <Option value="StoreHouse">{t("warehouses")}</Option>
            <Option value="StoreHouseCategories">Anbar kateqoriyası</Option>
            <Option value="Medicines">{t("drugAndFertilizers")}</Option>
            <Option value="ActiveIngredients">{t("activeSubstances")}</Option>
            <Option value="PlantCategories">{t("productCategory")}</Option>
            <Option value="PlantProducts">{t("plantProducts")}</Option>
            <Option value="Plantsorts">{t("plantProductsSorts")}</Option>
            <Option value="Reproduction">{t("reproduction")}</Option>
            <Option value="Reserves">{t("reserves")}</Option>
            <Option value="Tools">{t("tools")}</Option>
          </Select>
          <Table
            size="small"
            className="bg-white"
            columns={this.state.columns}
            dataSource={convertColumns(
              this.state.forms[this.state.selected].items,
              this.cols
            )}
            pagination={{
              pageSize: 10,
              current_page: 1,
              total: this.state.forms[this.state.selected].items.length,
            }}
          />
        </Col>
        <Col lg={12} xs={24}>
          <Card title={t("addTo")}>{this.renderRightSide()}</Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};
const exp = withTranslation()(StorageSettings);
export default connect(mapStateToProps, { notify })(exp);
