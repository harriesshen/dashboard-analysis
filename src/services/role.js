import request from "../utils/request";

export function GET_RoleList(token) {
  return request.get("/RoleModuleSetting/get", null, {
    headers: { Authorization: token },
  });
}

export function POST_Role(payload, token) {
  return request.post("/RoleModuleSetting/post", payload, {
    headers: { Authorization: token },
  });
}

export function PUT_Role(payload, token) {
  return request.put("/RoleModuleSetting/put", payload, {
    headers: { Authorization: token },
  });
}

export function DELETE_Role(role_id, token) {
  return request.delete(`/RoleModuleSetting/delete?role_id=${role_id}`, null, {
    headers: { Authorization: token },
  });
}
