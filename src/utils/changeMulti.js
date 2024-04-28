import _ from "lodash";

const ChangeMulti = (value) => {
  if (value.length > 1 && value[0] === "All") return ([value[1]])
  else if (value.length > 1 && _.includes(value, "All")) return (["All"])
  return (value);
}
export default ChangeMulti;