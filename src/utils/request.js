import _ from "lodash";
import axios from "axios";
import config from "../config";

const ax = axios.create({
  baseURL: config.api,
  timeout: 60000,
});

function responseData(res) {
  return res.data;
}

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }

  const error = new Error(res.statusText);
  error.response = res;
  throw error;
}

function call(_path, _method, _params = {}, _extendOption = {}) {
  let option = {
    url: _path,
    method: _method,
  };

  switch (_.toUpper(_method)) {
    case "PUT":
    case "POST":
    case "PATCH":
      option.data = _params;
      break;
    case "GET":
    case "DELETE":
      option.params = _params;
      break;
    default:
      break;
  }

  option = {
    ...option,
    ..._extendOption,
  };

  return ax.request(option).then(checkStatus).then(responseData);
}

function generateShortCutMethod(_method) {
  return (_path, _params = {}, _extendOption = {}) => {
    return call(_path, _.toUpper(_method), _params, _extendOption);
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  call,
  get: generateShortCutMethod("GET"),
  post: generateShortCutMethod("POST"),
  put: generateShortCutMethod("PUT"),
  patch: generateShortCutMethod("PATCH"),
  delete: generateShortCutMethod("DELETE"),
};
