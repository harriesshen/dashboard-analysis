const api = {
  protocol: process.env.REACT_APP_API_PROTOCOL || "http",
  host: process.env.REACT_APP_API_HOST || "localhost",
  port: process.env.REACT_APP_API_PORT || 5501,
  prefix: process.env.REACT_APP_API_PREFIX || "",
};

const url = {
  protocol: process.env.REACT_APP_PROTOCOL || "http",
  host: process.env.REACT_APP_HOST || "localhost",
  port: process.env.PORT || 3001,
  prefix: process.env.REACT_APP_ROUTE_PREFIX || "",
};

// online
// export default {
//   api: `${api.protocol}://${api.host}${api.prefix}`,
//   url: `${url.protocol}://${url.host}${url.prefix}`,
//   domain: `${url.protocol}://${url.host}`,
// };

// localhost
export default {
  api: `${api.protocol}://${api.host}:${api.port}${api.prefix}`,
  url: `${url.protocol}://${url.host}:${url.port}${url.prefix}`,
  domain: `${url.protocol}://${url.host}`,
};
