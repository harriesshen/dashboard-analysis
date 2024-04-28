import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Grid, Select, Button, MultiSelect, Group, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

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
    sort: values.sort,
    ranking: values.ranking,
  };
};

const AccidentPointSearch = (props) => {
  const { Town, Year, Loading, exportCsvFn, pdfRef } = props; // 父層參數

  const [initialValues, setInitialValues] = useState({
    town: ["全部"],
    date: ["2023/01", "2023/12"],
    sort: 0,
    ranking: 10,
  });

  const Form = useForm({
    initialValues,
    validationRules: {
      date: (value) => value.length !== 0,
      sort: (value) => value !== 0,
      ranking: (value) => value !== "",
    },
  });

  const onSubmit = Form.onSubmit((values) => props.onSubmit(values));

  if (props.bindForm) props.bindForm(onSubmit);

  // useEffect(() => {
  //   if (
  //     !_.isEqual(props.initialValues, initialValues) &&
  //     !_.isEmpty(props.initialValues)
  //   ) {
  //     const temp = {
  //       ...props.initialValues,
  //       date: [
  //         convertYear(props.initialValues.start_date),
  //         convertYear(props.initialValues.end_date),
  //       ],
  //     };

  //     Form.setValues(temp);
  //     setType("edit");
  //     setInitialValues(temp);
  //   }
  // }, [Form, initialValues, props.initialValues]);

  return (
    <form onSubmit={onSubmit}>
      <Group>
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
        <Select
          zIndex={500}
          label={"排序條件"}
          placeholder={`請選擇排序條件`}
          data={[
            { value: 0, label: "事故件數" },
            { value: 1, label: "CBI" },
          ]}
          styles={{
            root: {
              display: "inline-flex",
              alignItems: "center",
              width: "30%",
              "&>div": {
                // comboBox
                width: "70%",
              },
            },
            label: {
              marginRight: "0.5rem",
              fontWeight: 500,
              fontSize: 16,
              width: "30%",
            },
          }}
          {...Form.getInputProps("sort")}
        />
        <Select
          zIndex={500}
          width={100}
          label={"排行榜"}
          placeholder={`請選擇顯示數目`}
          data={[
            { value: 10, label: "前10名" },
            { value: 20, label: "前20名" },
          ]}
          styles={{
            root: {
              display: "inline-flex",
              alignItems: "center",
              paddingRight: "10px",
              width: "30%",
              "&>div": {
                // comboBox
                width: "75%",
              },
            },
            label: {
              marginRight: "0.5rem",
              fontWeight: 500,
              fontSize: 16,
              width: "25%",
            },
          }}
          {...Form.getInputProps("ranking")}
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
        {/* </Group> */}
      </Group>
    </form>
  );
};

export default AccidentPointSearch;
