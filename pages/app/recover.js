import Head from "next/head";
import { Fragment, useEffect, useState, useContext } from "react";
import Script from "next/script";
import Link from "next/link";

import { UserContext } from "../../contexts/UserContext";
import { get_token, handleResp, isLogged, postReq } from "../../Utils";
import Loader from "../../components/Loader";
import Router from "next/router";
import { useToasts } from "react-toast-notifications";

export default function Recover(props) {
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const { addToast } = useToasts();

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
            console.log(obj);
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

  async function recoverMethod(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let data = {
      email,
    };

    let resp = await postReq("recovery", data);
    handleResp(resp, addToast);
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

        <title>Password Recovery</title>
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
                    <Link className="ActionButton" href="/exchange" passHref>
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
        <div className="my-5 Modal FormLogin py-3" style={{ width: 500 }}>
          <main>
            <h4>Recover</h4>
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
              <label className="mt-l">Email</label>
              <div className="TextBox">
                <input type="email" id="email" />
              </div>
              <div className="flex mt-xl">
                <button
                  type="submit"
                  onClick={recoverMethod}
                  className="Button large primary block"
                >
                  Recover
                </button>
              </div>
            </form>
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

      <Script
        src="https://kit.fontawesome.com/d53d06f463.js"
        strategy="beforeInteractive"
      />
    </Fragment>
  );

  return loading ? <Loader setLoading={setLoading} recovery={true} /> : html;
}
