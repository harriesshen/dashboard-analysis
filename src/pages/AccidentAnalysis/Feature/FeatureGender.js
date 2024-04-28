/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import {
  Button,
  Flex,
  Grid,
  LoadingOverlay,
  Table,
  Title,
} from "@mantine/core";
import { connect } from "react-redux";

import ECharts from "../../../components/ECharts";
import CRUDTable from "../../../components/CRUDTable";
import "./FeatureGender.scss";
import FeatureSearch from "../../../components/Form/FeatureSearch";

// 搜尋內容初始值(嵌入畫面使用)
const initialValues = {
  year: 112,
  analysis_project: 0,
};
const headColumn = ["鄉鎮", "死亡人數", "受傷人數", "事件數"];
const FeatureGender = (props) => {
  const { Year, Loading, CharacteristicsAnalysisGenderData } = props; // state
  const { GET_Year, SET_Loading } = props; // dispatch
  const { Data, AnalysisItemName, tableRef, chartRef } = props; // 父層參數

  const [config, setConfig] = useState({});

  const getApiRef = useRef(() => {
    GET_Year();
  });

  useEffect(() => {
    getApiRef.current = () => {
      GET_Year();
    };
  }, [GET_Year]);

  // 圓餅圖config設定
  useEffect(() => {
    const tempConfig = {
      tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)" },
      legend: { data: Data.map((i) => i.town_name), bottom: 0 },
      series: [
        {
          name: "鄉鎮事故件數統計",
          type: "pie",
          radius: "60%",
          center: ["50%", "40%"],
          selectedMode: "single",
          data: Data.map((i) => {
            return { value: i.event_count, name: i.town_name };
          }),
        },
      ],
    };
    setConfig(tempConfig);
  }, [Data]);

  return (
    <div id="FeatureGender">
      <LoadingOverlay visible={Loading} />
      {!_.isEmpty(Data) && (
        <>
          <h2>鄉鎮事故統計</h2>
          <Grid>
            <Grid.Col md={12} lg={6} className="mx-auto">
              <Flex id="FeatureGenderEChart" ref={chartRef} align={"center"}>
                <ECharts config={config} />
              </Flex>
            </Grid.Col>
            <Grid.Col md={12} lg={6}>
              <Table highlightOnHover striped withBorder withColumnBorders>
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
                  {_.map(Data, (i, index) => (
                    <tr key={i.town_name}>
                      <td aria-label={i.town_name}>{i.town_name}</td>
                      <td aria-label={i.event_count}>{i.event_count}</td>
                      <td aria-label={i.die}>{i.die}</td>
                      <td aria-label={i.hurt}>{i.hurt}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "#7e7e7e61" }}>
                    <td align="center">總計</td>
                    <td>{_.sumBy(Data, "event_count")}</td>
                    <td>{_.sumBy(Data, "die")}</td>
                    <td>{_.sumBy(Data, "hurt")}</td>
                  </tr>
                </tbody>
              </Table>
            </Grid.Col>
          </Grid>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    Year: _.get(state, "DropDown.Year", []),
    Loading: _.get(state, "global.Loading", false),

    CharacteristicsAnalysisGenderData: _.get(
      state,
      "CharacteristicsAnalysis.CharacteristicsAnalysisGenderData",
      []
    ),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_Year(payload, callback, loading) {
      dispatch({ type: "GET_Year", payload, callback, loading });
    },
    POST_CharacteristicsAnalysis(payload, callback) {
      dispatch({ type: "POST_CharacteristicsAnalysis", payload, callback });
    },
    POST_CharacteristicsAnalysisExport(payload) {
      dispatch({ type: "POST_CharacteristicsAnalysisExport", payload });
    },
    SET_Loading(payload) {
      dispatch({ type: "SAVE_Loading", payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeatureGender);
