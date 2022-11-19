import { Switch } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import { req } from "../../Utils";
import Loader from "../Loader";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import RedeemIcon from "@mui/icons-material/Redeem";

export const ActiveTerms = (props) => {
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState([]);
  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
  });
  const date = new Date();
  const currentDate =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  date = new Date(currentDate);
  const dueDate = new Date("11/30/2022");
  const termRemaining = Math.floor(
    (dueDate.getTime() - date.getTime()) / (1000 * 3600 * 24)
  );
  console.log("termRemaining ", termRemaining);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const refreshData = async () => {
    let resp = await req("terms");
    if (resp) {
      setTerms(resp.data);
      console.log("active terms ", terms);
    } else {
      console.log("error fetching terms");
    }
  };

  useEffect(() => {
    refreshData().then(() => {
      console.log("done fetching terms");
    });
  }, []);

  const html = (
    <Fragment>
      <div className="terms_wrapper terms_wrapper_inner">
        {terms &&
          terms.filter(term => term.coin.symbol === props.coin).map((term) => {
             return (
             <Fragment>
                <div className="card terms-card">
                  <div className="card_heading">
                    <div>
                      <span>Term Amount</span>
                      <h3>
                        {/* {term?.symbol}  */}
                        {term.coin.symbol} {term?.amount}
                      </h3>
                      <span>$34,201.13</span>
                    </div>
                    <div>
                      <button className="block right">
                        <RedeemIcon />
                        Redeem
                      </button>
                      {/* <small className="block center">Term Remaining</small> */}
                      <small
                        className="block right"
                        style={{ color: "#1E4DD8" }}
                      >
                        {termRemaining} days left
                      </small>
                    </div>
                  </div>
                  <div className="card_content">
                    <div>
                      <span>Notice Period</span>
                      <span>{term?.notice_period} month</span>
                      {/* <span>3 month</span> */}
                    </div>
                    <div>
                      <span>Interest Earned</span>
                      <span>
                        {props.coin} {term?.earned_interest}
                        {/* {props.coin} 362.28 */}
                      </span>
                    </div>
                    <div>
                      <span>Due Date</span>
                      {/* <span>{term?.due_date}</span> */}
                      <span>--</span>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
          {/* <div>No active terms for {props.coin}.</div> */}
      </div>
    </Fragment>
  );
  return html;
};
