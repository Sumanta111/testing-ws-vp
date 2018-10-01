import axios from 'axios';

let _authenticated = false;
// eslint-disable-next-line
let _access_token = null;
// eslint-disable-next-line
let _refresh_token = null;

const HOST = 'https://staging.voiceoverping.net';
const API_VIRSION = 'v2';
const CLIENTID = '2359media';
const CLIENTSECRET = '2359admin';
const GRANTTYPE = 'password';

let headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

const sendRequest = (url, method, data) => {

  setHeader();

  let option = {
    url: url,
    method: method,
    headers,
    timeout: 5000, // default is `0` (no timeout)
    validateStatus: function (status) {
      return status < 501;
    },
  };
  switch (method) {
    case 'post':
      option.data = data;
      break;
    default:
      break;
  }
  try {
    return axios({ ...option });
  } catch (error) {
    return error;
  }
};

const setHeader = () => {
  if (_authenticated) {
    headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + _access_token,
    };
  }
};

export const auth = {
  autherise: async (callback, username, password) => {

    const response = await sendRequest(HOST + '/oauth/token', 'post', {
      username: username,
      password: password,
      client_id: CLIENTID,
      client_secret: CLIENTSECRET,
      grant_type: GRANTTYPE,
    });

    if (callback) {
      callback(response);
    }
  },
  isAuthenticated: () => {
    return _authenticated;
  },
  setTokens: (access_token, refresh_token) => {
    _access_token = access_token;
    _refresh_token = refresh_token;
  },
  sendRequest,
};
