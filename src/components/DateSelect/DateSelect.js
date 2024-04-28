/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import { useEffect, useState } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import moment from "moment";
import { Select, Group, Grid } from "@mantine/core";

import "./DateSelect.scss";

const timeOption = [];
let hours = 0;
while (hours < 24) {
  let min = 0;
  while (min < 60) {
    let hoursStr = "";
    let minStr = "";
    hours < 10 ? (hoursStr = `0${hours}`) : (hoursStr = `${hours}`);
    min < 10 ? (minStr = `0${min}`) : (minStr = `${min}`);
    timeOption.push({
      label: `${hoursStr}:${minStr}`,
      value: `${hoursStr}:${minStr}:00`,
    });
    min += 15;
  }
  hours++;
}

const DateSelect = (props) => {
  const nowDate = [
    Number(moment().format("YYYY") - 1911),
    Number(moment().format("MM")),
    Number(moment().format("DD")),
  ];
  const format =
    (props.yearsAble ? "YYYY" : "") +
    (props.monthAble ? "/MM" : "") +
    (props.daysAble ? "/DD" : "");
  let preset = "";
  let preset2 = "";
  if (props.presetTime) {
    if (props.isPeriod) {
      preset = moment(props.presetTime[0], format);
      preset2 = moment(props.presetTime[1], format);
    } else {
      preset = moment(props.presetTime[0], format);
    }
  }
  const [yearsSelected, setYearsSelected] = useState(
    props.presetTime ? `${Number(moment(preset).format("YYYY") - 1911)}` : ""
  );
  const [monthSelected, setMonthSelected] = useState(
    props.presetTime ? `${Number(moment(preset).format("MM"))}` : ""
  );
  const [daysSelected, setDaysSelected] = useState(
    props.presetTime ? `${Number(moment(preset).format("DD"))}` : ""
  );
  const [yearsSelected2, setYearsSelected2] = useState(
    props.presetTime && props.isPeriod
      ? `${Number(moment(preset2).format("YYYY") - 1911)}`
      : ""
  );
  const [monthSelected2, setMonthSelected2] = useState(
    props.presetTime && props.isPeriod
      ? `${Number(moment(preset2).format("MM"))}`
      : ""
  );
  const [daysSelected2, setDaysSelected2] = useState(
    props.presetTime && props.isPeriod
      ? `${Number(moment(preset2).format("DD"))}`
      : ""
  );
  const [id, setid] = useState(1);

  const yearsList = _.map(props.YearList, (years) => {
    return { label: `${years}年`, value: `${years}` };
  });
  let monthList = [];
  let daysList = [];
  let yearsList2 = [];
  let monthList2 = [];
  let daysList2 = [];
  if (yearsSelected === `${nowDate[0]}`) {
    monthList = _.map(_.range(1, Number(nowDate[1]) + 1, 1), (month) => {
      return { label: `${month}月`, value: `${month}` };
    });
  } else {
    monthList = _.map(_.range(1, 13, 1), (month) => {
      return { label: `${month}月`, value: `${month}` };
    });
  }
  if (yearsSelected === `${nowDate[0]}` && monthSelected === `${nowDate[1]}`) {
    daysList = _.map(_.range(1, Number(nowDate[2]) + 1, 1), (days) => {
      return { label: `${days}日`, value: `${days}` };
    });
  } else {
    const req = /^[1,3,5,7,8,10,12]*$/;
    if (req.test(monthSelected)) {
      daysList = _.map(_.range(1, 32, 1), (days) => {
        return { label: `${days}日`, value: `${days}` };
      });
    } else {
      daysList = _.map(_.range(1, 31, 1), (days) => {
        return { label: `${days}日`, value: `${days}` };
      });
    }
  }
  if (yearsSelected) {
    yearsList2 = _.filter(yearsList, (years) => {
      if (years.value >= yearsSelected) return years;
    });
  } else {
    yearsList2 = _.map(yearsList, (years) => {
      return years;
    });
  }
  if (yearsSelected2 === `${nowDate[0]}`) {
    monthList2 = _.filter(
      _.map(_.range(1, Number(nowDate[1]) + 1, 1), (month) => {
        return { label: `${month}月`, value: `${month}` };
      }),
      (month) => {
        if (monthSelected) {
          if (Number(month.value) >= Number(monthSelected)) return month;
        } else {
          return month;
        }
      }
    );
  } else {
    monthList2 = _.filter(
      _.map(_.range(1, 13, 1), (month) => {
        return { label: `${month}月`, value: `${month}` };
      }),
      (month) => {
        if (monthSelected) {
          if (Number(month.value) >= Number(monthSelected)) return month;
        } else {
          return month;
        }
      }
    );
  }
  if (
    yearsSelected2 === `${nowDate[0]}` &&
    monthSelected2 === `${nowDate[1]}`
  ) {
    daysList2 = _.map(_.range(1, Number(nowDate[2]) + 1, 1), (days) => {
      return { label: `${days}日`, value: `${days}` };
    });
  } else {
    const req = /^[1,3,5,7,8,10,12]*$/;
    if (req.test(monthSelected2)) {
      daysList2 = _.filter(
        _.map(_.range(1, 32, 1), (days) => {
          return { label: `${days}日`, value: `${days}` };
        }),
        (days) => {
          if (daysSelected) {
            if (Number(days.value) >= Number(daysSelected)) return days;
          } else {
            return days;
          }
        }
      );
    } else {
      daysList2 = _.filter(
        _.map(_.range(1, 31, 1), (days) => {
          return { label: `${days}日`, value: `${days}` };
        }),
        (days) => {
          if (daysSelected) {
            if (Number(days.value) >= Number(daysSelected)) return days;
          } else {
            return days;
          }
        }
      );
    }
  }

  useEffect(() => {
    // console.log(yearsSelected)
    const body = props.isPeriod
      ? [
          moment(
            `${Number(yearsSelected) + 1911}/${monthSelected}/${daysSelected}`,
            format
          ).format(format),
          moment(
            `${
              Number(yearsSelected2) + 1911
            }/${monthSelected2}/${daysSelected2}`,
            format
          ).format(format),
        ]
      : moment(
          `${Number(yearsSelected) + 1911}/${monthSelected}/${daysSelected}`,
          format
        ).format(format);
    props.sendTime(body);
  }, [
    yearsSelected,
    monthSelected,
    daysSelected,
    yearsSelected2,
    monthSelected2,
    daysSelected2,
  ]);

  return (
    <div id="DateSelect">
      <Group>
        <Grid>
          <Grid.Col xs={6} sm={3} md={6} lg={3}>
            <Group className="group">
              <span>從</span>
              {props.yearsAble && (
                <Select
                  data={yearsList}
                  value={yearsSelected}
                  onChange={(e) => setYearsSelected(e)}
                  className="w-80"
                />
              )}
            </Group>
          </Grid.Col>
          <Grid.Col xs={6} sm={3} md={6} lg={3}>
            <Group className="group">
              <span>/</span>
              {props.monthAble && (
                <Select
                  data={monthList}
                  value={monthSelected}
                  onChange={(e) => setMonthSelected(e)}
                  className="w-80"
                />
              )}
            </Group>
          </Grid.Col>
          <Grid.Col xs={6} sm={3} md={6} lg={3}>
            <Group className="group">
              {props.isPeriod && <span>至</span>}
              {props.isPeriod && props.yearsAble && (
                <Select
                  data={yearsList2}
                  value={yearsSelected2}
                  onChange={(e) => setYearsSelected2(e)}
                  className="w-80"
                />
              )}
            </Group>
          </Grid.Col>
          <Grid.Col xs={6} sm={3} md={6} lg={3}>
            <Group className="group">
              {props.isPeriod && <span>/</span>}
              {props.isPeriod && props.monthAble && (
                <Select
                  data={monthList2}
                  value={monthSelected2}
                  onChange={(e) => setMonthSelected2(e)}
                  className="w-80"
                />
              )}
            </Group>
          </Grid.Col>
        </Grid>
      </Group>
    </div>
  );
};

DateSelect.prototype = {
  isPeriod: PropTypes.bool,
  presetTime: PropTypes.string,
  yearsAble: PropTypes.bool,
  monthAble: PropTypes.bool,
  daysAble: PropTypes.bool,
};

DateSelect.defaultProps = {
  isPeriod: true,
  presetTime: moment(),
  yearsAble: true,
  monthAble: true,
  daysAble: true,
};

export default DateSelect;
