import React from "react";
import {Col, Row, Tabs} from "antd";
import Drugs from "./Statistics/Drugs";
// import Reserves from "./Statistics/Reserves";
import Tools from "./Statistics/Tools";
import Workers from "./Statistics/Workers";
import Products from "./Statistics/Products";
import Todos from "./Statistics/Todos";
import "./stats.css";
import {UnorderedListOutlined} from "@ant-design/icons";
const { TabPane } = Tabs;

const Statistics = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="border page-heading flex p-2 mt-0 bg-white">
            <div className="page-name small-name">
              <UnorderedListOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">Statistika</span>
            </div>
          </div>
        </Col>
        <Col xs={24}>
          <div className="page border">
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="Dərman və gübrələr" key="1">
                <Drugs/>
              </TabPane>
              <TabPane tab="Məhsullar" key="2">
                <Products/>
              </TabPane>
              {/* <TabPane tab="Ehtiyatlar" key="3">
            <Reserves/>
          </TabPane> */}
              <TabPane tab="Alətlər" key="4">
                <Tools/>
              </TabPane>
              <TabPane tab="İşçilər" key="5">
                <Workers/>
              </TabPane>
              <TabPane tab="Görülən işlər" key="6">
                <Todos/>
              </TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
