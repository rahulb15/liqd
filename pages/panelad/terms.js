import React, { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ImageViewer from "react-simple-image-viewer";
import { handleResp, postReq, req } from "../../Utils";
import { useToasts } from "react-toast-notifications";
import Footer from "../../components/Footer";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Switch } from "@mui/material";
import axios from "axios";

export default function Terms(props) {
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [terms, setTerms] = useState([]);
  const { addToast } = useToasts();
  const [switchState, setSwitchState] = useState({
    checkedA: true,
    checkedB: false,
  });

  const handleSwitch = (event) => {
    // expireTerm();
    setSwitchState({
      ...switchState,
      [event.target.name]: event.target.checked,
    });
  };

  async function refreshData() {
    let resp = await req("enablercoin");
    let terms = await req("terms");
    if (resp) {
      // console.log(resp);
      setData(resp);
      setTerms(terms.data);
      console.log("resp response", resp);
    } else {
      console.log("failed");
    }
  }

  useEffect(() => {
    refreshData().then(() => {
      console.log("done fetching");
    });
  }, []);

  function handleClose() {
    setOpenModal(false);
    setSelectedCoin(null);
  }

  async function addTerm() {
    let coin = data[selectedCoin - 1].id;
    let term = Number(document.getElementById("noticePeriod").value);
    let interest = Number(document.getElementById("interestRate").value);

    let body = {};
    body["coin_id"] = coin;
    body["notice_period"] = term;
    body["interest"] = interest / 100;
    console.log(body);
    setOpenModal(false);
    let resp = await postReq("addterm", body);
    console.log("resp add term ", resp);
    refreshData();
    if (resp) {
      addToast("Term Added", {
        autoDismiss: true,
        appearance: "success",
      });
    } else {
      addToast("Failed Adding Term", {
        autoDismiss: true,
        appearance: "error",
      });
    }
  }

  const expireTerm = async (e) => {
    // console.log(e.target.id);
    let body = {};
    body['term_id'] = e.target.id;
    body['set_expire'] = e.target.checked
    console.log(body);
    let resp = await axios.put("https://api.liqd.flexsin.org/api/expireterm", body);
    console.log(resp);
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
        <title>Admin | Terms</title>
      </Head>

      <div id="liqd-platform" className="application">
        <Header admin={true} location="terms" />

        <main>
          <section className="DashboardPage">
            <div className="terms_page_admin">
              <div className="card">
                <div className="w-full flex items-center justify-between">
                  <h3>Terms</h3>
                  <button
                    className="Button primary"
                    onClick={(e) => setOpenModal(true)}
                  >
                    Create Term
                  </button>
                </div>
                <div className="table-responsive">
                  <table
                    className="AssetList"
                    id="TermList"
                    cellSpacing={0}
                    cellPadding={0}
                    border={0}
                  >
                    <thead>
                      <tr>
                        <th align="left" width={200}>
                          Coin
                        </th>
                        <th align="left" width={200}>
                          Notice Period
                        </th>
                        <th align="left" width={200}>
                          Interest
                        </th>
                        <th align="left" width={200}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
                        <td>USD</td>
                        <td>2 Months</td>
                        <td>9%</td>
                        <td>
                          <Switch
                            checked={switchState.checkedB}
                            onChange={handleSwitch}
                            color="primary"
                            name="checkedB"
                            inputProps={{
                              "aria-label": "primary checkbox",
                            }}
                          />
                          <label for="expireTerm">Expire</label>
                        </td>
                      </tr> */}
                      {terms &&
                        terms.map((term) => {
                          return (
                            <tr>
                              <td className="hidden">{term?.id}</td>
                              <td>
                                <img
                                  src={data
                                    .filter(
                                      (e) => e.symbol == term?.coin?.symbol
                                    )
                                    .map((coin) => coin.image)}
                                />{" "}
                                {term?.coin?.symbol}
                              </td>
                              <td>{term?.notice_period}</td>
                              <td>{term?.interest}</td>
                              <td>
                                <Switch
                                  checked={term?.expired}
                                  onChange={expireTerm}
                                  color="primary"
                                  name="checkedB"
                                  inputProps={{
                                    "aria-label": "primary checkbox",
                                  }}
                                  id={term.id}
                                />
                                <label for="expireTerm">Expire</label>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </div>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="custom_modal_lg">
          <h2 className="text-center">Add New Term</h2>
          <Fragment>
            <label className="mt-l">Coin</label>
            <div className="m-4">
              <select
                id="selectCoin"
                onChange={(e) => {
                  setSelectedCoin(e.target.selectedIndex);
                  // console.log(e.target.selectedIndex);
                }}
                className="form-select"
              >
                <option value={-1}>All Assets</option>
                {data.map((key, i) => {
                  return (
                    <option key={i} value={key?.symbol}>
                      {key?.symbol}
                    </option>
                  );
                })}
              </select>
            </div>
            <label className="mt-l">Notice Period</label>
            <div className="TextBox m-4">
              <input
                type="number"
                step="1"
                id="noticePeriod"
                placeholder="Notice Period (in months)"
              />
            </div>
            <label className="mt-l">Interest Rate</label>
            <div className="TextBox m-4">
              <input
                type="number"
                step=".1"
                id="interestRate"
                defaultValue={
                  selectedCoin ? data[selectedCoin - 1]?.interest * 100 : ""
                }
                placeholder="Interest (in percentage)"
              />
              {console.log(data[selectedCoin - 1])}
            </div>

            <div className="my-5 mx-4">
              <button
                type="button"
                onClick={() => addTerm()}
                className="Button primary block my-4 "
              >
                {" "}
                Add{" "}
              </button>
            </div>
          </Fragment>
        </Box>
      </Modal>
    </Fragment>
  );

  return loading ? <Loader admin={true} setLoading={setLoading} /> : html;
}
