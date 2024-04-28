const initialState = { isMobile: false, isTablet: false, RoleFunctionList: "" };

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SAVE_isMobile":
      return { ...state, isMobile: payload };
    case "SAVE_isTablet":
      return { ...state, isTablet: payload };
    case "SAVE_Message":
      return { ...state, Message: payload };
    case "CLEAN_Message":
      return { ...state, CleanMessage: payload };
    case "SAVE_UserPid":
      return { ...state, UserPid: payload };
    case "SAVE_Marquee":
      return { ...state, Marquee: payload };
    case "SAVE_Title":
      return { ...state, Title: payload };
    case "SAVE_BackgroundColor":
      return { ...state, BackgroundColor: payload };
    case "SAVE_Logo":
      return { ...state, LogoSrc: payload };
    case "SAVE_MenuPosition":
      return { ...state, MenuPosition: payload };
    case "SAVE_Loading":
      return { ...state, Loading: payload };
    default:
      return state;
  }
};
