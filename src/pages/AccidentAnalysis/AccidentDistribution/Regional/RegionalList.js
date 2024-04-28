/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Table, Title } from "@mantine/core";
import CRUDTable from "../../../../components/CRUDTable";
import "./RegionalList.scss";

const headColumn = ["排行", "行政區", "事件數", "死亡人數", "受傷人數"];

/* F03進階特徵事故分析 */
const RegionalList = ({ TableList, setPosition }) => {
  // const clickedTr = useRef(null);
  const [click, setClick] = useState(null);
  console.log("table", TableList);
  if (!TableList) return <></>;
  const handleClickTableToTown = (value) => {
    setPosition(value);
    setClick(value);
  };
  return (
    <div id="RegionalList">
      {/* {!props.hasParent && <Title className="title">事故點位分析-列表</Title>} */}

      <Table highlightOnHover striped withBorder withColumnBorders mt={10}>
        <thead>
          <tr>
            {_.map(headColumn, (i) => (
              <th aria-label={i} key={i}>
                {i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(TableList, (i, index) => (
            <tr
              key={i.town_name}
              // style={{
              //   backgroundColor: clickedTr.current === i.latlng && "orange",
              // }}
              className={`${click === i.latlng && "bg-orange"}`}
              onClick={() => handleClickTableToTown(i.latlng)}
            >
              <td aria-label={`${i.town_name}${index}`}>{index + 1}</td>
              <td aria-label={i.town_name}>{i.town_name}</td>
              <td aria-label={i.event_count}>{i.event_count}</td>
              <td aria-label={i.die}>{i.die}</td>
              <td aria-label={i.hurt}>{i.hurt}</td>
            </tr>
          ))}
          <tr style={{ backgroundColor: "#7e7e7e61" }}>
            <td colSpan={2} align="center">
              總計
            </td>
            <td>{_.sumBy(TableList, "event_count")}</td>
            <td>{_.sumBy(TableList, "die")}</td>
            <td>{_.sumBy(TableList, "hurt")}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RegionalList);
