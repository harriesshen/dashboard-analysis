const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SAVE_RoleList":
      return { ...state, RoleList: payload };
    default:
      return state;
  }
};
