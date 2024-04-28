import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Grid, Select, Button, MultiSelect, Group, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

import ChangeMulti from "../../utils/changeMulti";
// import ExportButton from "../ExportButton";

const convertSearchValue = (values) => {
  return {
    year: values.year,
    analysis_project: values.analysis_project,
  };
};

const FeatureSearch = (props) => {
  const {
    Loading,
    year,
    analysisItem,
    initialValues,
    search,
    exportCsvFn,
    pdfRef,
  } = props; // 父層參數
  const [init, setInit] = useState({});
  const label = ["查詢時間", "分析項目"];

  const Form = useForm({
    initialValues,
    validationRules: {
      year: (value) => value !== "",
      analysis_project: (value) => value !== "",
    },
  });

  useEffect(() => {
    if (!_.isEqual(initialValues, init) && !_.isEmpty(initialValues)) {
      const temp = {
        ...initialValues,
        // date: [initialValues.start_date, initialValues.end_date],
      };

      Form.setValues(temp);
      // setType("edit");
      setInit(temp);
    }
  }, [Form, initialValues, init]);

  const onSubmit = Form.onSubmit((values) => props.onSubmit({ ...values }));
  return (
    <form onSubmit={onSubmit}>
      <Group>
        <Text fw={500}>{label[0]}</Text>
        <Select
          zIndex={500}
          placeholder={`請選擇${label[0]}`}
          data={year.map((i) => {
            return { label: i, value: i };
          })}
          {...Form.getInputProps("year")}
        />
        <Text fw={500}>{label[1]}</Text>
        <Select
          zIndex={500}
          placeholder={`請選擇${label[1]}`}
          nothingFound="查無資料"
          data={analysisItem}
          {...Form.getInputProps("analysis_project")}
        />
        <Button loading={Loading} type="submit" variant="light" color="blue">
          查詢
        </Button>
        {/* <ExportButton
          search={search}
          showCsv={true}
          exportCsvFn={exportCsvFn}
          showPdf={true}
          pdfRef={pdfRef}
          pdfName={"特徵分析"}
        /> */}
      </Group>
    </form>
  );
};

export default FeatureSearch;
