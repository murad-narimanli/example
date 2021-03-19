import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button, Tooltip, Popconfirm, Modal } from "antd";
import {
  UnorderedListOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import agros from "../../../../const/api";
import Sectors from "./Modals/Sectors";
import EditArea from "./Modals/EditArea";
import Authorize from "../../../Elements/Authorize";
import { useTranslation } from "react-i18next";
import {
  convertColumns,
  createColumns,
} from "../../../../utils/columnconverter";

const Areas = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [visibleAddArea, setVisibleAddArea] = useState(false);
  let [trigger, setTrigger] = useState(0);

  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("areaName"), con: true },
    { key: "parcelRegion", value: t("region"), con: true },
    { key: "parcelCategory", value: t("category"), con: true },
    { key: "respondent", value: t("respondentPeople"), con: true },
    { key: "treeCount", value: t("treeNumber"), con: true },
    { key: "area", value: t("area"), con: true },
    { key: "buttons", value: "", con: false },
    { key: "parcelSectors", value: "", con: false },
  ];

  const initialColumns = [
    {
      title: t("region"),
      dataIndex: "parcelRegion",
      key: "1",
    },
    {
      title: t("category"),
      dataIndex: "parcelCategory",
      key: "2",
    },
    {
      title: t("areaName"),
      dataIndex: "name",
      key: "3",
    },
    {
      title: (
        <div>
          {t("area")} (ha)
        </div>
      ),
      dataIndex: "area",
      key: "4",
    },
    {
      title: t("treeNumber"),
      dataIndex: "treeCount",
      key: "5",
    },
    {
      title: t("respondentPeople"),
      dataIndex: "respondent",
      key: "6",
    },
    {
      title: "",
      key: "7",
      dataIndex: "buttons",
    },
  ];

  useEffect(() => {
    const getData = () => {
      agros.get("parcel").then((res) => {
        setData(
          res.data.map((r, index) => {
            return {
              ...r,
              key: index,
              buttons: (
                <div className="flex flex-end">
                  <Authorize
                    mainMenu={"administrator"}
                    page={["landParcels", "perms"]}
                    type={"delete"}
                  >
                    <Popconfirm
                      placement="bottomRight"
                      title={t("areYouSure")}
                      okText={t("yes")}
                      cancelText={t("no")}
                      onConfirm={() => deleteArea(r.id)}
                    >
                      <Tooltip className="ml-5" title={t("delete")}>
                        <Button
                          className="border-none"
                          type="text"
                          shape="circle"
                        >
                          <DeleteFilled />
                        </Button>
                      </Tooltip>
                    </Popconfirm>
                  </Authorize>
                  <Authorize
                    mainMenu={"administrator"}
                    page={["landParcels", "perms"]}
                    type={"update"}
                  >
                    <Tooltip
                      className="ml-5"
                      title={t("edit")}
                      placement="topRight"
                    >
                      <Button
                        onClick={() => editArea(r.id)}
                        className="border-none"
                        type="text"
                        shape="circle"
                      >
                        <EditFilled />
                      </Button>
                    </Tooltip>
                  </Authorize>
                </div>
              ),
            };
          })
        );
      });
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, t]);

  const deleteArea = (i) => {
    agros.delete(`parcel/${i}`).then((res) => {
      setTrigger(++trigger);
    });
  };

  const triggerFetch = () => {
    setTrigger(++trigger);
  };

  const editArea = (id) => {
    setEditing(id);
    setVisibleAddArea(true);
  };

  const addNewArea = () => {
    setEditing(null);
    setVisibleAddArea(true);
  };

  const getExpandIcon = (p) => {
    return p.expanded ? (
      <MinusCircleOutlined
        className="expandingIcon"
        onClick={(e) => p.onExpand(p.record, e)}
      />
    ) : (
      <PlusCircleOutlined
        className="expandingIcon"
        onClick={(e) => p.onExpand(p.record, e)}
      />
    );
  };

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="border  page-heading flex p-2 mt-0 bg-white">
            <div className="page-name">
              <UnorderedListOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("LandAreaRegulations")}</span>
            </div>
            <Authorize
              mainMenu={"administrator"}
              page={["landParcels", "perms"]}
              type={"create"}
            >
              <Button onClick={addNewArea} type="primary">
                {t("addTo")}
              </Button>
            </Authorize>
          </div>
        </Col>
        <Col xs={24}>
          <Table
            size="small"
            className="bg-white areasTable"
            expandedRowRender={(record, i) => (
              <Sectors
                triggerFetch={triggerFetch}
                parcelCategoryId={record.parcelCategoryId}
                parcel={record.id}
                sectors={record.parcelSectors}
                categoryId={record.cropCategoryId}
              />
            )}
            expandIcon={(props) => getExpandIcon(props)}
            columns={createColumns(cols, initialColumns)}
            dataSource={convertColumns(data, cols)}
            pagination={{
              pageSize: 10,
              current_page: 1,
            }}
          />
        </Col>
      </Row>

      {/*add or edit parcel*/}
      <Modal
        title={t("addNewArea")}
        centered
        className="addTaskModal padModal"
        visible={visibleAddArea}
        onOk={() => setVisibleAddArea(false)}
        onCancel={() => setVisibleAddArea(false)}
        footer={[]}
      >
        <EditArea
          editing={editing}
          setVisibleAddArea={setVisibleAddArea}
          triggerFetch={triggerFetch}
        />
      </Modal>
    </>
  );
};

export default Areas;
