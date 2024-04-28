const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SAVE_Roles":
      return { ...state, Roles: payload };
    case "SAVE_Modules":
      return { ...state, Modules: payload };
    // 區域/鄉鎮
    case "SAVE_Town":
      return { ...state, Town: payload };
    // 年度
    case "SAVE_Year":
      return { ...state, Year: payload };
    default:
      return state;
  }
};
