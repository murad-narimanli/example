import React from "react";
import Loader from "./Elements/Loader";
import { connect } from "react-redux";
import TopMenu from "./Layout/TopMenu/TopMenu";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./Layout/Login/Login";
import Home from "./Layout/Home/Home";
import Positions from "./Pages/Admin/Positions/Positions";
import Permissions from "./Pages/Admin/Permissions/Permissions";
import Todos from "./Pages/Admin/Todos/Todos";
import Users from "./Pages/Admin/Users/Users";
import TypeAndConditions from "./Pages/Admin/TypeAndConditions/TypeAndConditions";
import StorageSettings from "./Pages/Admin/StorageSettings/StorageSettings";
import BasicTemplate from "./Pages/Finance/BasicTemplate/BasicTemplate";
import { getUserData } from "./../redux/actions";
import MenuList from "./Elements/MenuList";
import Daily from "./Pages/BusinessPlanning/Daily/Daily";
import PurchasesOnWait from "./Pages/Warehouse/PurchasesOnWait/PurchasesOnWait";
import Reserves from "./Pages/Warehouse/Reserves/Reserves";
import Products from "./Pages/Warehouse/Products/Products";
import DrugAndFertilizers from "./Pages/Warehouse/DrugAndFertilizers/DrugAndFertilizers";
import Workers from "./Pages/HumanResources/Workers/Workers";
import Areas from "./Pages/Admin/Areas/Areas";
import ClientAndConsumers from "./Pages/Admin/ClientAndConsumers/ClientAndConsumers";
import DailyFinancialReports from "../components/Pages/DailyFinancialReports/DailyFinancialReports";
import Yearly from "./Pages/BusinessPlanning/Yearly/Yearly";
import Reports from "./Pages/Reports/Reports";
import BottomMenu from "./Elements/BottomMenu";
import Register from "./Layout/Register/Register";
import Demands from "./Pages/Warehouse/Demands/Demands";
import Purchases from "./Pages/Warehouse/Purchases/Purchases";
import Statistics from "./Pages/BusinessPlanning/Statistics";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { Button, Drawer, notification } from "antd";
import logo from "../assets/img/logo.png";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SmileOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { withTranslation } from "react-i18next";
import history from "../const/history";
import LeafletMap from "../components/Pages/Map/LeafletMap";
import MapNew from "./Pages/Map/Map";
import Header from "./Layout/Header/Header";
import About from "./Layout/About/About";
import Packs from "./Layout/Packs/Packs";
import ProductPage from "./Layout/ProductPage/ProductPage";
import Keys from "./Pages/İntegrations/Weatherlink/Keys/Keys";
const { Content, Sider } = Layout;

class App extends React.Component {
  state = {
    collapsed: window.innerWidth < 1200,
    web: true,
    ismap: false,
    stocks: null,
    isWhite: true
  };

  toggleButtons = () => {
    const className = `flex sider-btn ${
      this.state.collapsed ? "all-center" : "flex-between open"
    }`;
    return (
      <div className={className}>
        {!this.state.collapsed ? (
          <Link to="/">
            {" "}
            <img src={logo} alt="" />{" "}
          </Link>
        ) : null}
        <Button type="primary" onClick={this.onCollapse}>
          {this.state.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
    );
  };


  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
    this.setState({ web: window.innerWidth > 1200 });
  };

  componentDidMount() {
    this.props.getUserData();
    this.setState({ web: window.innerWidth > 1200 });
    window.addEventListener("resize", () => {
      this.setState({
        web: window.innerWidth > 1200,
        collapsed: window.innerWidth < 1200,
      });
    });
    this.setState({ ismap: window.location.pathname === "/" , isWhite: window.location.pathname === "/"  });
    history.listen((location) => {
      this.setState({ ismap: location.pathname === "/" , isWhite: location.pathname === "/" });
    });
  }

  componentDidUpdate(prevProps) {
    const prev = prevProps.notification;
    const curr = this.props.notification;
    if (prev.notify !== curr.notify) {
      let desc = !curr.isHappy
        ? curr.description?.status === 400
          ? curr.description.data
          : this.props.t("errorMessage")
        : curr.description;
      notification.info({
        message: curr.isHappy
          ? this.props.t("successMessage")
          : this.props.t("errMessage"),
        description: desc.length ? desc : null,
        icon: curr.isHappy ? <SmileOutlined /> : <FrownOutlined />,
      });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <>
        {this.props.isLoading ? <Loader /> : null}
        {this.props.isLoggedIn ? (
          <>
            <div id="page">
              <Layout className="letside">
                {this.state.web ? (
                  <Sider
                    className="side-menu"
                    style={{ backgroundColor: "white" }}
                    collapsed={this.state.collapsed}
                    collapsedWidth={80}
                    onCollapse={this.onCollapse}
                    width={300}
                  >
                    {this.toggleButtons()}
                    <MenuList collapsed={this.state.collapsed} />
                    <BottomMenu />
                  </Sider>
                ) : (
                  <Drawer
                    className="drawer"
                    width={320}
                    title={this.toggleButtons()}
                    placement="left"
                    closable={false}
                    onClose={this.onCollapse}
                    visible={!this.state.collapsed}
                    key="key"
                  >
                    <MenuList collapsed={this.state.collapsed} />
                    <BottomMenu />
                  </Drawer>
                )}
                <Layout
                  className={
                    this.state.collapsed
                      ? "collapsedRight"
                      : "nonCollapsedRight"
                  }
                >
                  <TopMenu
                    toggleDrawer={this.onCollapse}
                    showDrawerButton={!this.state.web}
                    collapsed={this.state.collapsed}
                  />
                  <Content>
                    <div
                      className={`page-routes ${
                        this.state.ismap ? "isMap" : ""
                      }`}
                    >
                      <Switch>
                        <Route
                          exact
                          path={`/admin/positions`}
                          component={Positions}
                        />
                        <Route
                          exact
                          path={`/admin/permissions`}
                          component={Permissions}
                        />
                        <Route exact path={`/admin/users`} component={Users} />
                        <Route exact path={`/admin/todos`} component={Todos} />
                        <Route
                          exact
                          path={`/admin/type-and-conditions`}
                          component={TypeAndConditions}
                        />
                        <Route
                          exact
                          path={`/admin/storage-settings`}
                          component={StorageSettings}
                        />
                        <Route exact path={`/admin/areas`} component={Areas} />
                        <Route
                          exact
                          path={`/admin/client-and-consumers`}
                          component={ClientAndConsumers}
                        />
                        <Route
                          exact
                          path={`/human-resources/workers`}
                          component={Workers}
                        />
                        <Route
                          exact
                          path={`/warehouse/demands`}
                          component={Demands}
                        />
                        <Route
                          exact
                          path={`/warehouse/purchases`}
                          component={Purchases}
                        />
                        <Route
                          exact
                          path={`/warehouse/reserves`}
                          component={Reserves}
                        />
                        <Route
                          exact
                          path={`/warehouse/products`}
                          component={Products}
                        />
                        <Route
                          exact
                          path={`/warehouse/history`}
                          render={() => <p>History</p>}
                        />
                        <Route
                          exact
                          path={`/warehouse/purchases-on-wait`}
                          component={PurchasesOnWait}
                        />
                        <Route
                          exact
                          path={`/warehouse/drug-and-fertilizers`}
                          component={DrugAndFertilizers}
                        />
                        <Route
                          exact
                          path={`/work-plan/daily`}
                          component={Daily}
                        />
                        <Route
                          exact
                          path={`/work-plan/annual`}
                          component={Yearly}
                        />
                        <Route
                          exact
                          path={`/daily-financial-reports`}
                          component={DailyFinancialReports}
                        />
                        <Route
                            exact
                            path={`/weatherlink/keys`}
                            component={Keys}
                        />
                        <Route exact path={`/reports`} component={Reports} />
                        <Route exact path={`/finance/operation-types`}>
                          <BasicTemplate
                            url={"temporaryoperationkinds"}
                            heading={t("operationTypes")}
                            page={"operationTypes"}
                          />
                        </Route>
                        <Route exact path={`/finance/payment-types`}>
                          <BasicTemplate
                            url={"temporaryaccountkinds"}
                            heading={t("paymentTypes")}
                            page={"paymentTypes"}
                          />
                        </Route>
                        <Route exact path={`/finance/account-types`}>
                          <BasicTemplate
                            url={"temporarypayaccounts"}
                            heading={t("accountTypes")}
                            page={"accountTypes"}
                          />
                        </Route>
                        <Route exact path={`/finance/area-names`}>
                          <BasicTemplate
                            url={"temporaryparcels"}
                            heading={t("areaNames")}
                            page={"areaNames"}
                          />
                        </Route>
                        <Route exact path={`/finance/customers`}>
                          <BasicTemplate
                            url={"temporarycustomers"}
                            heading={t("customers")}
                            page={"customers"}
                          />
                        </Route>
                        <Route exact path={`/finance/operation-points`}>
                          <BasicTemplate
                            url={"temporaryinandoutitems"}
                            heading={t("operationPoints")}
                            page={"operationPoints"}
                          />
                        </Route>
                        <Route exact path={`/finance/sectors`}>
                          <BasicTemplate
                            parcel={true}
                            url={"temporarysectors"}
                            heading={t("sectors")}
                            page={"sectors"}
                          />
                        </Route>
                        <Route exact path={`/map`} component={MapNew}></Route>
                        <Route
                          exact
                          path={"/statistics"}
                          component={Statistics}
                        ></Route>
                        <Route exact path={`/`} component={LeafletMap}></Route>
                        <Redirect to="/" />
                        <Route path="/">
                          <p className='flex all-center h-100vh'>Not found</p>
                        </Route>
                      </Switch>
                    </div>
                  </Content>
                </Layout>
              </Layout>
            </div>
          </>
        ) : (
          <>
            <Header isWhite={this.state.isWhite}/>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/about" component={About} />
              <Route exact path="/packs" component={Packs} />
              <Route exact path="/products" component={ProductPage} />
                {/* <Route exact path="/register" component={Register}/> */}
              <Route path="/">
                <p className='flex all-center h-100vh'>Not found</p>
              </Route>
            </Switch>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ user, loader, notification }) => {
  return {
    isLoggedIn: user.isLoggedIn,
    // isLoggedIn: true,
    isLoading: loader,
    notification,
  };
};

const exp = withTranslation()(App);
export default connect(mapStateToProps, { getUserData })(exp);
