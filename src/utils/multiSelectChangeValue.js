export const multiSelectChangeValue = (value, beforeValue) => {
  const different = _.difference(value, beforeValue)[0];
  if (different === "全部") return ["全部"];
  if (different !== "全部") return _.filter(value, (v) => v !== "全部");
};
