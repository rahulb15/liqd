import React, { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ImageViewer from "react-simple-image-viewer";
import { postReq, req } from "../../Utils";
import { useToasts } from "react-toast-notifications";

export default function ManageUsers(props) {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToasts();
  const [stats, setStats] = useState({
    all_c: 0,
    a_c: 0,
    n_c: 0,
  });

  const [data, setData] = useState([]);
  async function refreshData() {
    let resp = await req("stats");
    if (resp) {
      console.log(resp);
      setStats(resp.stats);
      setData(resp.tickets);
      setFiltered(resp.tickets);
    } else {
      console.log("failed");
    }
  }

  async function approve(dec, i) {
    let opt = filtered[i];
    let body = {
      user_id: opt.id,
      ticket_id: opt.ticket_id,
      approved: dec,
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

  const [filtered, setFiltered] = useState(data);
  const defaultProps = {
    options: data,
    getOptionLabel: (option) => option.username,
  };

  const style = {
    width: 200,
  };

  function handleFilter(option, newValue) {
    console.log(newValue);
    let option_fil = data.filter((e) => e == newValue);
    if (option_fil.length == 0) {
      setFiltered(data);
    } else {
      setFiltered(option_fil);
    }
  }

  function viewDocs(i) {
    setImages(filtered[i].docs);
    setIsOpen(true);
  }

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

        <title>Admin | Manage Users</title>
      </Head>

      <div id="liqd-platform" className="application">
        <Header admin={true} location="manageusers" />
        <main>
          <section className="DashboardPage">
            <div>
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
              <div className="card">
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
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e, i) => {
                      return (
                        <tr>
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
                                onClick={() => approve(true, i)}
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
                                onClick={() => approve(false, i)}
                                className="Button secondary block"
                              >
                                {" "}
                                Reject{" "}
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
          <footer>
            <section>
              <button
                type="button"
                className="Button link LanguagePickerButton m-b-5"
                aria-expanded="false"
              >
                <i className="fa fa-language" /> Language{" "}
              </button>
              <nav>
                {" "}
                ©2022{" "}
                <a href="https://LIQD.io/" target="_blank">
                  LIQD
                </a>
                <i>•</i>
                <a href="https://LIQD.io/loan-terms" target="_blank">
                  Credit Line Terms
                </a>
                <i>•</i>
                <a href="https://LIQD.io/privacy-policy" target="_blank">
                  Privacy Policy
                </a>
                <i>•</i>
                <a href="https://LIQD.io/terms-and-conditions" target="_blank">
                  Terms &amp; Conditions
                </a>
              </nav>
            </section>
          </footer>
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
    </Fragment>
  );
  return loading ? <Loader admin={true} setLoading={setLoading} /> : html;
}