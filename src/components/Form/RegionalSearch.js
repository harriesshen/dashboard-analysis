import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import moment from "moment";
import {
  Grid,
  Select,
  Button,
  MultiSelect,
  Group,
  Text,
  Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import DateSelect from "../DateSelect/DateSelect";
import { multiSelectChangeValue } from "../../utils/multiSelectChangeValue";
// import ExportButton from "../ExportButton";

const convertSearchValue = (values) => {
  return {
    town_id: values.town,
    start_year: values.date[0].split("/")[0] - 1911,
    end_year: values.date[1].split("/")[0] - 1911,
    start_month: values.date[0].split("/")[1],
    end_month: values.date[1].split("/")[1],
  };
};

const RegionalSearch = (props) => {
  const { onSubmitFn } = props;
  const [initialValues, setInitialValues] = useState({
    print: "heatMap",
    town: ["全部"],
    date: ["2023/01", "2023/12"],
  });
  const { Town, Year, exportCsvFn, pdfRef, Loading } = props;
  const Form = useForm({
    initialValues,
    validationRules: {
      date: (value) => value.length !== 0,
      analysisBenchmark: (value) => value !== "",
      analysisRange: (value) => value !== "",
    },
  });

  const handleSubmit = Form.onSubmit((values) =>
    onSubmitFn(values, (bool) => setLoading(bool))
  );

  useEffect(() => {
    if (
      !_.isEqual(props.initialValues, initialValues) &&
      !_.isEmpty(props.initialValues)
    ) {
      const temp = {
        ...props.initialValues,
        date: [
          convertYear(props.initialValues.start_date),
          convertYear(props.initialValues.end_date),
        ],
      };

      Form.setValues(temp);
      setInitialValues(temp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialValues]);

  if (props.bindForm) props.bindForm(handleSubmit);

  return (
    <form onSubmit={handleSubmit}>
      <Group>
        {/* <Text fw={500}>區域/鄉鎮</Text> */}
        {/* onChange無反應，無法判斷選取其他縣市取消全選 */}
        <MultiSelect
          zIndex={500}
          // required
          label={"區域/鄉鎮"}
          placeholder={`請選擇區域/鄉鎮`}
          searchable
          clearable
          nothingFound="查無資料"
          data={Town}
          styles={{
            root: {
              display: "inline-flex",
              alignItems: "center",
            },
            label: {
              marginRight: "0.5rem",
              fontWeight: 500,
              fontSize: 16,
            },
          }}
          // value={value}
          // onSearchChange={(e) => SearchChange(e)}
          // value={initialValues.town}
          {...Form.getInputProps("town")}
          onChange={(value) => {
            const town = multiSelectChangeValue(value, Form.values.town);
            Form.setFieldValue("town", town);
          }}
        />

        <DateSelect
          isPeriod={true}
          presetTime={initialValues.date}
          yearsAble={true}
          monthAble={true}
          daysAble={true}
          YearList={Year}
          {...Form.getInputProps("date")}
          sendTime={(e) => Form.setFieldValue("date", e)}
        />
        {/* <Text fw={500}>分析方式</Text> */}

        <Select
          zIndex={500}
          label={"分析方式"}
          placeholder={`請選擇分析方式`}
          data={[
            { value: "heatMap", label: "熱力圖" },
            { value: "heatBlock", label: "熱區圖" },
            { value: "blobMap", label: "斑點圖" },
          ]}
          styles={{
            root: {
              display: "inline-flex",
              alignItems: "center",
            },
            label: {
              marginRight: "0.5rem",
              fontWeight: 500,
              fontSize: 16,
            },
          }}
          {...Form.getInputProps("print")}
        />
        <Button loading={Loading} type="submit" variant="light" color="blue">
          查詢
        </Button>
        {/* <ExportButton
          search={convertSearchValue(Form.values)}
          showCsv={true}
          exportCsvFn={exportCsvFn}
          showPdf={true}
          pdfRef={pdfRef}
          pdfName={"事故區域分析"}
        /> */}
      </Group>
    </form>
  );
};

export default RegionalSearch;
