/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { Button, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import { connect } from "react-redux";

import ECharts from "../../../components/ECharts";
import CRUDTable from "../../../components/CRUDTable";
import FeatureSearch from "../../../components/Form/FeatureSearch";
import "./FeatureHoliday.scss";
// import { useGetToken } from "../../../utils/token";

// 搜尋內容初始值(嵌入畫面使用)
const initialValues = {
  year: 112,
  analysis_project: 0,
};

const analysisItem = [
  { label: "碰撞型態", value: 0 },
  { label: "肇事因素", value: 1 },
  { label: "肇事因素(個人)", value: 2 },
  { label: "事故嚴重程度", value: 3 },
  { label: "碰撞車種", value: 4 },
];
const FeatureHoliday = (props) => {
  const { Year, Loading, CharacteristicsAnalysisHolidayData } = props; // state
  const {
    GET_Year,
    POST_CharacteristicsAnalysis,
    SET_Loading,
    POST_CharacteristicsAnalysisExport,
  } = props; // dispatch
  const { AnalysisItemName, Data, tableRef, chartRef } = props; // 父層參數

  const [config, setConfig] = useState({});
  const [search, setSearch] = useState({});

  const tableColumns = [
    {
      key: "type_name",
      title: AnalysisItemName === undefined ? "" : AnalysisItemName,
      width: "30%",
    },
    { key: "weekday", title: "平日", width: "30%", title2: "人數", colNum: 2 },
    {
      key: "weekday_person",
      title: "平日",
      width: "30%",
      title2: "百分比",
      hiddenTitle1: true,
    },
    { key: "holiday", title: "假日", width: "30%", title2: "人數", colNum: 2 },
    {
      key: "holiday_person",
      title: "假日",
      width: "30%",
      title2: "百分比",
      hiddenTitle1: true,
    },
    { key: "total", title: "統計", width: "10%" },
  ];

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
    const SumDay = _.sum(_.map(Data, (i) => i.weekday));
    const SumHoliday = _.sum(_.map(Data, (i) => i.holiday));

    const tempConfig = {
      tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)" },
      legend: { data: ["平日", "假日"], bottom: "20%" },
      series: [
        {
          name: "平假日事故件數統計",
          type: "pie",
          radius: "60%",
          center: ["50%", "40%"],

          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "inside",
            formatter: "{b}\n{d}%",
            fontSize: 16,
            color: "white",
          },
          color: ["#84A59D", "#F28482"],
          data: [
            { value: SumDay, name: "平日" },
            { value: SumHoliday, name: "假日" },
          ],
        },
      ],
    };
    setConfig(tempConfig);
  }, [Data]);

  const onSearch = (values) => {
    const analysis_type = 2; // 預設平假日分析比較為2
    const callback = (payload) => {
      setSearch(payload);
    };

    const payload = { ...values, analysis_type };
    console.log("value in feature", payload);
    POST_CharacteristicsAnalysis(payload, callback(payload));
  };

  return (
    <div id="FeatureHoliday">
      <LoadingOverlay visible={isGetToken} />

      {!_.isEmpty(Data) && (
        <>
          <h2>平假日事故統計</h2>
          <Grid>
            <Grid.Col md={12} lg={6} className="mx-auto">
              <Flex id="FeatureHolidayEChart" ref={chartRef} align={"center"}>
                <ECharts config={config} />
              </Flex>
            </Grid.Col>
            <Grid.Col md={12} lg={6}>
              <div id="FeatureHolidayTable" ref={tableRef}>
                <CRUDTable
                  tableTitle="分析資料"
                  tableColumns={tableColumns}
                  tableData={Data}
                  twoLineTh={true}
                  showPagination={false}
                  showTotal
                  orderTh
                  orderColumn={["total", "desc"]}
                  onCurrency={true}
                  // refs={tableRef}
                />
              </div>
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
    CharacteristicsAnalysisHolidayData: _.get(
      state,
      "CharacteristicsAnalysis.CharacteristicsAnalysisHolidayData",
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

export default connect(mapStateToProps, mapDispatchToProps)(FeatureHoliday);
