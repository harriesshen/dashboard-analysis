const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SAVE_Report":
      return { ...state, ReportData: payload };
    default:
      return state;
  }
};
