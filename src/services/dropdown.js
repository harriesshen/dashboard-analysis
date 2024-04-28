import request from "../utils/request";

export function GET_Roles(token) {
  return request.get("/Dropdown/Role", null, {
    headers: { Authorization: token },
  });
}

export function GET_Modules(token) {
  return request.get("/Dropdown/Module", null, {
    headers: { Authorization: token },
  });
}
