import request from "../utils/request";

export function GET_Account(token) {
  return request.get("/OperatorSetting/get", null, {
    headers: { Authorization: token },
  });
}

export function POST_Account(payload, token) {
  return request.post("/OperatorSetting/post", payload, {
    headers: { Authorization: token },
  });
}

export function PUT_Account(payload, token) {
  return request.put("/OperatorSetting/put", payload, {
    headers: { Authorization: token },
  });
}

export function DELETE_Account(op_id, token) {
  return request.delete(`/OperatorSetting/delete?op_id=${op_id}`, null, {
    headers: { Authorization: token },
  });
}
