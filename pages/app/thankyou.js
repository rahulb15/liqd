import e from "cors";
import Head from "next/head";
import React, { Fragment } from "react";
import { useRouter } from "next/router";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
export default function Thankyou() {
  const router = useRouter();
  const status = router?.query?.status;
  
  const html = (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no"
        />
        <link rel="manifest" href="/assets/meta/manifest.json" />
        <link rel="shortcut icon" href="/assets/images/LIQD_logo_Square.png" />
        <title>Thankyou</title>
      </Head>
      <div id="liqid-platform" className="application">
        <Header location="thankyou" />
        <main>
          <section className="DashboardPage">
            <div className="thankyou_page bg-light mt-5 center p-4">
              {status == "settled" ? (
                <>
                  <CheckCircleOutlineIcon
                    style={{ fontSize: 100, color: "green" }}
                  />
                  <h1 className="heading p-4" style={{ color: "green" }}>
                    SUCCESS
                  </h1>
                  <p className="p-4">
                    Congratulations your deposit payment has been received
                    successfully and your balance has been updated.
                    <br /> Please continue to your dashboard.
                  </p>
                </>
              ) : status == "failed" ? (
                <>
                  <i
                    class="fa-regular fa-circle-xmark"
                    style={{ fontSize: 100, color: "red" }}
                  ></i>
                  <h1 className="heading p-4" style={{ color: "red" }}>
                    FAILED
                  </h1>
                  <p className="p-4">
                    We were unable to request the payment from your bank
                    successfully, please try again. <br /> If the issue occurs
                    again you could try using a different bank account, or
                    contact us for alternative payment methods.
                  </p>
                </>
              ) : status == "executed" ? (
                <>
                  <CheckCircleOutlineIcon
                    style={{ fontSize: 100, color: "green" }}
                  />
                  <h1 className="heading p-4" style={{ color: "green" }}>
                    EXECUTED
                  </h1>
                  <p className="p-4">
                    Congratulations! The payment has been submitted to your bank
                    successfully. Your bank will process it.
                    <br /> Please continue to your dashboard.
                  </p>
                </>
              ) : (
                <>
                  <i
                    class="fa fa-circle-exclamation"
                    style={{ fontSize: 100, color: "orange" }}
                  ></i>
                  <h1 className="heading p-4" style={{ color: "orange" }}>
                    ERROR
                  </h1>
                  <p className="p-4">
                    We were unable to request the payment from your bank
                    successfully, please try again. <br /> If the issue occurs
                    again you could try using a different bank account, or
                    contact us for alternative payment methods.
                  </p>
                </>
              )}

              <button className="Button" color="success">
                <a href="/app/profile">Dashboard</a>
              </button>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </Fragment>
  );
  return html;
}
