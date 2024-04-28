/* eslint-disable new-cap */
import React, { useState, useEffect, memo, useRef, useMemo } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import L from "leaflet";
import {
  MapContainer,
  LayersControl,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import {
  Title,
  Grid,
  Text,
  Select,
  Modal,
  Dialog,
  Group,
  Table,
  Flex,
} from "@mantine/core";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import MarkerCluster from "react-leaflet-markercluster";
import "./RegionalMap.scss";
import countyCenter from "../../../../utils/countyCenter";

// #region 地圖區塊顏色設定、icon設定

const Color1 = {
  fillColor: "#FFF4F5",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const Color2 = {
  fillColor: "#FFCDCD",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const Color3 = {
  fillColor: "#FFB1AC",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const Color4 = {
  fillColor: "#FF9D97",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const Color5 = {
  fillColor: "#FB8383",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const Color6 = {
  fillColor: "#F46868",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const Color7 = {
  fillColor: "#EE4646",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const Color8 = {
  fillColor: "#D93131",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const Color9 = {
  fillColor: "#C11A1A",
  fillOpacity: 0.9,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};
const ColorNull = {
  fillColor: "transparent",
  fillOpacity: 0,
  color: "black",
  opacity: 0.35,
  weight: 1,
  zIndex: 200,
};

// 熱區顏色
const geoJSONStyle = (feature) => {
  const num = feature.percent * 100;
  let color = ColorNull;
  if (isNaN(num)) {
    color = ColorNull;
  } else if (num > 0 && num < 5) {
    color = Color1;
  } else if (num >= 5 && num < 10) {
    color = Color2;
  } else if (num >= 10 && num < 15) {
    color = Color3;
  } else if (num >= 15 && num < 20) {
    color = Color4;
  } else if (num >= 20 && num < 25) {
    color = Color5;
  } else if (num >= 25 && num < 30) {
    color = Color6;
  } else if (num >= 30 && num < 35) {
    color = Color7;
  } else if (num >= 35 && num < 40) {
    color = Color8;
  } else if (num >= 40) {
    color = Color9;
  } else {
    color = ColorNull;
  }
  return color;
};

// 熱區文字(鄉鎮、數字)
const onEachFeatureLable = (feature, layer) => {
  let value = "";
  const COUNTY = feature.properties.COUNTYNAME;
  const TOWN = feature.properties.TOWNNAME;
  const num = feature.num ? feature.num : "0";
  value += TOWN ? "<span style='font-size:10pt;'>" + TOWN + "</span>" : "";
  value += num ? "<br/><span style='font-size:10pt;'>" + num + "</span>" : "0";
  const tooltipChildren =
    "<div  style='text-align: center;'>" + value + "</div>";
  layer.bindTooltip(tooltipChildren, {
    className: "toolBax",
    permanent: true,
    direction: "center",
  });
};

//  popup table column
const popupColumn = [
  { key: "Lat", title: "緯度" },
  { key: "Lng", title: "經度" },
  {
    key: "Date",
    title: "發生日期",
    // format: (value) => value,
  },
  { key: "Town", title: "鄉鎮區域" },
  // { key: "main_cause_name", title: "主要肇事原因" },
  // { key: "act_name", title: "事件類型" },
  // {
  //   key: "age",
  //   title: "年齡",
  //   format: (value) => (value === 0 ? "" : `${value}歲`),
  // },
  { key: "DieNum", title: "死亡人數" },
  { key: "HurtNum", title: "受傷人數" },
  // { key: "party_category_name", title: "事故車種" },
];

// #endregion

const RegionalMap = (props) => {
  const {
    printType,
    search,
    blockData,
    heatMapData,
    markerDataList,
    position,
  } = props; // 父層參數
  const { BaseLayer } = LayersControl;
  const mapCenter = _.filter(
    countyCenter,
    (i) => i.name === process.env.REACT_APP_AREA
  )[0].latLng;
  const [map, setMap] = useState(null);
  useEffect(() => {
    if (position) {
      map.setView(position, 12);
    }
  }, [map, position]);
  return (
    <div id="RegionalMap">
      {!props.hasParent && <Title className="title">事故點位分析-地圖</Title>}
      <MapContainer
        minZoom={8}
        maxZoom={18}
        center={mapCenter}
        zoom={10}
        maxBounds={([26.310508, 118.256787], [21.376707, 123.999261])}
        className="map-content"
        whenCreated={(m) => setMap(m)}
      >
        <LayersControl>
          <BaseLayer name="OpenStreetMap" checked>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="正射影像圖(臺灣通用)">
            <TileLayer
              attribution='&copy; <a href="http://maps.google.com.tw/">google</a> contributors'
              url="https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}"
            />
          </BaseLayer>
        </LayersControl>
        <ShowMapContent
          printType={printType}
          blockData={blockData}
          heatMapData={heatMapData}
          markerDataList={markerDataList}
          search={search}
          map={map}
        />
      </MapContainer>
    </div>
  );
};

const ShowMapContent = (props) => {
  const { printType, search, blockData, heatMapData, markerDataList, map } =
    props;
  const [inDetial, setinDetial] = useState(false); // 是否顯示 點位
  // 縮放
  const mapEvents = useMapEvents({
    zoomend: () => {
      if (mapEvents.getZoom() >= 13 && !inDetial) {
        setinDetial(true);
      }
      if (mapEvents.getZoom() < 13 && inDetial) {
        setinDetial(false);
      }
    },
  });
  return (
    <>
      {printType === "heatMap" && heatMapData.length > 0 && (
        <HeatmapLayer
          key={Math.random()}
          fitBoundsOnLoad={false} // 加載熱力圖時是否符合bound範圍
          fitBoundsOnUpdate={false} // 更新熱力圖時是否符合bound範圍
          points={heatMapData}
          longitudeExtractor={(m) => m[1]}
          latitudeExtractor={(m) => m[0]}
          intensityExtractor={(m) => parseFloat(m[2])}
          // gradient={{
          //   0.1: "blue",
          //   0.5: "orange",
          //   1: "red",
          // }}
          max={10}
          minOpacity={0.05}
          useLocalExtrema={true}
        />
      )}
      {printType === "heatBlock" && !inDetial && blockData.length > 0 && (
        <GeoJSON
          key={Math.random()}
          data={blockData}
          style={geoJSONStyle}
          onEachFeature={onEachFeatureLable}
        />
      )}
      {(printType === "blobMap" ? true : inDetial) &&
        markerDataList.length > 0 && (
          <MarkerList dataList={markerDataList} search={search} map={map} />
        )}
    </>
  );
};

const arePropsEqual = (oldProp, newProp) => {
  // 依照搜尋條件判斷 是否re-render
  const { search: oldSearch } = oldProp;
  const { search: newSearch } = newProp;

  const newTown = _.isEqual(oldSearch.town, newSearch.town);
  const newDate = _.isEqual(oldSearch.date, newSearch.date);

  return newDate && newTown;
};

const MarkerList = React.memo(({ dataList, map }) => {
  const [open, setOpen] = useState(false);
  const [popupKey, setPopupKey] = useState("");
  const [popUpData, setPopUpData] = useState("");
  const [popUpPage, setPopUpPage] = useState(1);
  const mapRef = useRef(map);
  useEffect(() => {
    mapRef.current = map;
  }, [map]);
  useEffect(() => {
    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      SpiderfyOnMaxZoom: false,
    });
    const ShowMarker = () => {
      _.map(dataList, (i) => {
        cluster.addLayer(
          L.marker([i.lat, i.lng], {
            icon: new L.divIcon({
              className: "custom-icon-container",
              html: `<div class="">${i.data.length}</div>`,
              iconSize: [16, 16],
            }),
          }).on("click", () => {
            console.log("click marker");
            setOpen(true);
            setPopupKey(`popUpKey${i.lat}${i.lng}`);
            setPopUpData(i.data);
            setPopUpPage(1);
          })
        );
      });
      mapRef.current.addLayer(cluster);
    };
    if (dataList.length > 0) ShowMarker();
    return () => {
      mapRef.current.removeLayer(cluster);
    };
  }, [dataList]);
  return (
    <Dialog
      opened={open}
      onClose={() => setOpen(false)}
      withCloseButton
      position={{ bottom: "4rem", left: "37%" }}
      p={10}
      size={"lg"}
      radius={"md"}
      style={{ backgroundColor: "#f5fbff" }}
      key={popupKey}
    >
      <Flex justify={"space-around"} align={"center"} pr={10}>
        {`案件編號：${popUpData[popUpPage - 1]?.CaseNo}`}
        <Flex>
          <button
            className="caretBtn"
            aria-label="Previous"
            type="button"
            onClick={() => {
              if (popUpPage > 1) setPopUpPage((page) => page - 1);
            }}
          >
            <Icon icon={faCaretLeft}></Icon>
          </button>
          <Select
            data={_.map(popUpData, (i, index) => {
              return { value: index + 1, label: index + 1 };
            })}
            value={popUpPage}
            variant="filled"
            size="xs"
            onChange={(e) => setPopUpPage(e)}
          />
          <button
            className="caretBtn"
            aria-label="Next"
            type="button"
            onClick={() => {
              if (popUpPage < popUpData.length)
                setPopUpPage((page) => page + 1);
            }}
          >
            <Icon icon={faCaretRight}></Icon>
          </button>
        </Flex>
      </Flex>

      <Group grow className="feature">
        <Table verticalSpacing="xs" className="featureTable">
          <thead>
            <tr>
              <th width="50%">標題</th>
              <th width="50%">內容</th>
            </tr>
          </thead>
          <tbody>
            {_.map(popupColumn, (col) => {
              return (
                <tr key={`${col.title}`}>
                  <td>{col.title}</td>
                  <td>
                    {col.format
                      ? col.format(_.get(popUpData[popUpPage - 1], col.key, ""))
                      : _.get(popUpData[popUpPage - 1], col.key, "")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Group>
    </Dialog>
  );
}, arePropsEqual);

export default RegionalMap;
