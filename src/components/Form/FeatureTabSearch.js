/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import {
  Select,
  MultiSelect,
  Button,
  Group,
  Text,
  Chip,
  Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import DateSelect from "../DateSelect/DateSelect";
// import ExportButton from "../ExportButton";

const SearchForm = (props) => {
  const { Loading, Year, search, pdfName, pdfRef, type } = props;

  const [initialValues, setInitialValues] = useState({
    date: ["2022/01", "2022/08"],
  });

  const convertYear = (date) => {
    const tempDate = date.split("/");
    return `${Number(tempDate[0]) + 1911}/${tempDate[1]}/${tempDate[2]}`;
  };

  useEffect(() => {
    if (
      !_.isEqual(props.initialValues, initialValues) &&
      !_.isEmpty(props.initialValues)
    ) {
      // prettier-ignore
      const temp = {
        ...props.initialValues,
        date: [convertYear(props.initialValues.start_date), convertYear(props.initialValues.end_date)],
      };

      Form.setValues(temp);
      // setType("edit");
      setInitialValues(temp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialValues]);

  const Form = useForm({
    initialValues,
    validationRules: {
      date: (value) => value[0] !== "" && value[1] !== "",
    },
  });

  const onSubmit = Form.onSubmit((values) =>
    props.onSubmit({
      start_year: (
        Number(moment(values.date[0], "YYYY-MM").format("YYYY")) - 1911
      ).toString(),
      start_month: moment(values.date[0], "YYYY-MM").format("MM"),
      end_year: (
        Number(moment(values.date[1], "YYYY-MM").format("YYYY")) - 1911
      ).toString(),
      end_month: moment(values.date[1], "YYYY-MM").format("MM"),
    })
  );
  // if (props.bindForm) props.bindForm(onSubmit);
  return (
    <form onSubmit={onSubmit}>
      {_.map(type, (searchType, index) => {
        switch (searchType) {
          case "times":
            return (
              <Group key={`${searchType}${index}`}>
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
              </Group>
            );
          default:
            break;
        }
      })}
      <Group>
        <Button loading={Loading} type="submit" variant="light" color="blue">
          查詢
        </Button>
        {/* <ExportButton
          search={search}
          showCsv={true}
          showPdf={true}
          exportCsvFn
          pdfRef={pdfRef}
          pdfName={pdfName}
        /> */}
      </Group>
    </form>
  );
};

SearchForm.prototype = {
  column: PropTypes.array,
  align: PropTypes.string,
};

SearchForm.defaultProps = {
  column: [],
  align: "left",
};

export default SearchForm;
