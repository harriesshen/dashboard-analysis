/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Title, SegmentedControl } from "@mantine/core";

import Regional from "./Regional/Regional";
import "./AccidentDistribution.scss";

/* F03進階特徵事故分析 */
const AccidentDistribution = (props) => {
  const [page, setPage] = useState("Regional");

  const childPage = {
    Regional: <Regional />,
  };

  return (
    <div id="AccidentDistribution">
      <Title className="title">點位分佈</Title>
      <SegmentedControl
        size="md"
        // color="orange"
        value={page}
        onChange={setPage}
        data={[
          { value: "Regional", label: "區域分析" },
          // { value: "AccidentPoint", label: "事故點位比較" },
        ]}
      />
      <div className="page">{_.get(childPage, page)}</div>
    </div>
  );
};

export default AccidentDistribution;
