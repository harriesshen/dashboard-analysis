import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Title, SegmentedControl, LoadingOverlay, Group } from "@mantine/core";

import FeatureSearch from "../../../components/Form/FeatureSearch";
import FeatureAge from "./FeatureAge";
import FeatureGender from "./FeatureGender";
import FeatureHoliday from "./FeatureHoliday";
import "./Feature.scss";
// 搜尋內容初始值
const initialValues = {
  year: 112,
  analysis_project: 0,
};
const analysisItem = [
  // { label: "碰撞型態", value: 0 },
  // { label: "肇事因素", value: 1 },
  // { label: "肇事因素(個人)", value: 2 },
  // { label: "事故嚴重程度", value: 3 },
  // { label: "碰撞車種", value: 4 },
  { label: "性別", value: 0 },
  // { label: "碰撞車種", value: 4 },
];

/* F03進階特徵事故分析 */
const Feature = (props) => {
  const {
    Year,
    Marquee,
    Loading,
    CharacteristicsAnalysisAgeData, // 特徵分析-年齡
    CharacteristicsAnalysisGenderData, // 特徵分析-性別
    CharacteristicsAnalysisHolidayData, // 特徵分析-平假日
    POST_CharacteristicsAnalysisExport,
    ReportData,
  } = props; // state
  const { GET_YearDropdown, POST_Report, SET_Loading } = props; // dispatch

  const [search, setSearch] = useState({});
  const [page, setPage] = useState("FeatureGender");
  const tableRef = useRef(null);
  const chartRef = useRef(null);

  const AnalysisItemName =
    Object.keys(search).length > 0
      ? analysisItem.find((i) => i.value === search.analysis_project).label
      : ""; // 查詢的分析項目名稱
  const childPage = {
    FeatureAge: (
      <FeatureAge
        {...{
          AnalysisItemName: AnalysisItemName,
          Data: ReportData,
          // name: name,
          // fullname: fullname,
          // onExport: () => onExportData(),
          history: props.history,
          tableRef: tableRef,
          chartRef: chartRef,
        }}
      />
    ),
    FeatureGender: (
      <FeatureGender
        {...{
          AnalysisItemName: AnalysisItemName,
          Data: ReportData,
          // onExport: () => onExportData(),
          history: props.history,
          tableRef: tableRef,
          chartRef: chartRef,
        }}
      />
    ),
    FeatureHoliday: (
      <FeatureHoliday
        {...{
          AnalysisItemName: AnalysisItemName,
          Data: ReportData,
          // onExport: () => onExportData(),
          history: props.history,
          tableRef: tableRef,
          chartRef: chartRef,
        }}
      />
    ),
  };
  const getApiRef = useRef(() => {
    GET_YearDropdown();
  });

  useEffect(() => {
    getApiRef.current();
  }, []);

  const onSearch = (values) => {
    let analysis_type = 0; // 預設年齡分析比較為0
    const callback = (payload) => {
      setSearch(payload);
    };
    switch (page) {
      case "FeatureAge":
        analysis_type = 0;
        break;
      case "FeatureGender":
        analysis_type = 1;
        break;
      case "FeatureHoliday":
        analysis_type = 2;
        break;
      default:
        break;
    }
    const payload = { ...values, analysis_type };
    console.log("value in feature", payload);
    POST_Report(payload, callback(payload));
  };

  return (
    <div id="Feature">
      <LoadingOverlay visible={Loading} />
      <div className="tabs">
        <SegmentedControl
          size="md"
          // color="orange"
          value={page}
          onChange={(v) => setPage(v)}
          data={[
            // { value: "FeatureAge", label: "年齡分析比較" },
            { value: "FeatureGender", label: "鄉鎮分析比較" },
            // { value: "FeatureHoliday", label: "平假日分析" },
          ]}
        />
        {page !== "FeatureTab" && (
          <Group className="searchForm">
            <FeatureSearch
              year={Year}
              defaultYear={Marquee[0]?.year}
              analysisItem={analysisItem}
              onSubmit={onSearch}
              Loading={Loading}
              initialValues={initialValues}
              // 匯出參數
              search={search}
              pdfRef={[chartRef, tableRef]}
              exportCsvFn={POST_CharacteristicsAnalysisExport}
            />
          </Group>
        )}
        <div className="page">{_.get(childPage, page)}</div>
      </div>
      {/* <Title className="title">進階特徵事故分析</Title> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    Year: _.get(state, "dropdown.Year", []),
    ReportData: _.get(state, "report.ReportData", []),
    Marquee: _.get(state, "global.Marquee", []),
    Loading: _.get(state, "global.Loading", false),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_YearDropdown(payload) {
      dispatch({ type: "GET_YearDropdown", payload });
    },
    POST_Report(payload, callback) {
      dispatch({ type: "POST_Report", payload, callback });
    },
    SET_Loading(payload) {
      dispatch({ type: "SAVE_Loading", payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feature);
