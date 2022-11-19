import axios from "axios";
import { ethers } from "ethers";
import { getAPIToken } from "../components/IdentityVerification/cleardilWebflow";

const base_url = "https://api.liqd.flexsin.org";

console.log("base url from env ++++++++++++++++++++++++++++", process.env.REACT_APP_API, process.env.REACT_APP_BASE_URL);
// const base_url = "http://127.0.0.1:8000"; //"https://be92-105-69-202-246.ngrok.io"  //
//const base_url = "http://35eb-105-69-234-197.ngrok.io"
// const base_url = "http://localhost:3000/"
const api = base_url + "/api/";

function set_header(token = null, file = false) {
  try {
    if (token == null && file == false) {
      // console.log('if', token);
      var obj = {
        "Content-Type": "application/json",
      };
    } else if (file) {
      // console.log('else if 1', token);
      var obj = {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + token,
      };
    } else {
      // console.log('else ', token);
      var obj = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
    }
    return obj;
  } catch (error) {
    console.log(error);
  }
}

export const handleResp = (resp, addToast) => {
  if (resp) {
    if (resp.failed == false) {
      addToast(resp.message, {
        autoDismiss: true,
        appearance: "success",
      });
      return true;
    } else if (resp.failed) {
      addToast(resp.message, {
        autoDismiss: true,
        appearance: "error",
      });
    } else {
      addToast("error", {
        autoDismiss: true,
        appearance: "error",
      });
    }
  } else {
    addToast("Failed", {
      autoDismiss: true,
      appearance: "error",
    });
  }
  return false;
};

export const handleFileSubmit = async (files) => {
  let form_data = new FormData();
  let access = sessionStorage.getItem("accessToken");
  let headers = set_header(access, true);

  form_data.append("addressProof", files.addressProof, files.addressProof.name);

  form_data.append("doc_type", "auth");
  form_data.append("ticket_type", "auth");
  let url = api + "upload";
  console.log(form_data);
  try {
    let resp = await axios.post(url, form_data, {
      headers,
    });

    if (resp.status == 201) {
      return true;
    } else {
      console.log("other errors");
      return false;
    }
  } catch (error) {
    let resp = error.response;
    if (resp.status == 401) {
      let dec = await refreshToken();
      console.log("dec",dec);
      if (dec) {
        return handleFileSubmit(files);
      } else {
        return false;
      }
    } else {
      console.log("other errors");
      return false;
    }
  }
};

export const handleSingleFileSubmit = async (file, endpoint, body = null) => {
  console.log("form", file);
  console.log("endpoint", endpoint);
  console.log("body", body);
  let form_data = new FormData();
  let access = sessionStorage.getItem("accessToken");
  let headers = set_header(access, true);
  if (body) {
    for (let key of Object.keys(body)) {
      form_data.append(key, body[key]);
    }
  }

  form_data.append("file", file, file.name);
  let url = api + endpoint;
  try {
    let resp = await axios.post(url, form_data, {
      headers,
    });

    if (resp.status == 201) {
      return true;
    } else {
      console.log("other errors");
      return false;
    }
  } catch (error) {
    let resp = error.response;
    if (resp.status == 401) {
      let dec = await refreshToken();
      if (dec) {
        return handleSingleFileSubmit(file, endpoint, body);
      } else {
        return false;
      }
    } else {
      console.log("other errors");
      return false;
    }
  }
};

export async function get_token(
  username = null,
  password = null,
  loginMode = false
) {
  let body = {
    username,
    password,
  };
  let headers = set_header();

  let options = {
    method: "post",
    body: JSON.stringify(body),
    headers: headers,
    mode: "cors",
  };

  let preResp = await fetch(api + "token", options);
  if (preResp.ok) {
    var resp = await preResp.json();
    let access = resp.access;
    let refresh = resp.refresh;
    sessionStorage.setItem("refreshToken", refresh);
    sessionStorage.setItem("accessToken", access);
    resp = await isLogged();
    return resp;
  } else {
    if (loginMode) {
      return { status: false, result: await preResp.json() };
    }
    return false;
  }
}

export async function registerCall(data) {
  let headers = set_header();

  let options = {
    method: "post",
    body: JSON.stringify(data),
    headers: headers,
    mode: "cors",
  };

  let preResp = await fetch(api + "register", options);
  console.log('pre response ',preResp)
  if (preResp.ok) {
    let d = await preResp.json();
    console.log('d : ',d);
    if (d.failed) {
      return d;
    }
    return d;
  } else {
    return false;
  }
}

export async function refreshToken() {
  let refresh = sessionStorage.getItem("refreshToken");
  let headers = set_header();
  let options = {
    method: "post",
    body: JSON.stringify({
      refresh,
    }),
    headers: headers,
    mode: "cors",
  };

  let preResp = await fetch(api + "token/refresh", options);
  if (preResp.ok) {
    let resp = await preResp.json();
    let access = resp.access;
    sessionStorage.setItem("accessToken", access);
    return true;
  } else {
    console.log("need to login");
    return false;
  }
}

export async function postReq(url, body, infoMode = false) {
  let access = sessionStorage.getItem("accessToken");
  let headers = set_header(access);

  let options = {
    method: "post",
    body: JSON.stringify(body),
    headers: headers,
    mode: "cors",
  };
  console.log('post req body : ',body);
  let preResp = await fetch(api + url, options);
  console.log('pre resp response ', preResp);
  if (preResp.ok) {
    let resp = await preResp.json();
    console.log('resp ',resp);
    return resp;
  } else if (preResp.status == 401) {
    let dec = await refreshToken();
    if (dec) {
      return postReq(url, body);
    } else {
      return false;
    }
  } else {
    console.log("other errors");
    if (infoMode) {
      let res = await preResp.json();
      return { failed: true, result: res };
    }
    return false;
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

export function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join("/");
}

export async function req(url) {
  let access = sessionStorage.getItem("accessToken");
  let headers = set_header(access);

  let options = {
    method: "get",
    headers: headers,
    mode: "cors",
  };

  let preResp = await fetch(api + url, options);
  if (preResp.ok) {
    let resp = await preResp.json();
    return resp;
  } else if (preResp.status == 401) {
    let dec = await refreshToken();
    if (dec) {
      return req(url);
    } else {
      return false;
    }
  } else {
    console.log("other errors");
    return false;
  }
}

export async function req_body(url, body) {
  let access = sessionStorage.getItem("accessToken");
  let headers = set_header(access);

  let options = {
    method: "get",
    headers: headers,
    body,
    mode: "cors",
  };

  let preResp = await fetch(api + url, options);
  console.log(preResp);
  if (preResp.ok) {
    let resp = await preResp.json();
    return resp;
  } else if (preResp.status == 401) {
    let dec = await refreshToken();
    if (dec) {
      return req(url);
    } else {
      return false;
    }
  } else {
    console.log("other errors");
    return false;
  }
}

export async function isLogged() {
  let resp = await req("session");
  return resp;
}

export function numberToBN(num, decimals) {
  let string_number = Number(Number(num) / 10 ** decimals).toLocaleString(
    "en-US",
    { useGrouping: false, maximumFractionDigits: decimals }
  );
  // console.log(string_number)
  let number = ethers.utils.parseUnits(string_number, decimals);
  // console.log(number.toString())
  return number;
}

export function logout(setUser) {
  // console.log("logged out")
  let obj = {
    id: null,
    logged: false,
    username: null,
    joined: null,
    isA: false,
    path: null,
    email: null,
  };
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  setUser(obj);
}

export function round(num, prec) {
  return Math.floor(num * 10 ** prec) / 10 ** prec;
}
