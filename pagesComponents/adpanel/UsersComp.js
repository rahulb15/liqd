import React, { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import Loader from "../../components/Loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ImageViewer from "react-simple-image-viewer";
import { handleResp, postReq, req, numberToBN } from "../../Utils";
import { useToasts } from "react-toast-notifications";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Router from "next/router";

import Switch from "@mui/material/Switch";
import Image from "next/image";
import { fiats } from "../../Utils/constants";
import { ethers } from "ethers";

import styles from "../../styles/modular/AdminUser.module.css";

export default function UsersComp(props) {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { addToast } = useToasts();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBalance, setSelectedBalance] = useState(null);
  const [openBalance, setOpenBalance] = useState(false);

  const [data, setData] = useState([]);

  const [filtered, setFiltered] = useState(data);

  async function refreshData() {
    let resp = await req("getadminusers");
    if (resp) {
      console.log(resp);
      setData(resp);
      setFiltered(resp);
    } else {
      console.log("failed");
    }
  }

  useEffect(() => {
    refreshData().then(() => {
      console.log("done fetching");
    });
  }, []);

  const defaultProps = {
    options: data,
    getOptionLabel: (option) => option.username,
  };

  const style = {
    width: 200,
  };

  function handleFilter(option, newValue) {
    console.log(newValue);
    let option_fil;
    if (newValue) {
      option_fil = data.filter((e) => e == newValue);
    } else {
      option_fil = [];
    }

    if (option_fil.length == 0) {
      setFiltered(data);
    } else {
      setFiltered(option_fil);
    }
  }

  function viewDocs(i) {
    setOpenModal(false);
    console.log(i);
    setImages(selectedUser[i]);
    setIsOpen(true);
  }

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "1px solid #000",
    boxShadow: 24,
    borderRadius: 5,
    p: 4,
  };

  const balanceStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(100%,1000px)",
    minHeight: "300px",
    bgcolor: "background.paper",
    borderRadius: 8,
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
  };

  function handleModal(i) {
    setSelectedUser(filtered[i]);
    console.log("filtered",filtered[i]);
    setOpenModal(true);
  }

  function handleClose() {
    setOpenModal(false);
    setSelectedTicket(null);
  }

  async function approve(status, index) {
    let selected = filtered[index];
    selected["status"] = status;
    let amount = 0;
    if (status) {
      amount = Number(document.getElementById("balance").value);
    }

    selected["amount"] = amount;
    console.log(selected);
    handleClose();
    let resp = await postReq("balanceApprove", selected);
    if (resp) {
      addToast(resp.reason, {
        appearance: "success",
        autoDismiss: true,
      });
      await refreshData();
    } else {
      addToast("Failed", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  function showDetails(id) {
    Router.push("/panelad/userdetails/" + id);
  }

  async function updateStatus(user, action, status) {
    let body = {
      user,
      action,
      status,
    };

    let resp = await postReq("enabler", body);
    handleResp(resp, addToast);
  }

  function showBalance(u) {
    setSelectedBalance(u);
    setOpenBalance(true);
  }

  function formatAmount(amount, decimals, symbol) {
    let decimal;
    console.log("formating ....");
    let balance;
    if (fiats.includes(symbol)) {
      decimal = 4;
      balance = Number(amount) * 10 ** decimal;
    } else {
      decimal = decimals;
      balance = Number(amount);
    }
    console.log(balance);
    console.log(symbol);
    console.log(amount);

    return ethers.utils.formatUnits(
      numberToBN(balance, decimal).toString(),
      decimal
    );
  }
  // const img = [
  //   "https://www.allbusiness.com/asset/image/Bizarre_Business_Blog/4968963.JPG",
  //   "https://templates.invoicehome.com/receipt-template-us-mono-black-750px.png"
  // ];

  console.log("images", images);

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

        <title>Admin | Users</title>
      </Head>

      <div id="liqd-platform" className="application">
        <Header admin={true} location="users" />

        <main className="admin_dashboard">
          <section className="DashboardPage">
            <div>
              <div className="card">
                <div className="w-full flex items-center justify-between">
                  <h3>Users</h3>
                  <Autocomplete
                    {...defaultProps}
                    sx={style}
                    id="clear-on-escape"
                    onChange={handleFilter}
                    clearOnEscape
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter By Username"
                        variant="standard"
                      />
                    )}
                  />
                </div>
                <div className="table-responsive">
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
                          Username
                        </th>
                        <th align="left" width={200}>
                          Email
                        </th>
                        <th align="left" width={200}>
                          Personal Information Status
                        </th>
                        <th align="left" width={200}>
                          Identity Status
                        </th>
                        <th align="left" width={100}>
                          Enable Login
                        </th>
                        <th align="left" width={100}>
                          Enable Withdraw
                        </th>

                        <th colSpan={3} align="left" />

                        <th colSpan={3} align="left" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((e, i) => {
                        return (
                          <tr key={i}>
                            <td align="left">
                              <span className="AssetVisual">
                                <strong>{e.username}</strong>
                              </span>
                            </td>
                            <td align="left">
                              <span className="AssetBalance right semi-bold">
                                {e.email}
                              </span>
                            </td>
                            <td align="left">
                              <span className="AssetBalance right semi-bold">
                                {e.has_personalInfo
                                  ? "Submitted"
                                  : "Not Submitted"}
                              </span>
                            </td>
                            <td align="left">
                              <span className="AssetBalance right semi-bold">
                                {e.is_validated ? "Approved" : "Not Approved"}
                              </span>
                            </td>

                            <td>
                              <Switch
                                onChange={(v, newv) =>
                                  updateStatus(e.id, "deposit", newv)
                                }
                                defaultChecked={e.enable_login}
                              />
                            </td>
                            <td>
                              <Switch
                                onChange={(v, newv) =>
                                  updateStatus(e.id, "withdraw", newv)
                                }
                                defaultChecked={e.enable_withdraw}
                              />
                            </td>
                            <td align="left" width={110}>
                              <a>
                                <button
                                  type="button"
                                  onClick={() => showBalance(e)}
                                  className="Button primary block"
                                >
                                  {" "}
                                  View Balance{" "}
                                </button>
                              </a>
                            </td>

                            <td align="left" width={110}>
                              <a>
                                <button
                                  type="button"
                                  onClick={() => handleModal(i)}
                                  className="Button primary block"
                                >
                                  {" "}
                                  View Submitted Docs{" "}
                                </button>
                              </a>
                            </td>

                            <td align="left" width={110}>
                              <a>
                                <button
                                  type="button"
                                  onClick={() => showDetails(e.id)}
                                  className="Button primary block"
                                >
                                  {" "}
                                  Details{" "}
                                </button>
                              </a>
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

      {isOpen && (
        <ImageViewer
          src={images}
          currentIndex={currentIndex}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={() => setIsOpen(false)}
        />
      )}

      <Modal
        open={openBalance}
        onClose={() => setOpenBalance(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="custom_modal_lg">
          <h2 className="text-center">Balance Details</h2>
          <div className="f-col my-5">
            {selectedBalance && (
              <Fragment>
                <table
                  className={"AssetList " + styles.left}
                  id="AssetList"
                  cellSpacing={0}
                  cellPadding={0}
                  border={0}
                >
                  <thead>
                    <tr>
                      <th width={100}></th>
                      <th align="left" width={100}>
                        Coin
                      </th>
                      <th align="left" width={200}>
                        Spend Balance
                      </th>
                      <th align="left" width={200}>
                        Earn Balance
                      </th>
                      <th align="left" width={200}>
                        Deposit Address / Deposit Note
                      </th>

                      <th colSpan={3} align="left" />
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBalance.balances.map((e, i) => {
                      return (
                        <tr key={i}>
                          <td align="left">
                            <span className="AssetVisual">
                              <Image src={e.image} height={32} width={32} />
                            </span>
                          </td>
                          <td align="left">
                            <span className="AssetBalance right semi-bold">
                              {e.symbol}
                            </span>
                          </td>
                          <td align="left">
                            <span className="AssetBalance right semi-bold">
                              {formatAmount(e.balance, e.decimals, e.symbol)}
                            </span>
                          </td>
                          <td align="left">
                            <span className="AssetBalance right semi-bold">
                              {formatAmount(e.earn, e.decimals, e.symbol)}
                            </span>
                          </td>
                          <td align="left">
                            <span className="AssetBalance right semi-bold">
                              {e.add}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Fragment>
            )}
          </div>
        </Box>
      </Modal>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="custom_modal_lg">
          <h2 className="text-center">Documents Manager</h2>
          <div className="f-col my-5">
            {selectedUser && (
              <Fragment>
                {selectedUser.auth_docs.length > 0 ? (
                  <button
                    className="Button primary block"
                    onClick={() => viewDocs("auth_docs")}
                  >
                    View Identification Docs
                  </button>
                ) : (
                  <h4 className="my-5">No Identity Documents Submitted</h4>
                )}
                {selectedUser.receipts.length > 0 ? (
                  <button
                    className="Button primary block"
                    onClick={() => viewDocs("receipts")}
                  >
                    View Deposit Receipts
                  </button>
                ) : (
                  <h4 className="my-5">No Receipt Documents Submitted</h4>
                )}
              </Fragment>
            )}
          </div>
        </Box>
      </Modal>
    </Fragment>
  );

  return loading ? <Loader admin={true} setLoading={setLoading} /> : html;
}
