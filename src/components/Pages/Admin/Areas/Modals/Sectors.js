import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Select,
  Button,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
} from "antd";
import {
  UnorderedListOutlined,
  FileMarkdownFilled,
  EditFilled,
  DeleteFilled, MinusCircleOutlined, PlusCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { convertColumns } from "../../../../../utils/columnconverter";
import { getOptions, notify } from "../../../../../redux/actions";
import { connect } from "react-redux";
import EditSector from "./EditSector";
import Authorize from "../../../../Elements/Authorize";
import agros from "../../../../../const/api";
import { noWhitespace } from "../../../../../utils/rules";
import moment from "moment";

const { Option } = Select;

const Sectors = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [keys, setKeys] = useState({});

  const [selected, setSelected] = useState(null);
  const [cropCategodyId , setCropCategodyId] = useState(null)
  const [visibleCrops, setVisibleCrops] = useState(false);
  const [visibleAddCrops, setVisibleAddCrops] = useState(false);
  const [visibleEditSector, setVisibleEditSector] = useState(false);
  const [editCrop, setEditCrop] = useState(false)
  const [parcelSectorCropsId, setParcelSectorCropsId] = useState(null)
  const { getOptions, notify } = props;
  const options = props.options[props.lang];



  useEffect(() => {
    setCropCategodyId(props.categoryId)
    getOptions(["cropSorts" , 'crops'  , 'cropCategories'], props.options, i18n.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);



  const handleKeyChange = (e, key) => {
    const all = { ...keys };
    console.log(all)
    all[key] = e;
    setKeys(all);
    form.setFieldsValue({
      CropSortId: '',
    })
  };

  const cols = [
    { key: "index", value: "#", con: true },
    { key: "name", value: t("name"), con: true },
    { key: "createdCompany", value: t("company"), con: true },
    { key: "treeCount", value: t("treeNumber"), con: true },
    {
      key: "area",
      value: (
        <div>
          {t("area")} m <sup>2</sup>
        </div>
      ),
      con: true,
    },
    { key: "id", value: "", con: false },
  ];

  const cropcols = [
    // crop columns
    { key: "cropCategory", value: t("category"), con: true },
    { key: "crop", value: t("product"), con: true },
    { key: "cropSort", value: t("productSorts"), con: true },
  ];

  const addNewCrops = (i) => {
      setVisibleAddCrops(true);
      if(i == null){
        setEditCrop(false)
        form.resetFields();
      }
      else{
        setEditCrop(true);
        props.sectors[selected].parcelSectorCrops.map((p , index) => (
                p.id === i ?
                    setCrops(p.cropSort , p.id , p.crop)
                : null
            )
        )
      }
  };

  const  setCrops = (cropsort , id , crop)=>{
    form.setFieldsValue({
      CropSortId: cropsort,
      productId:crop
    })
    setParcelSectorCropsId(id)
  }

  const cropColumns = [
    {
      title: t("category"),
      dataIndex: "cropCategory",
      key: "1",
    },
    {
      title: t("product"),
      dataIndex: "crop",
      key: "2",
    },
    {
      title: t("productSorts"),
      dataIndex: "cropSort",
      key: "3",
    },
    {
      title: "",
      key: "4",
      dataIndex: "id",
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Authorize
                mainMenu={'administrator'}
                page={['landParcels','perms']}
                type={'deleteCrop'}
            >
              <Authorize
                  mainMenu={'administrator'}
                  page={['landParcels','perms']}
                  type={'updateCrop'}
              >
                <Tooltip onClick={()=>{addNewCrops(i)}} className="ml-5" title="Redaktə et">
                  <Button className="border-none" type="text" shape="circle">
                    <EditFilled />
                  </Button>
                </Tooltip>
              </Authorize>
              <Popconfirm
                placement="bottomRight"
                title={t("areYouSure")}
                okText={t("yes")}
                cancelText={t("no")}
                onConfirm={() => deleteCrop(i)}
              >
                <Tooltip className="ml-5" title="Sil">
                  <Button className="border-none" type="text" shape="circle">
                    <DeleteFilled />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Authorize>

          </div>
        );
      },
    },
  ];

  const deleteCrop = (id) => {
    agros
      .delete(`parcel/sectorcrop/${id}`)
      .then((res) => {
        notify("", true);
        props.triggerFetch();
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };
  // table data columns
  const sectorColumns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "1",
    },
    {
      title: (
        <div>
          {t("area")} m <sup>2</sup>
        </div>
      ),
      dataIndex: "area",
      key: "2",
    },
    {
      title: t("treeNumber"),
      dataIndex: "treeCount",
      key: "3",
    },
    {
      title: t("company"),
      dataIndex: "createdCompany",
      key: "1",
    },
    {
      title: "",
      key: "4",
      dataIndex: "index",
      render: (i) => {
        return (
          <div className="flex flex-end">
            <Authorize
                mainMenu={'administrator'}
                page={['landParcels','perms']}
                type={'readCrops'}
            >
              <Tooltip title={t("crops")} placement="topLeft">
                <Button
                  className="border-none"
                  type="text"
                  shape="circle"
                  onClick={(e) => viewCrops(e, i)}
                >
                  <FileMarkdownFilled />
                </Button>
              </Tooltip>
            </Authorize>
            <Authorize
                mainMenu={'administrator'}
                page={['landParcels','perms']}
                type={'deleteSector'}
            >
              <Popconfirm
                placement="bottomRight"
                title={t("areYouSure")}
                okText={t("yes")}
                cancelText={t("no")}
                onConfirm={(e) => deleteSector(e, i)}
              >
                <Tooltip className="ml-5" title={t("delete")}>
                  <Button className="border-none" type="text" shape="circle">
                    <DeleteFilled />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Authorize>
            <Authorize
                mainMenu={'administrator'}
                page={['landParcels','perms']}
                type={'updateSector'}
            >
               <Tooltip className="ml-5" title={t("edit")} placement="topRight">
                <Button
                  onClick={(e) => editSector(e, i)}
                  className="border-none"
                  type="text"
                  shape="circle"
                >
                  <EditFilled />
                </Button>
              </Tooltip>
            </Authorize>
          </div>
        );
      },
    },
  ];

  const viewCrops = (e, index) => {
    setSelected(index);
    setVisibleCrops(true);
  };


  const tableData = props.sectors.map((p, index) => {
    return { ...p, key: index, index };
  });

  const cropTableData =
    selected !== null
      ? props.sectors[selected].parcelSectorCrops.map((d, dindex) => {
          return { ...d, key: dindex };
        })
      : [];


  const editSector = (e, index) => {
    setSelected(index);
    setVisibleEditSector(true);
  };

  const deleteSector = (e, index) => {
    agros
      .delete(`parcel/sector/${tableData[index].id}`)
      .then((res) => {
        notify("", true);
        props.triggerFetch();
      })
      .catch((err) => {
        notify(err.response, false);
      });
  };

  const saveCrops = (values) => {
    if(!editCrop){
      agros
          .post("parcel/sectorcrop", {
            ParcelSectorId: props.sectors[selected].id,
            CropSortId: values.CropSortId,
          })
          .then((res) => {
            props.triggerFetch();
            setVisibleAddCrops(false);
          });
    }
    else{
      agros
          .put(`parcel/sectorcrop/${parcelSectorCropsId}`, {
            ParcelSectorId: props.sectors[selected].id,
            CropSortId: values.CropSortId,
            Id: parcelSectorCropsId
          })
          .then((res) => {
            notify("", true);
            props.triggerFetch();
            setVisibleAddCrops(false);
          })
          .catch((err) => {
            notify(err.response, false);
          });
    }
  };



  return (
    <div className="w-100">
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="border flex-between flex p-1  flex flex-align-center px-2 mt-0">
            <div>
              <UnorderedListOutlined className="f-20 mr5-15" />
              <span className="f-20 bold">{t("sectors")}</span>
            </div>
            <Authorize
                mainMenu={'administrator'}
                page={['landParcels','perms']}
                type={'create'}
            >
              <Button onClick={(e) => editSector(e, null)} type="primary">
                {t("addTo")}
              </Button>
            </Authorize>
          </div>
        </Col>
        <Col xs={24}>
          <Table
            size="small"
            className="border sektorTable"
            columns={sectorColumns}
            dataSource={convertColumns(tableData, cols)}
            pagination={false}
          />
        </Col>
      </Row>

      {/*Crops modal*/}
      <Modal
        title={
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <div className="flex-between flex mt-0">
                <div>
                  <span className="f-20 bold">Məhsul</span>
                </div>
                <Authorize
                    mainMenu={'administrator'}
                    page={['landParcels','perms']}
                    type={'addCrop'}
                >
                  <Button onClick={()=>{addNewCrops(null)}}  type="primary">
                    {t("addTo")}
                  </Button>
                </Authorize>
              </div>
            </Col>
          </Row>
        }
        centered
        className="addTaskModal cropModal"
        visible={visibleCrops}
        onOk={() => setVisibleCrops(false)}
        onCancel={() => setVisibleCrops(false)}
        footer={[]}
      >
        <Row gutter={[10, 10]}>
          <Col xs={24}>
            <Table
              size="small"
              className="bg-white"
              columns={cropColumns}
              dataSource={convertColumns(cropTableData, cropcols)}
              pagination={{
                pageSize: 10,
                current_page: 1,
              }}
            />
          </Col>
        </Row>
      </Modal>

      {/*Add crops modal*/}
      <Modal
        title="Məhsulu və məhsul sortunu seç"
        centered
        className="padModal"
        visible={visibleAddCrops}
        onOk={() => setVisibleAddCrops(false)}
        onCancel={() => setVisibleAddCrops(false)}
        footer={null}
      >
        <Form form={form} onFinish={saveCrops}>
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Form.Item
                className="mb-5"
                validateTrigger="onChange"
                name="productId"
                rules={[noWhitespace(t("workerMustSelectError"))]}
              >
                <Select
                  onChange={(e) =>
                      handleKeyChange(e, "categoryId")
                  }
                  placeholder={
                    <span className="ml-5">{t("product")}</span>
                  }
                >
                  {options.crops
                      .filter((c) => c.categoryId === cropCategodyId)
                      .map((cp, cpindex) => {
                    return (
                      <Option key={cpindex} value={cp.id}>
                        {cp.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                  className="mb-5"
                  validateTrigger="onChange"
                  name="CropSortId"
                  rules={[noWhitespace(t("workerMustSelectError"))]}
              >
                <Select
                    placeholder={
                      <span className="ml-5">Məhsul sortu</span>
                    }
                >
                  {options.cropSorts
                      .filter((c) => c.categoryId === keys.categoryId)
                      .map((cs, csindex) => {
                    return (
                        <Option key={csindex} value={cs.id}>
                          {cs.name}
                        </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

          </Row>
          <div
            className="modalButtons"
            style={{ position: "absolute", bottom: "20px", right: "40px" }}
          >
            <Button onClick={() => setVisibleAddCrops(false)}>
              {t("cancel")}
            </Button>
            <Button type="primary" className="ml-10" htmlType="submit">
              {t("save")}
            </Button>
          </div>
        </Form>
      </Modal>

      {/*edit sector or add sector modal*/}
      <Modal
        title={t("addSector")}
        centered
        className="addTaskModal padModal"
        visible={visibleEditSector}
        onOk={() => setVisibleEditSector(false)}
        onCancel={() => setVisibleEditSector(false)}
        footer={null}
      >
        <EditSector
          sector={tableData[selected]}
          parcel={props.parcel}
          categoryId={props.categoryId}
          parcelCategoryId={props.parcelCategoryId}
          triggerFetch={props.triggerFetch}
          setVisibleEditSector={setVisibleEditSector}
        />
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ options, lang }) => {
  return { options, lang };
};

export default connect(mapStateToProps, { getOptions, notify })(Sectors);
