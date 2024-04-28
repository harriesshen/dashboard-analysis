import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Grid, LoadingOverlay } from "@mantine/core";

import SearchForm from "../../../../components/Form/RegionalSearch";
import RegionalList from "./RegionalList";
import RegionalMap from "./RegionalMap";
import town_JSON from "../../../../sagas/town.json";
// import { useGetToken } from "../../../../utils/token";

import "./Regional.scss";

// 熱區資料
const convertBlockData = (data, type) => {
  if (data && type === "heatBlock") {
    let max = 0;
    const tempJSON = _.cloneDeep(town_JSON);
    const town = _.groupBy(data, "Town");
    _.map(town, (item) => {
      if (item.length > max) max = item.length;
    });
    const result = [];
    _.map(tempJSON.features, (item) => {
      if (item.properties.COUNTYNAME === process.env.REACT_APP_AREA) {
        const temp = _.get(town, item.properties.TOWNNAME, []);
        result.push({
          ...item,
          num: Number(temp.length),
          percent: Number(temp.length / max),
        });
      }
    });
    return result;
  }
  return [];
};

// 熱力資料
const convertHeatMapData = (data, type) => {
  if (data && type === "heatMap") {
    const groupedData = _.groupBy(data, (obj) => `${obj.Lat}-${obj.Lng}`);

    // 计算重复的经纬度，并将重复的值合并
    const result = Object.values(groupedData).map((group) => {
      if (group.length > 1) {
        // 返回第一个对象，并更新其值为总和
        return [group[0].Lat, group[0].Lng, group.length * 0.1];
      } else {
        // 如果没有重复，则直接返回原始对象
        return [group[0].Lat, group[0].Lng, 0.1];
      }
    });
    return result;
  }
  return [];
};

// 點位資料
const convertMarkerData = (data) => {
  if (data) {
    const groupedData = _.groupBy(data, (item) => {
      return `${item.Lat},${item.Lng}`;
    });
    const result = _.map(groupedData, (val, latlng) => {
      return {
        lat: parseFloat(latlng.split(",")[0]),
        lng: parseFloat(latlng.split(",")[1]),
        data: val,
      };
    });
    return result;
  }
  return [];
};

/* 事故分布分析 */
const Regional = (props) => {
  const [search, setSearch] = useState({
    town: [0],
    date: ["2023/01", "2023/12"],
  }); // 查詢條件內容
  const [type, setType] = useState("heatMap");
  const [position, setPosition] = useState(null);
  const tableRef = useRef(null);
  const {
    GET_AccidentDistributionDropdown,
    POST_District,
    POST_DistrictExport,
    SET_Loading,
  } = props; // dispatch
  const { Town, Year, District, Loading } = props; // state
  const preSearchRef = useRef(null);
  const getApiRef = useRef(() => {
    GET_AccidentDistributionDropdown();
  });
  useEffect(() => {
    getApiRef.current();
  }, []);
  // useGetToken(getApiRef.current);

  const SubmitFn = (values) => {
    // console.log("values", values);
    // 透過鄉鎮、時間 查詢資料 分析方式只控制顯示的地圖 所以當只有分析方式不同時不做資料查詢
    const searchValue = { date: values.date, town: values.town };
    setType(values.print);
    const body = {
      town_id: values.town,
      start_year: values.date[0].split("/")[0] - 1911,
      end_year: values.date[1].split("/")[0] - 1911,
      start_month: values.date[0].split("/")[1],
      end_month: values.date[1].split("/")[1],
    };
    if (!_.isEqual(searchValue, preSearchRef.current)) {
      preSearchRef.current = searchValue;
      POST_District(body, () => {
        setSearch(values);
      });
    }
  };

  const blockData = convertBlockData(District?.DetailList, type);
  const heatMapData = convertHeatMapData(District?.DetailList, type);
  const markerDataList = convertMarkerData(District?.DetailList);

  return (
    <div id="Regional">
      {/* <Title className="title">事故點位分析</Title> */}
      <LoadingOverlay visible={Loading} />
      <Grid>
        <Grid.Col md={12} lg={6} style={{ height: "100%" }}>
          <RegionalMap
            hasParent
            printType={type}
            search={search}
            heatMapData={heatMapData} // 熱力資料
            blockData={blockData} // 熱區資料
            markerDataList={markerDataList} // marker資料
            position={position}
          />
        </Grid.Col>
        <Grid.Col md={12} lg={6} style={{ height: "100%" }}>
          <div className="grid">
            <SearchForm
              onSubmitFn={SubmitFn}
              search={search}
              Year={Year}
              Town={Town}
              // 匯出參數
              // pdfRef={[tableRef]}
              // exportCsvFn={POST_DistrictExport}
              Loading={Loading}
            />
            <RegionalList
              hasParent
              TableList={District?.TableList}
              tableRef={tableRef}
              setPosition={setPosition}
            />
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    District: _.get(state, "accidentAnalysis.DistrictData", []),
    Year: _.get(state, "dropdown.Year", []),
    Town: _.get(state, "dropdown.Town", []),
    Loading: _.get(state, "global.Loading", false),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    POST_District(payload, callback, loading) {
      dispatch({ type: "POST_District", payload, callback, loading });
    },
    GET_AccidentDistributionDropdown() {
      dispatch({ type: "GET_AccidentDistributionDropdown" });
    },
    POST_DistrictExport(payload) {
      dispatch({ type: "POST_DistrictExport", payload });
    },
    SET_Loading(payload) {
      dispatch({ type: "SAVE_Loading", payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Regional);
