import request from "../utils/request";

export function GET_History(token) {
  return request.get("/Log/get", null, {
    headers: { Authorization: token },
  });
}
