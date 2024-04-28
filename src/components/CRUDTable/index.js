/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Table, Button, Pagination, Modal, Mark, Text, Menu, Input } from "@mantine/core";
import {
  faPlusSquare,
  faEdit,
  faTrashAlt,
  faFilePdf,
  faFileExcel,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import "./index.scss";
import Empty from "../Empty";

// 千分位,
const toCurrency = (num) => {
  if (num !== undefined) {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}

const renderTd = (item, columns, index, editTd, editTdState, onCurrency) => {
  return _.map(columns, (col) => {
    const renderFunc = _.get(col, "render");
    if (editTd && editTdState) {
      return <td key={col.key + index}>{col.editTd ? col.editTd : (_.has(col, "render") ? renderFunc(item) : _.get(item, col.key))}</td>;
    } else if (_.has(col, "render")) {
      return <td key={col.key + index}>{renderFunc(item)}</td>;
    } else {
      return <td key={col.key + index}>{onCurrency ? (toCurrency(_.get(item, col.key))) : (_.get(item, col.key))}</td>;
    }
  });
};

const renderTotal = (data, columns, onCurrency) => {
  return _.map(columns, (col, index) => {
    if (index === 0) {
      return <td key={col.key}>總計</td>;
    } else if (col.key === "Details[0].KM" || col.key === "Details[1].KM") {
      let sumNum = 0;
      const group = _.groupBy(data, 'RouteID');
      _.map(group, (item) => {
        sumNum += Number(_.sum(_.get(item[0], col.key)));
      })
      return <td key={col.key}>{onCurrency ? (toCurrency(_.round(sumNum, 2))) : (_.round(sumNum, 2))}</td>
    } else if (_.get(data[0], col.key) !== "" && !_.isNaN(Number(_.get(data[0], col.key)))) {
      let sumNum = 0;
      _.map(data, (item) => {
        sumNum += Number(_.get(item, col.key));
      })
      return <td key={col.key}>{onCurrency ? (toCurrency(_.round(sumNum, 2))) : (_.round(sumNum, 2))}</td>
    } else {
      return <td key={col.key}></td>
    }
  })
}

const renderTitle = (type, title) => {
  let result;

  switch (type) {
    case "create":
      result = "新增" + title;
      break;
    case "edit":
      result = "修改" + title;
      break;
    case "delete":
      result = "刪除" + title;
      break;
    default:
      result = title;
      break;
  }

  return (
    <Text weight={600} size="lg">
      {result}
    </Text>
  );
};

const CRUDTable = (props) => {
  const { FormChild } = props;
  const [loading, setLoading] = useState(false);
  const [currentpage, setCurrentpage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [modalType, setModalType] = useState("create");
  const [modalVisible, setModalVisible] = useState(false);
  const [orderColumn, setOrderColumn] = useState(['', '']);
  const [onViewData, setOnViewData] = useState(undefined);
  const [data, setData] = useState([]);
  const formRef = useRef();

  useEffect(() => {
    let tempData = props.tableData;
    const tempOrder = [props.tableColumns[0].key, 'desc'];
    if (props.orderTh) {
      tempData = _.orderBy(props.tableData, tempOrder[0], tempOrder[1]);
      setOrderColumn(tempOrder)
    }
    if (props.showPagination) {
      const len = tempData.length;
      const pages = parseInt(len / props.tableRows, 10);
      const result = len % props.tableRows === 0 ? pages : pages + 1;
      setTotalPage(result);

      handleChangePage(1, tempData);
    } else setData(tempData);
  }, [props.tableData]);

  useEffect(() => {
    let tempData = props.tableData;
    if (props.orderTh) {
      const numberData = _.map(props.tableData, (item) => { return { ...item, orderKey: !_.isNaN(Number(_.get(item, orderColumn[0], 0))) ? Number(_.get(item, orderColumn[0], 0)) : _.get(item, orderColumn[0], '') } });
      tempData = _.orderBy(numberData, 'orderKey', orderColumn[1]);
    }
    if (props.showPagination) {
      const len = tempData.length;
      const pages = parseInt(len / props.tableRows, 10);
      const result = len % props.tableRows === 0 ? pages : pages + 1;
      setTotalPage(result);

      handleChangePage(1, tempData);
    } else setData(tempData);
  }, [orderColumn])

  const handleChangePage = (next, arr) => {
    const temp = _.filter(arr, (d, i) => {
      if (
        i >= next * props.tableRows - props.tableRows &&
        i < next * props.tableRows
      )
        return true;
      return false;
    });

    setData(temp);
    setCurrentpage(next);
  };

  const bindForm = (func) => (formRef.current = func);

  const onModalSubmit = (values) => {
    const loadingFunc = (bool) => setLoading(bool);
    const callback = () => onModalClose();

    switch (modalType) {
      case "create":
        props.onCreate(values, callback, loadingFunc);
        break;
      case "edit":
        props.onEdit(values, callback, loadingFunc, onViewData);
        break;
      case "delete":
        props.onDelete(values, callback, loadingFunc);
        break;
      default:
        break;
    }
  };

  const onModalClose = () => {
    setModalType("create");
    setModalVisible(false);
    setOnViewData(undefined);
  };

  const onCreate = (e) => {
    e.preventDefault();
    setModalType("create");
    setModalVisible(true);
  };

  const onEdit = (e, item) => {
    e.preventDefault();
    setModalType("edit");
    setModalVisible(true);
    setOnViewData(item);
  };

  const onDelete = (e, item) => {
    e.preventDefault();
    setModalType("delete");
    setModalVisible(true);
    setOnViewData(item);
  };

  const renderTh = () => {

    const action = props.showAction && (
      <th style={{ minWidth: props.actionWidth, width: props.actionWidth }} rowSpan={props.twoLineTh ? 2 : 1}>
        操作
      </th>
    );

    if (props.twoLineTh) {
      return (
        _.map(_.range(2), (line) => (
          <tr>
            {_.map(props.tableColumns, (item) => {
              if ((line === 0 && item.hiddenTitle1 !== true) || (line === 1 && item.title2 !== undefined)) {
                return (
                  <th
                    key={item.key}
                    style={{
                      minWidth: _.get(item, "minWidth", props.columnWidth),
                      width: _.get(item, "width", props.columnWidth),
                      textAlign: line === 0 && item.title2 !== undefined && item.colNum !== undefined ? 'center' : '',
                    }}
                    rowSpan={(line === 0 && item.title2 === undefined ? 2 : 1)}
                    colSpan={(line === 0 && item.title2 !== undefined && item.colNum !== undefined ? item.colNum : 1)}
                    onClick={() => { if (props.orderTh && (line === 1 || (line === 0 && item.title2 === undefined))) setOrderColumn([item.key, orderColumn[0] === item.key && orderColumn[1] === 'desc' ? 'asc' : 'desc']) }}
                  >
                    {line === 0 ? item.title : item.title2 !== undefined ? item.title2 : ''}
                    {(props.orderTh && (line === 1 || (line === 0 && item.title2 === undefined)) && item.key === orderColumn[0]) && (<Icon icon={orderColumn[1] === 'desc' ? faCaretDown : faCaretUp} style={{ fontSize: '20px', marginLeft: '5px' }} />)}
                  </th>
                )
              }
            })}
            {line === 0 && action}
          </tr>
        ))
      );
    } else {
      return (
        <tr>
          {_.map(props.tableColumns, (item) => (
            <th
              key={item.key}
              style={{ minWidth: _.get(item, "minWidth", props.columnWidth), width: _.get(item, "width", props.columnWidth) }}
              onClick={() => { if (props.orderTh) setOrderColumn([item.key, orderColumn[0] === item.key && orderColumn[1] === 'desc' ? 'asc' : 'desc']) }}
            >
              {item.title}{(props.orderTh && item.key === orderColumn[0]) && (<Icon icon={orderColumn[1] === 'desc' ? faCaretDown : faCaretUp} style={{ fontSize: '20px', marginLeft: '5px' }} />)}
            </th>
          ))}
          {action}
        </tr>
      );
    }
  };

  const renderContent = () => {
    switch (modalType) {
      case "create":
      case "edit":
        return (
          <>
            {FormChild !== null && (
              <FormChild
                {...props.formProps}
                bindForm={bindForm}
                onSubmit={onModalSubmit}
                initialValues={onViewData}
              />
            )}
            <div style={{ textAlign: "right", marginTop: 12 }}>
              <Button variant="default" onClick={onModalClose}>
                取消
              </Button>
              <Button
                onClick={() => formRef.current()}
                style={{ marginLeft: 12 }}
                loading={loading}
              >
                送出
              </Button>
            </div>
          </>
        );
      case "delete":
        return (
          <div>
            <Text>
              您確定要刪除{" "}
              <Mark color="red">{_.get(onViewData, props.rowKey)}</Mark> 嗎?
            </Text>
            <div style={{ textAlign: "right", marginTop: 12 }}>
              <Button variant="default" onClick={onModalClose}>
                取消
              </Button>
              <Button
                color="red"
                onClick={() => onModalSubmit(onViewData)}
                style={{ marginLeft: 12 }}
                loading={loading}
              >
                刪除
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const actionButton = (item) => {
    const arr = [];
    const bool = props.showEdit && props.showDelete;

    if (props.showEdit)
      arr.push(
        <Button
          size="xs"
          color="orange"
          key="edit"
          onClick={(e) => onEdit(e, item)}
          leftIcon={<Icon icon={faEdit} />}
          style={{ marginRight: bool ? 6 : 0 }}
        >
          編輯
        </Button>
      );

    if (props.showDelete)
      arr.push(
        <Button
          size="xs"
          color="red"
          key="delete"
          onClick={(e) => onDelete(e, item)}
          leftIcon={<Icon icon={faTrashAlt} />}
        >
          刪除
        </Button>
      );

    if (!_.isNull(props.customAction(item)))
      arr.push(props.customAction(item));

    if (arr.length > 0) return <td>{arr}</td>;
    else return null;
  };

  const caption = props.showCreate && (
    <caption style={{ textAlign: "left", display: 'flex', marginBottom: '12px' }}>
      <Button leftIcon={<Icon icon={faPlusSquare} />} onClick={onCreate}>
        新增{props.tableTitle}
      </Button>
      {props.showExport ? (
        <Menu
          control={
            <Button>匯出</Button>
          }
          style={{ margin: 'auto 10px' }}
        >
          <Menu.Label>請選擇匯出格式</Menu.Label>
          <Menu.Item
            icon={<Icon icon={faFilePdf} />}
            onClick={() => props.onExport("pdf")}
          >
            PDF
          </Menu.Item>
          <Menu.Item
            icon={<Icon icon={faFileExcel} />}
            onClick={() => props.onExport("xlsx")}
          >
            XLSX
          </Menu.Item>
        </Menu>
      ) : ("")}
    </caption>
  );

  const paginationItem = props.showPagination && (
    <div style={{ marginTop: 12 }}>
      <Pagination
        size="sm"
        page={currentpage}
        total={totalPage}
        onChange={(e) => handleChangePage(e, props.tableData)}
        withEdges
        style={{ justifyContent: "center" }}
      />
    </div>
  );
  return (
    <div className="tableSize">
      <div className="CRUDTable-outer" style={{ height: props.tableHeight }}>
        {caption}
        {_.isEmpty(data) ? (
          <Empty />
        ) : (
          <Table captionSide="top" highlightOnHover className="CRUDTable">
            <thead>
              {renderTh()}
            </thead>
            <tbody>
              {_.map(data, (item, index) => {
                return (
                  <tr key={"row" + index} onClick={() => {
                    if (props.actionTr && props.onClickTr !== '' && props.onClickTr !== undefined && props.resKeyTr.length !== 0) {
                      const payload = _.map(props.resKeyTr, (resKey) => _.get(item, resKey));
                      props.onClickTr(payload.length === 1 ? payload[0] : payload)
                    }
                  }}>
                    {renderTd(item, props.tableColumns, index, props.editTd, _.get(item, props.editTdKey) === props.editTdNum ? props.editTdState : false, props.onCurrency)}
                    {actionButton(item)}
                  </tr>
                )
              })}
              {props.showTotal && (
                <tr key='total' className="font-primary" style={{ fontWeight: 600, backgroundColor: "#F0F0F0" }}>
                  {renderTotal(data, props.tableColumns, props.onCurrency)}
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
      {paginationItem}
      <Modal
        overflow="outside"
        size="lg"
        opened={modalVisible}
        onClose={onModalClose}
        title={renderTitle(modalType, props.tableTitle)}
      >
        {renderContent()}
      </Modal>
    </div>
  );
};

CRUDTable.propTypes = {
  showCreate: PropTypes.bool,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  showAction: PropTypes.bool,
  showPagination: PropTypes.bool,
  showTotal: PropTypes.bool,

  twoLineTh: PropTypes.bool,
  orderTh: PropTypes.bool,

  actionTr: PropTypes.bool,
  onClickTr: PropTypes.func,
  resKeyTr: PropTypes.array,

  onCurrency: PropTypes.bool,

  editTd: PropTypes.bool,
  editTdState: PropTypes.bool,
  editTdKey: PropTypes.string,
  editTdNum: PropTypes.string,

  tableColumns: PropTypes.array,
  tableData: PropTypes.array,
  tableTitle: PropTypes.string,
  tableHeight: PropTypes.string,
  tableRows: PropTypes.number,
  rowKey: PropTypes.string,

  columnWidth: PropTypes.number,
  actionWidth: PropTypes.number,

  onCreate: PropTypes.func,

  FormChild: PropTypes.any,
  formProps: PropTypes.object,

  customAction: PropTypes.func,
};

CRUDTable.defaultProps = {
  rowKey: "",
  showCreate: false,
  showEdit: false,
  showDelete: false,
  showAction: false,
  showPagination: true,
  showTotal: false,

  twoLineTh: false,
  orderTh: false,

  actionTr: false,
  onClickTr: () => { },
  resKeyTr: [],

  onCurrency: false,

  editTd: false,
  editTdState: false,
  editTdKey: "",
  editTdNum: "",

  tableColumns: [],
  tableData: [],
  tableTitle: "",
  tableHeight: "auto",
  tableRows: 10,

  columnWidth: 150,
  actionWidth: 200,

  onCreate: () => { },

  FormChild: null,
  formProps: {},

  customAction: () => null,
};

export default CRUDTable;
