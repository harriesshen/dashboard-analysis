import _ from "lodash";

const onReSize = ({ dispatch }) => {
  window.addEventListener("resize", (e) => {
    const screenWidth = _.get(window, "innerWidth", 1920);

    dispatch({
      type: "CHANGE_WindowScreenSize",
      payload: screenWidth,
    });
  });
};

const onLoad = ({ dispatch }) => {
  window.addEventListener("load", () => {
    const screenWidth = _.get(window, "innerWidth", 1920);

    dispatch({
      type: "CHANGE_WindowScreenSize",
      payload: screenWidth,
    });
  });
};

const root = (store) => {
  onReSize(store);
  onLoad(store);
};

export default root;
