/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Table } from "@mantine/core";
import "./FeatureTabTable.scss";
import Empty from "../Empty";

// 表頭
const TableHeader = ({ columnsTitle, period, colTitleColSpan }) => {
  return (
    <thead>
      <tr>
        {/* 首欄標題 跨2列 */}
        {_.map(columnsTitle.slice(0, colTitleColSpan), (thCol, index) => (
          <th key={`${thCol}-${index}`} rowSpan={2}>
            {thCol}
          </th>
        ))}
        {/* 日期 跨n欄 */}
        {_.map(period, (date) => (
          <th
            key={date}
            colSpan={(columnsTitle.length - colTitleColSpan) / period.length}
          >
            {date}
          </th>
        ))}
      </tr>
      {/* 資料標題 */}
      <tr>
        {_.map(columnsTitle.slice(colTitleColSpan), (thTitle, index) => (
          <th key={`${thTitle}-${index}`}>{thTitle}</th>
        ))}
      </tr>
    </thead>
  );
};

// 表身
const TableBody = ({ data }) => {
  console.log("data", data);
  return (
    <tbody>
      {_.map(data, (row, rowIndex) => (
        <tr key={`row-${rowIndex}`}>
          {_.map(row, (tdData, tdIndex) => (
            <td key={`${tdData}-${tdIndex}`}>{tdData}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

// 表尾
const TableFooter = ({ totalRow, colTitleColSpan }) => {
  return (
    <tfoot>
      <tr
        className="font-primary"
        style={{ fontWeight: 600, backgroundColor: "#F0F0F0" }}
      >
        <td colSpan={colTitleColSpan}>總計</td>
        {/* {_.map(totalRow, (total, index) => (
          <td key={`${total}-${index}`}>{total}</td>
        ))} */}
      </tr>
    </tfoot>
  );
};

const FixedReportTable = ({ result, refs }) => {
  console.log("show", result);

  const { Period, title, data, totalRow } = result;
  // 計算首欄有幾筆
  // const colTitleColSpan = title.length - totalRow.length;
  const colTitleColSpan = title.length - 1;

  return (
    <div id="FixedReportTable" ref={refs}>
      <Table captionSide="top" highlightOnHover className="table">
        <TableHeader
          columnsTitle={title}
          period={Period}
          colTitleColSpan={colTitleColSpan}
        />
        <TableBody data={data} />
        <TableFooter totalRow={totalRow} colTitleColSpan={colTitleColSpan} />
      </Table>
    </div>
  );
};

FixedReportTable.propTypes = {
  result: PropTypes.object,
};

FixedReportTable.defaultProps = {
  result: {},
};

export default FixedReportTable;
