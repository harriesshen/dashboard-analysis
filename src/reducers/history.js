const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SAVE_History":
      return { ...state, History: payload };
    default:
      return state;
  }
};
