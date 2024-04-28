const TOKEN_KEY = "TOKEN";
const USERID_KEY = "USER_ID";
const USERACCOUNT_KEY = "USER_ACCOUNT";
const USEREMAIL_KEY = "USER_EMAIL";
const USERPID_KEY = "USER_PID";
const USERNAME_KEY = "USER_NAME";
const USERUNIT_KEY = "USER_UNIT";
const USERROLEID_KEY = "USER_ROLEID";
const USER_DASHBOARD = "USER_DASHBOARD";

export function getToken() {
  return {
    Token: localStorage.getItem(TOKEN_KEY),
    UserID: localStorage.getItem(USERID_KEY),
    Account: localStorage.getItem(USERACCOUNT_KEY),
    Name: localStorage.getItem(USERNAME_KEY),
    Email: localStorage.getItem(USEREMAIL_KEY),
    Process: localStorage.getItem(USERPID_KEY),
    Unit: localStorage.getItem(USERUNIT_KEY),
    RoleID: localStorage.getItem(USERROLEID_KEY),
    Dashboard: localStorage.getItem(USER_DASHBOARD),
  };
}

export function setToken(data) {
  localStorage.setItem(TOKEN_KEY, data.Token);
  localStorage.setItem(USERID_KEY, data.UserID);
  localStorage.setItem(USERACCOUNT_KEY, data.Account);
  localStorage.setItem(USERNAME_KEY, data.Name);
  localStorage.setItem(USEREMAIL_KEY, data.Email);
  localStorage.setItem(USERPID_KEY, data.Process);
  localStorage.setItem(USERUNIT_KEY, data.Unit);
  localStorage.setItem(USERROLEID_KEY, data.RoleID);
  localStorage.setItem(USER_DASHBOARD, data.Dashboard);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERID_KEY);
  localStorage.removeItem(USERACCOUNT_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(USEREMAIL_KEY);
  localStorage.removeItem(USERPID_KEY);
  localStorage.removeItem(USERUNIT_KEY);
  localStorage.removeItem(USERROLEID_KEY);
  localStorage.removeItem(USER_DASHBOARD);
}
