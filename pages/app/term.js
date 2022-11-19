import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Head from "next/head";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { ActiveTerms } from "../../components/Terms/ActiveTerms";
import { postReq, req } from "../../Utils";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { Input, InputAdornment, InputLabel } from "@material-ui/core";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Radio } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function term() {
  const [User, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState([]);
  const [coins, setCoins] = useState([]);
  const [value, setValue] = useState(0);
  const router = useRouter();
  const routerData = router.query;
  const [selectedCoin, setSelectedCoin] = useState(routerData.coin);
  const { addToast } = useToasts();
  console.log("router data", routerData);
  const validationSchema = Yup.object().shape({
    notice: Yup.string().required("Notice period is required"),
    amount: Yup.string().required("Amount is required"),
  });

  const initialValues = {
    notice: "",
    amount: routerData.amount,
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const refreshData = async () => {
    let id = routerData.coin_id;
    id = window.btoa(id);
    id = encodeURIComponent(id);
    console.log("id ", id);
    // let coin = await req("enablercoin");
    let resp = await req(`terms?coin=${id}`);

    console.log("terms for coin ", resp);
    if (resp) {
      // setCoins(coin);
      setTerms(resp.data);
    }
  };

  useEffect(() => {
    refreshData();
  }, [routerData]);
  const getAvailableTerms = async (e) => {
    setSelectedCoin(e?.target?.value);
  };

  const createTerm = async (data) => {
    // e.preventDefault();
    console.log(data);
    let notice = data.notice;
    let amount = data.amount;
    let coin_id = routerData.coin_id;
    let user_id = User.id;
    // if (document.getElementById("auto_renew").checked == true) {
    //   auto_renew = true;
    // }
    let body = {
      notice,
      amount,
      coin_id,
      user_id,
    };
    let resp = await postReq("createterm", body);
    if (resp) {
      addToast("Modified", {
        autoDismiss: true,
        appearance: "success",
      });
    } else {
      addToast("Failed", {
        autoDismiss: true,
        appearance: "error",
      });
    }
  };
  const handleBack = (e) => {
    e.preventDefault();
    Router.push("/app/profile");
  };

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
        <link rel="stylesheet" href="/assets/css/terms.css" />
        <title>Terms</title>
      </Head>
      <div id="liqid-platform" className="application">
        <Header location="profile" />
        <main>
          <div className="left m-4 mb-0">
            <button onClick={handleBack}>
              <ArrowCircleLeftIcon /> Go Back
            </button>
          </div>
          <section className="DashboardPage">
            <div className="terms_wrapper">
              <div className="terms_page">
                <div>
                  <div className="heading">
                    {/* <img src="/assets/images/checkmark.svg" /> */}
                    {/* <SavingsIcon /> */}
                    <Image
                      src={routerData.image}
                      height={50}
                      width={50}
                      alt={routerData.coin}
                    />
                    <h3>{routerData.coin} Fixed Terms</h3>
                  </div>
                </div>
                <div>
                  <Tabs value={value} onChange={handleChange}>
                    <Tab label="Active Terms" {...a11yProps(0)} />
                    {/* <Tab label="Previous Terms" {...a11yProps(1)} /> */}
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <ActiveTerms coin={routerData.coin} />
                  </TabPanel>
                  {/* <TabPanel value={value} index={1}>
                    <ActiveTerms coin={routerData.coin} />
                  </TabPanel> */}
                </div>
              </div>
              <div className="new_term">
                <div className="card">
                  <h3>Create Fixed Term</h3>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(data) => createTerm(data)}
                  >
                    {(formik) => {
                      const {
                        values,
                        errors,
                        touched,
                        isValid,
                        dirty,
                        isSubmitting,
                        setFieldValue,
                        handleChange,
                      } = formik;
                      return (
                        <Form>
                          <div className="form_field d-none"></div>
                          <div className="form_field">
                            <span id="notice">Notice Period</span>
                            <div
                              role="group"
                              aria-labelledby="notice"
                              className={` single_term flex`}
                            >
                              {terms &&
                                terms.map((term) => {
                                  return (
                                    <div className="card inner_field w-1/3 me-1">
                                      <label className="flex justify-content-center">
                                        <Field
                                          type="radio"
                                          name="notice"
                                          value={`${term?.notice_period}`}
                                          key={term?.notice_period}
                                        />
                                        <div>
                                        {term?.notice_period} Months
                                        <small
                                          className="block"
                                          style={{ color: "#666" }}
                                          >
                                          {term?.interest * 100}% Interest
                                        </small></div>
                                      </label>
                                    </div>
                                  );
                                })}
                            </div>
                            {/* <Field
                              type="hidden"
                              name="noticePeriod"
                              value={values.notice}
                              className={` ${
                                touched.noticePeriod && errors.noticePeriod
                                  ? "input-error"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name="noticePeriod"
                              component="span"
                              className="error"
                            /> */}
                          </div>
                          <div className="form_field flex column align-items-start">
                            <label for="amount">Amount</label>
                            <Field
                              id="amount"
                              name="amount"
                              type="number"
                              min={100}
                              className={`${
                                touched.amount && errors.amount
                                  ? "input-error"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name="amount"
                              component="span"
                              className="error"
                            />
                            {/* <input
                        type={"text"}
                        placeholder={routerData.coin + " 0.00"}
                        // id="amount"
                        // value={routerData.coin + " " + routerData.amount}
                      /> */}
                          </div>

                          {/* <div className="form_field">
                      <input type={"checkbox"} id="auto_renew" />
                      <label for="auto_renew">Automatic Renewal</label>
                    </div> */}
                          <div className="form_field">
                            <button
                              className={`Button primary${
                                !(dirty && isValid) ? "disabled-btn" : ""
                              }`}
                              disabled={!(dirty && isValid)}
                              type="submit"
                            >
                              Create Term
                            </button>
                          </div>
                          <div className="disclaimer p-1 center">
                            <small>
                              Neque porro quisquam est qui dolorem ipsum quia
                              dolor sit amet, consectetur, adipisci velit Neque
                              porro quisquam est qui dolorem ipsum quia dolor
                              sit amet.
                            </small>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
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
