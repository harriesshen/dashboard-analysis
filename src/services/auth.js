import request from "../utils/request";

export function POST_Login(payload) {
  return request.post("/Login", payload);
}

export function GET_ForgotPassword(payload) {
  return request.get("/Auth/forgetpassword", payload);
}

export function UPDATE_UserInfo(payload, token) {
  return request.put("/F01/F0101/Edit", payload, {
    headers: { Authorization: token },
  });
}

export function UPDATE_UserPassword(payload, token) {
  return request.put("/A01/EditPassword", payload, {
    headers: { Authorization: token },
  });
}
export function GET_UserID(payload, token) {
  return request.get("/A01/All/UserID", payload, {
    headers: { Authorization: token },
  });
}
