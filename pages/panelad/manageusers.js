import React, { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ImageViewer from "react-simple-image-viewer";
import { postReq, req } from "../../Utils";
import { useToasts } from "react-toast-notifications";
import Footer from "../../components/Footer";
import Router from "next/router";
import { refreshToken } from "../../Utils";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

export default function ManageUsers(props) {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToasts();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [stats, setStats] = useState({
    all_c: 0,
    a_c: 0,
    n_c: 0,
  });

  const [data, setData] = useState([]);

  const [filtered, setFiltered] = useState(data);

  async function refreshData() {
    let resp = await req("stats");
    if (resp) {
      console.log("resp", resp);
      setStats(resp.stats);
      setData(resp.tickets);
      setFiltered(resp.tickets);
    } else {
      console.log("failed");
    }
  }

  async function handleReject() {
    setOpenModal(false);
    let reason = document.getElementById("reason").value;
    await approve(false, selectedTarget, reason);
  }

  async function approve(dec, i, msg) {
    let opt = filtered[i];
    let body = {
      user_id: opt.id,
      ticket_id: opt.ticket_id,
      approved: dec,
      reason: msg,
    };
    let resp = await postReq("approve", body);
    if (resp) {
      if (dec) {
        addToast("User " + opt.username + " approved", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("User " + opt.username + " rejected", {
          appearance: "success",
          autoDismiss: true,
        });
      }
      refreshData();
    } else {
      addToast("failed", {
        appearance: "error",
        autoDismiss: true,
      });
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

  async function viewDocs(i) {
    let access = sessionStorage.getItem("accessToken");
    console.log(access);
    let opt = filtered[i];
    console.log("opt", opt);
    let body = {
      email : opt.email
      // email: "trishna@eiysys.com",
    };
    setImages(opt.docs);
    let resp = await fetch(
      "https://api.liqd.flexsin.org/api/getcleardildocuments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access,
        },
        body: JSON.stringify(body),
      }
    );
    let resp_json = await resp.json();
    console.log("res", resp_json);
    if (resp_json.success) {
      const dataFront = {
        filename: resp_json.data.document_back.filename,
        content: resp_json.data.document_back.content
      }
      const dataBack = {
        filename: resp_json.data.document_front.filename,
        content: resp_json.data.document_front.content
      }
      if(dataFront.content && dataBack.content){
      let img = `data:image/${dataFront.filename.split(".")[1]};base64,${dataFront.content}`;
      let img2 = `data:image/${dataBack.filename.split(".")[1]};base64,${dataBack.content}`;
      let imagesRes = [img, img2];
      setImages(imagesRes);
      setIsOpen(true);
      }
      setIsOpen(true);
    } else if (resp_json.code === "token_not_valid") {
      let dec = await refreshToken();
      console.log("dec", dec);
      if (dec) {
        return viewDocs(i);
      } else {
        return false;
      }
    } else {
      addToast("failed", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  console.log("Images", images);

 

  function showDetails(id) {
    Router.push("/panelad/userdetails/" + id);
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

        <title>Admin | Registered Users</title>
      </Head>

      <div id="liqd-platform" className="application">
        <Header admin={true} location="manageusers" />
        <main>
          <section className="DashboardPage">
            <div className="verify_page">
              <div className="AccountFinancialOverview">
                <div>
                  <i className="fa fa-question-circle" />
                  <h6>Registered Users</h6>
                  <div />
                  <span>{stats.all_c}</span>
                </div>
                {/* <div>
            <i className="fa fa-question-circle" />
            <h6>Active Users</h6>
            <span className="tc-indigo-500">300</span>
            <div />
            <h6>Inactive Users</h6>
            <span className="tc-blue-500">200</span>
          </div> */}
                <div>
                  <i className="fa fa-question-circle" />
                  <h6>Approved Users</h6>
                  <span className="tc-indigo-500">{stats.a_c}</span>
                  <div />
                  <h6>Unapproved Users</h6>
                  <span className="tc-blue-500">{stats.n_c}</span>
                </div>
              </div>
              <div className="card verification_ticket">
                <div className="w-full flex items-center justify-between">
                  <h3>Verification Tickets</h3>
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
                      <th align="left">Matched</th>
                      <th align="left">Score</th>

                      <th colSpan={3} align="left" />
                      <th></th>
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
                            <span className="tc-red">
                              {e.matched ? "Matched" : "Not Matched"}
                            </span>
                          </td>
                          <td align="left">
                            <span className="tc-red">{e.score}</span>
                          </td>

                          <td style={{ paddingRight: 0 }}>
                            <a>
                              <button
                                type="button"
                                className="Button primary block"
                                onClick={() => viewDocs(i)}
                              >
                                {" "}
                                View Documents{" "}
                              </button>
                            </a>
                          </td>
                          <td align="left" width={110}>
                            <a>
                              <button
                                type="button"
                                onClick={() => approve(true, i, "")}
                                className="Button primary block"
                              >
                                {" "}
                                Approve{" "}
                              </button>
                            </a>
                          </td>
                          <td align="left" width={110}>
                            <a>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTarget(i);
                                  setOpenModal(true);
                                }}
                                className="Button secondary block"
                              >
                                {" "}
                                Reject{" "}
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
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <label className="mt-l" style={{ margin: 10 }}>
            Reason
          </label>
          <div className="TextBox m-4" style={{ margin: 10 }}>
            <input type="text" id="reason" placeholder="Rejection Reason" />
          </div>
          <button
            type="button"
            onClick={handleReject}
            className="Button primary block"
          >
            {" "}
            Reject{" "}
          </button>
        </Box>
      </Modal>
    </Fragment>
  );

  return loading ? <Loader admin={true} setLoading={setLoading} /> : html;
}
