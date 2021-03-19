import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  QuestionCircleOutlined,
  PicCenterOutlined,
  UpCircleOutlined,
  SnippetsOutlined,
  FundOutlined,
  LineChartOutlined,
  AimOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getStock } from "./../../redux/actions";

const { SubMenu } = Menu;

const MenuList = ({ collapsed, perms, stock, getStock }) => {
  console.log(stock);
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState([]);

  const rootSubmenuKeys = ["11", "21", "31", "41", "51", "61" , "71"];

  useEffect(() => {
    getStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOpenChange = (openKeysList) => {
    const latestOpenKey = openKeysList.find(
      (key) => openKeys.indexOf(key) === -1
    );
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeysList);
    } else {
      const opens = latestOpenKey ? [latestOpenKey] : [];
      setOpenKeys(opens);
    }
  };

  return (
    <Menu
      openKeys={openKeys}
      // inlineCollapsed={collapsed}
      mode="inline"
      theme="light"
      onOpenChange={onOpenChange}
      className="menu-ul"
    >
      {perms.administrator.perms.read && (
        <SubMenu
          key="11"
          title={
            <span>
              <FundOutlined />
              <span>{t("admin")}</span>
            </span>
          }
        >
          {perms.administrator.subs.positions.perms.read && (
            <Menu.Item key="12">
              <Link to={`/admin/positions`}>
                <span>{t("positions")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.administrator.subs.permissions.perms.read && (
            <Menu.Item key="13">
              <Link to={`/admin/permissions`}>
                <span>{t("permissions")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.administrator.subs.users.perms.read && (
            <Menu.Item key="14">
              <Link to={`/admin/users`}>
                <span>{t("users")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.administrator.subs.warehouseSettings.perms.read && (
            <Menu.Item key="15">
              <Link to={`/admin/storage-settings`}>
                <span>{t("storageSettings")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.administrator.subs.users.perms.read && (
            <Menu.Item key="16">
              <Link to={`/admin/areas`}>
                <span>{t("areas")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.administrator.subs.typesAndConditions.perms.read && (
            <Menu.Item key="17">
              <Link to={`/admin/type-and-conditions`}>
                <span>{t("typeAndConditions")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.administrator.subs.clientAndConsumers.perms.read && (
            <Menu.Item key="18">
              <Link to={`/admin/client-and-consumers`}>
                <span>{t("clientAndConsumers")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.administrator.subs.todos.perms.read && (
            <Menu.Item key="19">
              <Link to={`/admin/todos`}>
                <span>{t("todos")}</span>
              </Link>
            </Menu.Item>
          )}
        </SubMenu>
      )}
      {perms.hr.perms.read && (
        <SubMenu
          key="21"
          title={
            <span>
              <SnippetsOutlined />
              <span>{t("humanResources")}</span>
            </span>
          }
        >
          {perms.hr.subs.workers.perms.read && (
            <Menu.Item key="22">
              <Link to={`/human-resources/workers`}>
                <span>{t("workers")}</span>
              </Link>
            </Menu.Item>
          )}
        </SubMenu>
      )}
      {perms.warehouse.perms.read && (
        <SubMenu
          key="31"
          title={
            <span>
              <AimOutlined />
              <span>{t("warehouse")}</span>
            </span>
          }
        >
          {perms.warehouse.subs.demands.perms.read && (
            <Menu.Item key="32">
              <Link to={`/warehouse/demands`}>
                <span>{t("demands")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.warehouse.subs.purchases.perms.read && (
            <Menu.Item key="33">
              <Link to={`/warehouse/purchases`}>
                <span>{t("purchases")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.warehouse.subs.purchasesOnWait.perms.read && (
            <Menu.Item key="34">
              <Link to={`/warehouse/purchases-on-wait`}>
                <span>{t("purchasesOnWait")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.warehouse.subs.drugAndFertilizers.perms.read && (
            <Menu.Item key="35">
              <Link to={`/warehouse/drug-and-fertilizers`}>
                <span className={stock && stock.medicalStock > 0 ? "red" : ""}>
                  {t("drugAndFertilizersWarehouse")}{" "}
                  {stock && stock.medicalStock > 0 ? (
                    <ExclamationCircleOutlined />
                  ) : (
                    ""
                  )}
                </span>
              </Link>
            </Menu.Item>
          )}
          {perms.warehouse.subs.productsWarehouse.perms.read && (
            <Menu.Item key="36">
              <Link to={`/warehouse/products`}>
                <span className={stock && stock.cropStock > 0 ? "red" : ""}>
                  {t("productWarehouse")}{" "}
                  {stock && stock.cropStock > 0 ? (
                    <ExclamationCircleOutlined />
                  ) : (
                    ""
                  )}
                </span>
              </Link>
            </Menu.Item>
          )}
          {perms.warehouse.subs.reservesWarehouse.perms.read && (
            <Menu.Item key="37">
              <Link to={`/warehouse/reserves`}>
                <span className={stock && stock.reserveStock > 0 ? "red" : ""}>
                  {t("reserveWarehouse")}{" "}
                  {stock && stock.reserveStock > 0 ? (
                    <ExclamationCircleOutlined />
                  ) : (
                    ""
                  )}
                </span>
              </Link>
            </Menu.Item>
          )}
        </SubMenu>
      )}
      {perms.workplan.perms.read && (
        <SubMenu
          key="41"
          title={
            <span>
              <PicCenterOutlined />
              <span>{t("businessPlanning")}</span>
            </span>
          }
        >
          {perms.workplan.subs.annual.perms.read && (
            <Menu.Item key="42">
              <Link to={`/work-plan/annual`}>
                <span>{t("yearly")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.workplan.subs.daily.perms.read && (
            <Menu.Item key="43">
              <Link to={`/work-plan/daily`}>
                <span>{t("daily")}</span>
              </Link>
            </Menu.Item>
          )}
          <Menu.Item key="44">
            <Link to="/statistics">
              <span>Statistika</span>
            </Link>
          </Menu.Item>
        </SubMenu>
      )}
      {perms.financeAdminstrator.perms.read && (
        <SubMenu
          key="51"
          title={
            <span>
              <UpCircleOutlined />
              <span>{t("financeAdmin")}</span>
            </span>
          }
        >
          {perms.financeAdminstrator.subs.operationTypes.perms.read && (
            <Menu.Item key="52">
              <Link to={`/finance/operation-types`}>
                <span>{t("operationTypes")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.financeAdminstrator.subs.paymentTypes.perms.read && (
            <Menu.Item key="53">
              <Link to={`/finance/payment-types`}>
                <span>{t("paymentTypes")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.financeAdminstrator.subs.accountTypes.perms.read && (
            <Menu.Item key="54">
              <Link to={`/finance/account-types`}>
                <span>{t("accountTypes")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.financeAdminstrator.subs.areaNames.perms.read && (
            <Menu.Item key="55">
              <Link to={`/finance/area-names`}>
                <span>{t("areaNames")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.financeAdminstrator.subs.customers.perms.read && (
            <Menu.Item key="56">
              <Link to={`/finance/customers`}>
                <span>{t("customers")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.financeAdminstrator.subs.operationPoints.perms.read && (
            <Menu.Item key="57">
              <Link to={`/finance/operation-points`}>
                <span>{t("operationPoints")}</span>
              </Link>
            </Menu.Item>
          )}
          {perms.financeAdminstrator.subs.sectors.perms.read && (
            <Menu.Item key="58">
              <Link to={`/finance/sectors`}>
                <span>{t("sectors")}</span>
              </Link>
            </Menu.Item>
          )}
        </SubMenu>
      )}
      {/*{perms.weatherlink.perms.read && (*/}
      {/*<SubMenu*/}
      {/*    key="71"*/}
      {/*    title={*/}
      {/*      <span>*/}
      {/*        <LineChartOutlined />*/}
      {/*        <span>Weatherlink</span>*/}
      {/*      </span>*/}
      {/*    }*/}
      {/*>*/}
      {/*  {perms.weatherlink.subs.keys.perms.read && (*/}
      {/*  <Menu.Item key="72">*/}
      {/*    <Link to={`/weatherlink/keys`}>*/}
      {/*      <span>Avadanlıq açarları</span>*/}
      {/*    </Link>*/}
      {/*  </Menu.Item>*/}
      {/*  )}*/}
      {/*</SubMenu>*/}
      {/*)}*/}
      {perms.dailyFinancialReports.perms.read && (
        <Menu.Item key="1">
          <Link to={`/daily-financial-reports`}>
            <QuestionCircleOutlined />
            <span>{t("dailyFinancialReports")}</span>
          </Link>
        </Menu.Item>
      )}
    </Menu>
  );
};

const mapStateToProps = ({ user, stock }) => {
  return { perms: user.data.userPermissions, stock };
};

export default connect(mapStateToProps, { getStock })(MenuList);
