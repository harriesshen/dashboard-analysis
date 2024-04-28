/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { Button, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import { connect } from "react-redux";

import CRUDTable from "../../../components/CRUDTable";
import ECharts from "../../../components/ECharts";
import FeatureSearch from "../../../components/Form/FeatureSearch";
import "./FeatureAge.scss";
// import { useGetToken } from "../../../utils/token";

const analysisItem = [
  { label: "碰撞型態", value: 0 },
  { label: "肇事因素", value: 1 },
  { label: "肇事因素(個人)", value: 2 },
  { label: "事故嚴重程度", value: 3 },
  { label: "碰撞車種", value: 4 },
];
// 搜尋內容初始值(嵌入畫面使用)
const initialValues = {
  year: 112,
  analysis_project: 0,
};
// 表格與圓餅圖的標籤
const defaultLabel = ["12歲以下", "13-17歲", "18-24歲", "25-64歲", "65歲以上"];
const defaultFullLabel = [
  "12歲以下(孩童)",
  "13-17歲(少年)",
  "18-24歲(青年)",
  "25-64歲(成年)",
  "65歲以上(高齡者)",
];

const FeatureAge = (props) => {
  const { Year, Loading, CharacteristicsAnalysisData } = props; // state
  const {
    GET_Year,
    POST_CharacteristicsAnalysis,
    POST_CharacteristicsAnalysisExport,
    SET_Loading,
  } = props; // dispatch
  const { AnalysisItemName, Data, tableRef, chartRef } = props; // 父層參數

  const [config, setConfig] = useState({});
  const [search, setSearch] = useState({});
  const tableColumns = [
    {
      key: "type_name",
      title: AnalysisItemName === undefined ? "" : AnalysisItemName,
    },
    {
      key: "age_12",
      title: defaultLabel[0],
      width: "12%",
    },
    {
      key: "age_1317",
      title: defaultLabel[1],
      width: "12%",
    },
    {
      key: "age_1824",
      title: defaultLabel[2],
      width: "12%",
    },
    {
      key: "age_2564",
      title: defaultLabel[3],
      width: "12%",
    },
    {
      key: "age_65",
      title: defaultLabel[4],
      width: "12%",
    },
    { key: "total", title: "統計", width: "12%" },
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
    const SumTwelve = _.sum(_.map(Data, (i) => i.age_12));
    const SumThirteen = _.sum(_.map(Data, (i) => i.age_1317));
    const SumEighteen = _.sum(_.map(Data, (i) => i.age_1824));
    const SumTwentyfive = _.sum(_.map(Data, (i) => i.age_2564));
    const SumSixtyfive = _.sum(_.map(Data, (i) => i.age_65));

    const tempConfig = {
      tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)" },
      legend: {
        data: defaultFullLabel,
        bottom: 50,
      },
      series: [
        {
          name: "年齡事故件數統計",
          type: "pie",
          radius: ["0%", "60%"],
          center: ["50%", "40%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            color: "#503c1b",
          },
          color: ["#84A59D", "#F28482", "#F6BD60", "#F5CAC3", "#FEC89A"],
          data: [
            {
              value: SumTwelve,
              name: defaultFullLabel[0],
            },
            {
              value: SumThirteen,
              name: defaultFullLabel[1],
            },
            {
              value: SumEighteen,
              name: defaultFullLabel[2],
            },
            {
              value: SumTwentyfive,
              name: defaultFullLabel[3],
            },
            {
              value: SumSixtyfive,
              name: defaultFullLabel[4],
            },
          ],
        },
      ],
    };
    setConfig(tempConfig);
  }, [Data]);

  const onSearch = (values) => {
    const analysis_type = 0; // 預設年齡分析比較為0
    const callback = (payload) => {
      setSearch(payload);
    };

    const payload = { ...values, analysis_type };
    console.log("value in feature", payload);
    POST_CharacteristicsAnalysis(payload, callback(payload));
  };

  return (
    <div id="FeatureAge">
      <LoadingOverlay visible={Loading} />

      {!_.isEmpty(Data) && (
        <>
          <h2>年齡事故統計</h2>
          <Grid>
            <Grid.Col md={12} lg={6} className="mx-auto">
              <Flex id="FeatureAgeEChart" ref={chartRef} align={"center"}>
                <ECharts config={config} />
              </Flex>
            </Grid.Col>
            <Grid.Col md={12} lg={6}>
              <div id="FeatureAgeTable" ref={tableRef}>
                <CRUDTable
                  tableTitle="分析資料"
                  tableColumns={tableColumns}
                  tableData={Data}
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
    CharacteristicsAnalysisAgeData: _.get(
      state,
      "CharacteristicsAnalysis.CharacteristicsAnalysisAgeData",
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

export default connect(mapStateToProps, mapDispatchToProps)(FeatureAge);
