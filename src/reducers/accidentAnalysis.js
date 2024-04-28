const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SAVE_District":
      return { ...state, DistrictData: payload };
    case "SAVE_Point":
      return { ...state, PointData: payload };
    case "SAVE_PointDetail":
      return { ...state, PointDetailData: payload };
    default:
      return state;
  }
};
