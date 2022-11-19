import axios from "axios";
import Router from "next/router";
import { req } from "../../Utils";

let url = `https://api.cleardil.com`;

const getToken = async () => {
  let resp = await axios.post(
    `${url}/v1/oauth2/token`,
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: "lithex_id",
        password: "c30bcb2b-ecf2-48c1-a20f-641282768d80",
      },
      mode: "cors",
    }
  );
  return resp;
}; 
export const getAPIToken = async (username) => {
  getToken()
    .then((res) => {
      let access = res?.data?.access_token;
      localStorage.setItem("cleardil_access_token_" + username, access);
      console.log("resp token : ", res);
      if (localStorage.getItem("customer_id_" + username)) {
        let customerID = localStorage.getItem("customer_id_" + username);
        generateSDKToken(access, customerID, username);
      } else {
        createCustomer(access, username);
      }
    })
    .catch((err) => {
      console.log("error in generating token ", err);
    });
};

// Create Customer
const createCustomer = async (access, username) => {
  let resp = await req("session");
  console.log("resp:", resp);
  let address = {};
  address["type"] = "Primary";
  address["property_name"] = "";
  address["line"] = "";
  address["city"] = "";
  address["postal_code"] = "";
  address["state_or_province"] = "";
  address["country"] = "";

  let data = {};
  data["type"] = "INDIVIDUAL";
  data["email"] = resp?.email;
  data["first_name"] = resp.username;
  data["last_name"] = resp.username;
  // data["addresses"] = address;

  await axios
    .post(`${url}/v1/customers`, data, {
      headers: {
        Authorization: "Bearer " + access,
        "content-type": "application/json",
      },
      mode: "cors",
    })
    .then((res) => {
      const response = res?.data;
      console.log("create customer response", response);
      if (response?.id != null || response?.id != "") {
        const customerID = response?.id;
        localStorage.setItem("customer_id_" + username, customerID);
        generateSDKToken(access, customerID, username);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

async function approve(dec, msg, id, access) {
  let opt = await req("session");
  console.log("otp: ", opt);
  let body = {
    user_id: opt.id,
    ticket_id: opt?.ticket_id,
    approved: dec,
    reason: msg,
  };

  // let resp = await postReq("approve",body);
  // if (resp){
  //   if (dec){
  //     addToast("User " + opt.username + " approved", {
  //       appearance: "success",
  //       autoDismiss : true
  //     } )
  //   }else{
  //     addToast("User " + opt.username + " rejected", {
  //       appearance: "success",
  //       autoDismiss : true
  //     } )
  //   }
  //   refreshData();
  // }else{
  //   addToast("failed", {
  //     appearance: "error",
  //     autoDismiss : true
  //   } )

  // }
}

export const screenCustomer = async (username) => {
  let customerID = localStorage.getItem("customer_id_" + username);
  getToken()
    .then(async (resp) => {
      let access = resp.data.access_token;
      let body = ["PEP", "WATCHLIST", "DISQUALIFIED_ENTITIES"];
      await axios
        .post(`${url}/v1/customers/${customerID}/screenings`, body, {
          headers: {
            Authorization: "Bearer " + access,
            "content-type": "application/json",
          },
          mode: "cors",
        })
        .then((res) => {
          const response = res?.data;
          console.log("screen customer response", response.id);
          const screeningID = response?.id;
          if (response?.status == "PENDING") {
            getMatches(customerID, screeningID);
            return "pending";
          } else {
            console.log(
              "user screening is clear. Auto Approve the customer account."
            );
            approve(true, "Auto approve", customerID, access);
            return true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getMatches = async (customerID, screeningID) => {
  await axios
    .get(
      `${url}/v1/customer/${customerID}/screenings/${screeningID}/matches`,
      {}
    )
    .then((response) => {
      let result = response.data;
      console.log("all screening matches ", result);
    });
};
const generateSDKToken = async (access, customerID,username) => {
  await axios
    .post(
      `${url}/v1/sdk/token`,
      { customer: customerID },
      {
        headers: {
          Authorization: "Bearer " + access,
          "content-type": "application/json",
        },
      }
    )
    .then((response) => {
      const result = response.data;
      const sdkToken = result?.token;
      localStorage.setItem("sdk_token_" + username, sdkToken);
      console.log(response);
      Router.push(`https://lithex.cleardil.com/?token=${sdkToken}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const checkVerificationStatus = async (username) => {
  // let resp = await req("session");
  let sdkToken = localStorage.getItem("sdk_token_" + username);
  await axios
    .get(
      `${url}/v1/sdk/token/${sdkToken}/status`,
      {},
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    )
    .then((response) => {
      let status = response?.data;
      console.log("screening status : ", status , sdkToken);
    })
    .catch((error) => {
      console.log("token status error : ", error);
    });
};
