import Head from "next/head";
import { Fragment, useContext, useState, useEffect } from "react";
import Script from "next/script";
import Header from "../../components/Header";
import BalancesCards from "../../components/BalancesCards";
import IdentityVerification from "../../components/IdentityVerification";
import ProfileNavigation from "../../components/ProfileNavigation";
import CoinList from "../../components/CoinList";
import Footer from "../../components/Footer";
import Link from "next/link";
import { UserContext } from "../../contexts/UserContext";
import Router from "next/router";
import Loader from "../../components/Loader";
import { req } from "../../Utils";
import SimpleLoader from "../../components/SimpleLoader";

export default function Profile() {
  const [User, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [balanceLoader, setBalanceLoader] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState({
    status: null,
    path: null,
    verified: null,
  });

  async function fetchVerificationStatus() {
    let resp = await req("verify");
    if (resp) {
      // console.log(resp);
      setVerificationStatus(resp);
    } else {
      console.log("fetching verification failed");
    }
  }

  useEffect(() => {
    fetchVerificationStatus().then(() => {
      console.log("done fetching data");
    });
  }, []);

  const thankyou = (e) => {
    e.preventDefault();
    Router.push('/app/thankyou');
  }
  const html = (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no"/>
        <link rel="manifest" href="/assets/meta/manifest.json" />
        <link rel="shortcut icon" href="/assets/images/LIQD_logo_Square.png" />

        <title>Profile</title>
      </Head>
      <div id="liqid-platform" className="application">
        <Header location="profile" />
        <main>
          <section className="DashboardPage">
            <div>
              <div className="liqidBenefits empty" />
              <div className="banners">
                <Link href="/app/exchange">
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
                </Link>
                <a> 
                  <div
                    className="Banner earnUpTo10PercentsOAssets"
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

              <BalancesCards />
              {!verificationStatus.verified && (
                <IdentityVerification
                  verificationStatus={verificationStatus}
                  customText={
                    verificationStatus.hasInfo
                      ? "Complete your Verification by uploading your documents"
                      : false
                  }
                  customTitle={
                    verificationStatus.hasInfo ? "Upload Documents" : false
                  }
                />
              )}

              <div className="card">
                {!balanceLoader && (
                  <Fragment>
                    <ProfileNavigation />
                  </Fragment>
                )}
                {balanceLoader && (
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                    className="items-center justify-center h-[400px]"
                  >
                    <h3>Loading Balances ... </h3>
                    <br></br>
                    <SimpleLoader />
                  </div>
                )}

                <CoinList
                  setBalanceLoader={setBalanceLoader}
                  balanceLoader={balanceLoader}
                  verified={verificationStatus.verified}
                />
              </div>
              <div className="SocialShare standalone card">
                <h6 className="fs-18 m-b-15">
                  Share With Your Friends &amp; Family:
                </h6>
                <div className="grid-buttons">
                  <div className="col">
                    <a
                      className="sharing-button-facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                      href
                    >
                      <img alt width={20} src="/assets/icons/facebook.svg" />
                      <span className="sharing-button-text">Share</span>
                    </a>
                  </div>
                  <div className="col">
                    <a
                      className="sharing-button-twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                      href
                    >
                      <img alt width={20} src="/assets/icons/twitter.svg" />
                      <span className="sharing-button-text">Tweet</span>
                    </a>
                  </div>
                  <div className="col">
                    <a
                      className="sharing-button-linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      href
                    >
                      <img alt width={20} src="/assets/icons/linkedin.svg" />
                      <span className="sharing-button-text">Post</span>
                    </a>
                  </div>
                  <div className="col">
                    <div className="copy-btn">
                      <textarea
                        readOnly
                        style={{
                          position: "fixed",
                          width: 0,
                          height: 0,
                          opacity: 0,
                        }}
                        defaultValue={""}
                      />
                      <a
                        className="sharing-button-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href
                      >
                        <img alt width={20} src="/assets/icons/link.svg" />
                        <span className="sharing-button-text">Copy URL</span>
                      </a>
                      <i className="fa fa-check" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </Fragment>
  );

  return loading ? <Loader setLoading={setLoading} /> : html;
}
