import Head from "next/head";
import { Fragment, useEffect, useState, useContext } from "react";
import Script from "next/script";
import Link from "next/link";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { UserContext } from "../../contexts/UserContext";
import { get_token, isLogged } from "../../Utils";
import Loader from "../../components/Loader";
import Router from "next/router";
import { useToasts } from "react-toast-notifications";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Box, Modal } from "@material-ui/core";

export default function Login(props) {
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const [resendModal, setResendModal] = useState(false);
  const { addToast } = useToasts();
  const appId = "1234996487298599";
  const styles = {
    background: "#345DA7",
    color: "#fff",
    padding: "11px",
    borderRadius: "4px",
    boxShadow: "0px 2px 3px 0 #3a559f",
    width: "44%",
    textAlign: "center",
    marginLeft: "10px",
  };
  const smStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "background.paper",
      overflow: "auto",
      height: "40% !important",
      width: "27% !important",
      borderRadius: 4,
      boxShadow: 24,
      textAlign: "center",
      padding: "20px",
      border: "none !important",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    
  };
  const responseFacebook = async (response) => {
    let token = response.accessToken;
    console.log("facebook response ", response.accessToken);
    await axios
      .post(
        "http://127.0.0.1:8000/api/auth/callback/facebook",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          mode: "cors",
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // login with Google
  const clientId =
    "953883147552-rh6iq31je14452uei2pj4t978b6jdbg0.apps.googleusercontent.com";
  useEffect(async () => {
    const gapi = await import("gapi-script").then((pack) => pack.gapi);
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  function checkConfirmed(resp) {
    if (!resp.is_confirmed) {
      addToast("Confirm your email before accessing your account", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    if (User.logged) {
      console.log(User);
      Router.push(User.path);
    } else {
      async function checkUser() {
        let resp = await isLogged();
        if (resp) {
          if (checkConfirmed(resp)) {
            let obj = { ...User };
            obj.logged = true;
            obj.username = resp.username;
            obj.joined = resp.joined;
            obj.isA = resp.hasAdminAcess;
            obj.isSuper = resp.isSuperUser;
            obj.path = resp.path;
            obj.emal = resp.email;
            obj.depositID = resp.deposit_id;
            console.log("user logged in", obj);
            setUser(obj);
          }
        }
      }

      checkUser().then(() => {
        console.log("done check");
        setLoading(false);
      });
    }
  }, [User]);

  const onSuccess = async (res) => {
    let token = res.accessToken;
    console.log(res);
    await axios
      .post(
        "http://127.0.0.1:8000/api/signup",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          mode: "cors",
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    // let username = res.profileObj.givenName + "_" + res.profileObj.familyName;
    // let password = res.profileObj.givenName + "@12345";
    // let resp = await get_token(username, password, true);
    // if (resp.s || checkConfirmed(resp)) {
    //   let obj = { ...User };
    //   obj.logged = true;
    //   obj.username = resp.username;
    //   obj.joined = resp.joined;
    //   obj.isA = resp.s;
    //   obj.path = resp.path;
    //   obj.emal = resp.email;
    //   obj.depositID = resp.deposit_id;

    //   if (resp.enable_login) {
    //     setUser(obj);
    //     addToast("Logged in", {
    //       appearance: "success",
    //       autoDismiss: true,
    //     });
    //     // Router.push("/app/profile");
    //   } else {
    //     addToast("User Login Disabled", {
    //       appearance: "error",
    //       autoDismiss: true,
    //     });
    //   }
    // }
  };

  const onFailure = (err) => {
    console.log("failed", err);
  };

  const loginMethod = async (e) => {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let resp = await get_token(username, password, true);
    console.log("resp here");
    console.log(resp);
    if (resp) {
      if (resp.status == false) {
        console.log("login failed");
        console.log(resp);

        for (let key of Object.keys(resp.result)) {
          if (key == "detail") {
            addToast("Login failed : " + resp.result[key], {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            addToast("Login failed : " + key + " : " + resp.result[key][0], {
              appearance: "error",
              autoDismiss: true,
            });
          }
        }
      } else {
        console.log(
          "resp status is: ",
          !resp.s,
          " checkConfirmed returned : " + checkConfirmed(resp)
        );

        if (resp.s || checkConfirmed(resp)) {
          let obj = { ...User };
          obj.logged = true;
          obj.username = resp.username;
          obj.joined = resp.joined;
          obj.isA = resp.hasAdminAcess;
          obj.isSuper = resp.isSuperUser;
          obj.path = resp.path;
          obj.emal = resp.email;
          obj.depositID = resp.deposit_id;

          if (resp.enable_login) {
            setUser(obj);
            addToast("Logged in", {
              appearance: "success",
              autoDismiss: true,
            });
          } else {
            addToast("User Login Disabled", {
              appearance: "error",
              autoDismiss: true,
            });
          }
        }
      }
    } else {
      addToast("Login failed", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const sendConfirmationLink = async (e) => {
    e.preventDefault();
    let email = document.getElementById("emailAddress").value;
    // resend link will be sent from backend;
    addToast("Confirmation Link Sent", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  const html = (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no"
        />
        <link rel="shortcut icon" href="/assets/images/LIQD_logo_Square.png" />
        {/* <link rel="stylesheet" href="/styles/global/login.css" /> */}

        <title>Login</title>
      </Head>
      <div
        id="liqd-platform"
        className="application"
        style={{ filter: "blur(2px)", overflow: "hidden" }}
      >
        <header id="Header">
          <section>
            <aside>
              <Link className="m-t-5" href="/">
                <img alt="Liqd" width={50} src="/assets/images/LIQD_logo_Square.png" />
              </Link>
            </aside>
            <nav />
            <aside>
              <a className="button" href="/register">
                New Account
              </a>
              <Link className="button" href="/">
                Login
              </Link>
              <a className="MenuHelp" aria-expanded="false">
                <i className="far fa-question-circle" />
              </a>
            </aside>
          </section>
        </header>
        <div>
          <main>
            <section className="fakeBackground">
              <div>
                <div className="liqdBenefits">
                  <a className="close">
                    <i className="fal fa-times" />
                  </a>
                  <h1>Flexible Instant Crypto Credit Lines</h1>
                  <div>
                    <div>
                      <img
                        alt
                        height={32}
                        src="../assets/img/earn/bitcoin.svg"
                      />
                      <img
                        alt
                        height={32}
                        src="../assets/img/earn/ethereum.svg"
                      />
                      <img
                        alt="Imag"
                        height={32}
                        src="../assets/img/earn/liqd.png"
                      />
                      <img
                        alt
                        height={32}
                        src="../assets/img/earn/XRP.svg"
                        style={{ marginLeft: 4 }}
                      />
                    </div>
                    <h2>
                      1. Deposit Crypto Assets to Your Insured &amp; Secured
                      liqd Account
                    </h2>
                    <h3>
                      $375M insurance and maximum security with the audited
                      custodian BitGo
                    </h3>
                  </div>
                  <div>
                    <div>
                      <img
                        alt
                        height={32}
                        src="../assets/img/earn/cc-sc-usdc.svg"
                      />
                      <img
                        alt="Imag"
                        height={32}
                        src="../assets/img/earn/EUR.png"
                      />
                    </div>
                    <h2>
                      2. Credit Line is Now Available. Borrow with Automatic
                      Approval, no Credit Checks
                    </h2>
                    <h3>
                      Your Credit Line limit is based on the value of your
                      deposited crypto assets
                    </h3>
                  </div>
                  <div>
                    <div>
                      <i className="fa fa-money-bill-alt" />
                    </div>
                    <h2>
                      3. Spend Money Instantly with liqd Card or Borrow Cash and
                      Stablecoins
                    </h2>
                    <h3>
                      Spend from the Credit Line at any time. From only 6.9% APR
                      on what you use
                    </h3>
                  </div>
                  <div>
                    <div>
                      <i className="fa fa-undo" />
                    </div>
                    <h2>No Minimum Loan Repayments, No Hidden Fees</h2>
                    <h3>
                      Interest is debited automatically from your available
                      credit limit. Flexible repayments, at any time
                    </h3>
                  </div>
                </div>
                <div className="banners">
                  <a href="/exchange/swap">
                    <div
                      className="Banner lowestCryptCreditLineRates"
                      style={{
                        backgroundImage:
                          'url("../../assets/img/back-banner/lower-interest-bg.webp")',
                      }}
                    >
                      <img
                        alt
                        width="100%"
                        src="/assets/img/back-banner/lower-interest-text.webp"
                      />
                    </div>
                  </a>
                  <a href="/exchange/buy">
                    <div
                      className="Banner earnUpTo10PercentsOnAssets"
                      style={{
                        backgroundImage:
                          'url("../../assets/img/back-banner/interest-bg.webp")',
                      }}
                    >
                      <img
                        alt
                        width="100%"
                        src="/assets/img/back-banner/earn-on-crypto-content.webp"
                      />
                    </div>
                  </a>
                </div>
                <div className="AccountFinancialOverview">
                  <div>
                    <i className="far fa-question-circle" />
                    <h6>Portfolio Balance</h6>
                    <div />
                    <span>$2,048.00</span>
                  </div>
                  <div>
                    <i className="far fa-question-circle" />
                    <h6>Credit Line</h6>
                    <span className="tc-indigo-500">$512.00</span>
                    <div />
                    <h6>Available Credit</h6>
                    <span className="tc-blue-500">$1,024.00</span>
                  </div>
                  <div>
                    <i className="far fa-question-circle" />
                    <h6>Interest Earned</h6>
                    <div />
                    <span className="tc-mint-500">$128.00</span>
                    <a href="/interest-earned">
                      See Interest Details{" "}
                      <i className="far fa-long-arrow-right" />
                    </a>
                  </div>
                  <div>
                    <h6>Loyalty Level</h6>
                    <div />
                    <span>Platinum</span>
                    <a href="/profile/loyalty-levels">
                      You’re Platinum Now!{" "}
                      <i className="far fa-long-arrow-right" />
                    </a>
                  </div>
                </div>
                <div className="card">
                  <div className="actions">
                    <a className="ActionButton" href="/borrow">
                      <img
                        alt="Imag"
                        src="/assets/icons/borrow-dashboard.svg"
                      />
                      <strong>Borrow</strong>
                      <span>Cash or Stablecoins</span>
                    </a>
                    <a className="ActionButton" href="/repayment">
                      <img alt="Imag" src="/assets/icons/repay-dashboard.svg" />
                      <strong>Repay</strong>
                      <span>with Crypto, Cash or Stablecoins</span>
                    </a>
                    <Link className="ActionButton" href="/exchange">
                      <a>
                        <img
                          alt="liqd Wallet"
                          src="/assets/icons/exchange-dashboard.svg"
                        />
                        <strong>Exchange</strong>
                        <span>Buy, Sell and Swap</span>
                      </a>
                    </Link>
                  </div>
                  <table
                    className="AssetList"
                    id="AssetList"
                    cellSpacing={0}
                    cellPadding={0}
                    border={0}
                  >
                    <thead>
                      <tr>
                        <th align="left" width={200}>
                          <button type="button" className="Button secondary">
                            Calculator
                          </button>
                        </th>
                        <th align="right" width={200}>
                          Balance
                        </th>
                        <th align="right">Credit Line</th>
                        <th align="right">Earn Interest</th>
                        <th colSpan={3} align="right">
                          <div className="Toggle">
                            <label>Hide Zero Balance Assets</label>
                            <span>off</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody />
                  </table>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <div className="Portal backdrop">
        <div className="my-5 Modal FormLogin py-3 " style={{ width: 500 }}>
          <main>
            <h4>Login</h4>
            <form className="mt-l">
              <div className="center p-s bg-grey-50 radius-m">
                <span className="tc-grey-600 fw-n">
                  Please make sure you are visiting{" "}
                </span>
                <div className="mt-xs2">
                  <span className="tc-mint-500 fw-n">
                     <i className="fas fa-lock">&nbsp;</i>https://
                  </span>
                  <span className="fw-n tc-grey-900">www.liqid.fi</span>
                </div>
              </div>
              <label className="mt-l">Username</label>
              <div className="TextBox">
                <input type="text" id="username" />
              </div>
              <label className="mt-xl">Password</label>
              <div className="TextBox">
                <input type="password" id="password" />
              </div>
              <div className="flex mt-xl">
                <button
                  type="submit"
                  onClick={loginMethod}
                  className="Button large primary block"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="flex center mt-l login_wrapper">
              <GoogleLogin
                clientId={clientId}
                buttonText="Sign in with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                // isSignedIn={true}
              />
              {/* <div className="facebook_login_wrapper">
                <FacebookLogin
                  appId={appId}
                  autoLoad={true}
                  fields="name,email,picture"
                  className="kep-login-facebook facebook_login"
                  callback={responseFacebook}
                  // icon="fa-facebook"
                  textButton="Sign in with Facebook"
                />
              </div> */}
            </div>
            <div className="flex center fs-medium semi-bold links mt-l">
              <span className="light">{"Don't have a LIQD Account?"}</span>
              <i className="m-h-5">•</i>{" "}
              <Link href="/app/register/">
                <a>New Account</a>
              </Link>
              <i className="m-h-5">•</i>{" "}
              <Link href="/app/recover">
                <a>Forgot Password</a>
              </Link>
            </div>
            <div className="flex center fs-medium semi-bold links mt-m">
              <span className="light">
                {"Didn't receive confirmation link?"}
              </span>
              <i className="m-h-5">•</i>{" "}
              <a onClick={() => setResendModal(true)} role={"button"}>
                Resend
              </a>
            </div>
            <div className="center mt-xl">
              <button
                type="button"
                className="Button link LanguagePickerButton"
                aria-expanded="false"
              >
                <i className="fa fa-language" /> English
              </button>
            </div>
          </main>
        </div>
      </div>
      <Modal
        open={resendModal}
        onClose={() => setResendModal(false)}
        aria-labelledby="Resend Confirmation Link"
        aria-describedby="Resend Confirmation Link"
      >
        <Box className="items-center justify-center custom_mui_box">
          <form style={{width:'100%'}}
            onSubmit={(e) => {
              setResendModal(false);
              sendConfirmationLink(e);
            }}
          >
            <div className="d-flex w-5/5 flex-column justify-center align-center mx-auto">
              <label
                className="d-inline-block my-2 center"
                style={{ color: "inherit" }}
              >
                Enter your email to receive confirmation link.
              </label>
              <input
                className="border-1 h-16 p-2 my-2"
                id="emailAddress"
                type={'email'}
                placeholder="Enter your email..."
                required
              />
              <button type="submit" className="Button primary my-2">
                Resend
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <Script
        src="https://kit.fontawesome.com/d53d06f463.js"
        strategy="beforeInteractive"
      />
    </Fragment>
  );

  return loading ? <Loader setLoading={setLoading} /> : html;
}
