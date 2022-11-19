import Head from "next/head";
import { Fragment, useContext, useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { GoogleLogin, useGoogleLogin } from "react-google-login";
import FacebookLogin from "@greatsumini/react-facebook-login";
// import { gapi } from 'gapi-script';
import { postReq, isLogged, registerCall, get_token } from "../../Utils";
import { UserContext } from "../../contexts/UserContext";
import Router from "next/router";
import { useToasts } from "react-toast-notifications";

import Loader from "../../components/Loader";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import SimpleLoader from "../../components/SimpleLoader";

export default function Register(props) {
  const [User, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [checked, setChecked] = useState(false);
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
  // Register facebook
  const responseFacebook = async (response) => {
    let token = response?.accessToken?.tokenId;
    console.log("facebook response ", response?.accessToken?.tokenId);
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
  };

  // Register with Google
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

  const onSuccess = async (res) => {
    console.log("success:", res);
    let token = res?.accessToken;
    // "http://127.0.0.1:8000/api/signup",
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
    // let username = res.profileObj.givenName +'_'+ res.profileObj.familyName;
    // let email = res.profileObj.email;
    // let password = res.profileObj.givenName + "@12345";
    // let data = {
    //   username,
    //   email,
    //   password,
    // };
    // let register = await registerCall(data);
    // if (register) {
    //   if (register.failed) {
    //     for (let err of register.result) {
    //       addToast("failed registration : " + err, {
    //         appearance: "error",
    //         autoDismiss: true,
    //       });
    //     }
    //   } else {
    //     addToast("Registered Now Check your email", {
    //       appearance: "success",
    //       autoDismiss: true,
    //     });
    //     let resp = await get_token(username, password, true);
    //     let obj = { ...User };
    //     obj.logged = true;
    //     obj.username = resp.username;
    //     obj.joined = resp.joined;
    //     obj.isA = resp.s;
    //     obj.path = resp.path;
    //     obj.emal = resp.email;
    //     obj.depositID = resp.deposit_id;
    //     setUser(obj);
    //     Router.push("/app/profile");
    //   }
    // } else {
    //   console.log(resp);
    //   addToast("failed register", {
    //     appearance: "error",
    //     autoDismiss: true,
    //   });
    // }
  };
  const onFailure = (err) => {
    console.log("failed:", err);
  };

  useEffect(() => {
    if (User.logged) {
      Router.push("/app/profile");
    } else {
      async function checkUser() {
        let resp = await isLogged();
        if (resp) {
          let obj = { ...User };
          obj.logged = true;
          obj.username = resp.username;
          obj.joined = resp.joined;
          obj.isA = resp.hasAdminAcess;
          obj.isSuper = resp.isSuperUser;
          obj.path = resp.path;
          obj.emal = resp.email;
          obj.depositID = resp.deposit_id;
          setUser(obj);
        }
      }

      checkUser().then(() => {
        console.log("done check");
        setLoading(false);
      });
    }
  }, [User]);

  const registerMethod = async (e) => {
    e.preventDefault();
    setRegistering(true);
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let data = {
      username,
      email,
      password,
    };

    let resp = await registerCall(data);
    console.log("resp response: ", resp);
    if (resp) {
      if (resp.failed) {
        for (let err of resp.result) {
          addToast("failed registration : " + err, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } else {
        addToast("Registered Now Check your email", {
          appearance: "success",
          autoDismiss: true,
        });
        let resp = await get_token(username, password, true);
        let obj = { ...User };
        obj.logged = true;
        obj.username = resp.username;
        obj.joined = resp.joined;
        obj.isA = resp.hasAdminAcess;
        obj.isSuper = resp.isSuperUser;
        obj.path = resp.path;
        obj.emal = resp.email;
        obj.depositID = resp.deposit_id;
        setUser(obj);
        Router.push("/app/profile");
      }
    } else {
      console.log(resp);
      addToast("failed register", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    setRegistering(false);
  };

  function handleChecked(v, nv) {
    setChecked(nv);
  }

  const html = (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no"
        />
        <link rel="shortcut icon" href="/assets/images/LIQD_logo_Square.png" />

        <title>Register</title>
      </Head>

      <div
        id="liqd-platform"
        className="application"
        style={{ filter: "blur(2px)", overflow: "hidden" }}
      >
        <header id="Header">
          <section>
            <aside>
              <Link className="m-t-5" href="/" passHref>
                <img
                  alt="Liqd"
                  width={50}
                  src="/assets/images/LIQD_logo_Square.png"
                />
              </Link>
            </aside>
            <nav />
            <aside>
              <a className="button" href="/register">
                New Account
              </a>
              <Link className="button" href="/" passHref>
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
        <div className="Modal my-5 py-3 FormRegister" style={{ width: 500 }}>
          {!registering && (
            <>
              <main>
                <h4>New Account</h4>
                <form id="register-form" className="mt-l">
                  <div className="center p-s bg-grey-50 radius-m">
                    <span className="tc-grey-600 fw-n">
                      Please make sure you are visiting{" "}
                    </span>
                    <div className="mt-xs2">
                      <span className="tc-mint-500 fw-n">
                         <i className="fas fa-lock">&nbsp;</i>https://
                      </span>
                      <span className="fw-n tc-grey-900">www.liqd.fi</span>
                    </div>
                  </div>
                  <label className="mt-l">Username</label>
                  <div className="TextBox">
                    <input type="text" id="username" />
                  </div>
                  <label className="mt-l">Email</label>
                  <div className="TextBox">
                    <input type="email" id="email" />
                  </div>
                  <label className="mt-xl">Password</label>
                  <div className="TextBox">
                    <input type="password" id="password" />
                  </div>
                  <div className="flex items-center justify-center mt-m">
                    <Checkbox checked={checked} onChange={handleChecked} />
                    <div className="w-6/6">
                      I hereby confirm that I have read and agree to the{" "}
                      <a href="/terms-and-conditions" target="_blank">
                        Terms &amp; Conditions
                      </a>
                      ,
                      <a href="/wallet-terms" target="_blank">
                        Wallet Terms
                      </a>
                      ,{" "}
                      <a href="/earn-terms" target="_blank">
                        Earn Terms
                      </a>
                      ,
                      <a href="/exchange-terms" target="_blank">
                        Exchange Terms
                      </a>
                      , and{" "}
                      <a href="/privacy-policy" target="_blank">
                        Privacy Policy
                      </a>{" "}
                      of liqid
                    </div>
                  </div>
                  <div className="flex mt-xl">
                    <button
                      onClick={
                        checked
                          ? registerMethod
                          : (e) => {
                              e.preventDefault();
                              addToast("Please Accept Terms", {
                                appearance: "info",
                                autoDismiss: true,
                              });
                            }
                      }
                      className={
                        "Button large block " +
                        (checked ? "primary" : "secondary")
                      }
                    >
                      Create Account
                    </button>
                  </div>
                </form>
                <div className="flex center mt-l login_wrapper">
                  <GoogleLogin
                    clientId={clientId}
                    buttonText="Sign up with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    isSignedIn={true}
                  />
                  {/* <div className="facebook_login_wrapper">
                    <FacebookLogin
                      appId={appId}
                      autoLoad={true}
                      fields="name,email,picture"
                      className="kep-login-facebook facebook_login"
                      onSuccess={onSuccess}
                      onFail={onFailure}
                      onProfileSuccess={(response) => {
                        console.log("facebook profile response ", response);
                      }}
                      // icon="fa-facebook"
                      textButton="Sign up with Facebook"
                    />
                  </div> */}
                </div>
                <div className="flex center links mt-l">
                  <span>Already have a liqid Account?</span>
                  <i className="mh-xs">•</i>{" "}
                  <Link href="/app/login" passHref>
                    <a>Login</a>
                  </Link>
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
            </>
          )}

          {registering && (
            <>
              <main className="grid place-items-center">
                <h4>Registration</h4>
                <p className="text-xl">Please Wait ...</p>
                <div className="w-full h-[150px] grid place-items-center">
                  <SimpleLoader />
                </div>
              </main>
            </>
          )}
        </div>
      </div>

      <Script
        src="https://kit.fontawesome.com/d53d06f463.js"
        strategy="beforeInteractive"
      />
    </Fragment>
  );

  return loading ? <Loader setLoading={setLoading} register={true} /> : html;
}
