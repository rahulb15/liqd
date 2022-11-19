import React, { PureComponent, useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faArrowsRotate,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { numberToBN, postReq, req, round, isLogged } from "../../Utils";
import { BigNumber, ethers } from "ethers";
import SimpleLoader from "../SimpleLoader";
import { fiats } from "../../Utils/constants";
import { useToasts } from "react-toast-notifications";

export default function Swap(props) {
  const [loadingRates, setLoadingRates] = useState(true);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState(-1);
  const [coins, setCoins] = useState([]);
  const [selectedTopSide, setSelectedTopSide] = useState(null);
  const [selectedBottomSide, setselectedBottomSide] = useState(null);
  const [inRate, setInRate] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [fees, setFees] = useState(BigNumber.from(0));
  const { addToast } = useToasts();
  const [price1C, setPrice1] = useState(0);
  const [price2C, setPrice2] = useState(0);
  const [userBalance, setUserBalance] = useState(null);
  const [openCoinDropdown, setOpenCoinDropdown] = useState(false);
  const [FromCoinDropdown, setFromCoinDropdown] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(350px,100%)",
    boxShadow: 24,
    bgcolor: "#fff",
    borderRadius: "10px",
    p: 4,
  };
  const smStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "auto",
    height: "30% !important",
    width: "30% !important",
    borderRadius: 4,
    boxShadow: 24,
    textAlign: "center",
    padding: "20px",
  };
  async function fetchCoins() {
    let resp = await req("coins");
    let resp2 = await req("balance");
    if (resp && resp2) {
      setCoins(resp);
      setUserBalance(resp2);
      setSelectedTopSide(resp[0]);
      setselectedBottomSide(resp[1]);
      calculateOutRate(resp[0], resp[1]);
    } else {
      console.log("failed getting tokens");
    }
  }

  useEffect(() => {
    fetchCoins().then(() => console.log("done fetching coins"));
  }, []);

  const openModal = (side) => {
    setSide(side);
    setOpen(true);
  };

  const handleChoice = (i) => {
    console.log(i);
    setOpen(false);
    switch (side) {
      case 0:
        setSelectedTopSide(coins[i]);
        if(coins[i] == selectedBottomSide){
          if(i<coins.length-1){
            setselectedBottomSide(coins[i+1]);
          }
          else{
            setselectedBottomSide(coins[0]);
          }
        }
        setOpenCoinDropdown(!openCoinDropdown);
        break;
      case 1:
        if (coins[i] != selectedTopSide) {
          setselectedBottomSide(coins[i]);
          calculateOutRate(selectedTopSide, coins[i]);
          setFromCoinDropdown(!FromCoinDropdown);
        }
        break;
      default:
        setOpenCoinDropdown(!openCoinDropdown);
        setFromCoinDropdown(!FromCoinDropdown);
        break;
    }
  };

  async function fetchPrice(symbol) {
    let resp = await req("price/" + symbol);
    if (resp) {
      return resp.price;
    } else {
      return 1;
    }
  }

  async function calculateOutRate(top = null, bottom = null) {
    if (top && bottom) {
      setLoadingRates(true);
      let price1 = await fetchPrice(top.symbol);
      let price2 = await fetchPrice(bottom.symbol);
      setPrice1(price1);
      setPrice2(price2);
      let rate = price1 / (price2 * (1 + bottom.spread));
      console.log(rate);
      setExchangeRate(rate);
      setLoadingRates(false);
    }
  }

  const formulateOutRate = () => {
    if (selectedTopSide && selectedBottomSide) {
      let decimal;
      if (fiats.includes(selectedBottomSide.symbol)) {
        decimal = 5;
      } else {
        decimal = selectedBottomSide.decimals;
      }
      console.log(decimal);
      let fees = inRate * exchangeRate * selectedBottomSide.e_fee;
      console.log(fees);
      let new_val = round(inRate * exchangeRate - fees, decimal);
      console.log(new_val);
      let bn = numberToBN(new_val * 10 ** decimal, decimal);
      console.log(bn.toString());
      return ethers.utils.formatUnits(bn, decimal);
    } else {
      return BigNumber.from(0);
    }
  };

  async function swap() {
    let verified = await isLogged();
    if (verified.is_confirmed) {
      addToast("Starting Exchange", {
        autoDismiss: true,
        appearance: "info",
      });
      if (selectedTopSide && selectedBottomSide) {
        let body = {
          from: selectedTopSide.id,
          to: selectedBottomSide.id,
          amount: inRate,
        };

        let resp = await postReq("swap", body);
        if (resp.failed == false) {
          addToast(resp.message, {
            autoDismiss: true,
            appearance: "success",
          });
        } else if (resp.failed) {
          addToast(resp.message, {
            autoDismiss: true,
            appearance: "error",
          });
        } else {
          addToast("error", {
            autoDismiss: true,
            appearance: "error",
          });
        }
      } else {
        addToast("Select a Coin first", {
          autoDismiss: true,
          appearance: "error",
        });
      }
    } else {
      addToast("Confirm you email to perform swap operations.", {
        appearance: "error",
        autoDismiss: true,
      });
      setVerifyModal(true);
    }
  }
  const confirmAccount = async () => {
    let email = document.getElementById("confirmEmail").value;
    // send confirmation link
    addToast("Confirmation link sent on you email.", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  function switchCoins() {
    if (selectedBottomSide && selectedTopSide) {
      let price1 = price2C;
      let price2 = price1C;
      var rate = price1 / (price2 * (1 + selectedTopSide.spread));
      console.log(rate);
    }
    let temp = selectedBottomSide;
    setselectedBottomSide(selectedTopSide);
    setSelectedTopSide(temp);
    setInRate(0);
    setExchangeRate(rate);
  }

  function getBal(coin) {
    console.log("bal here !!!!!");
    let res = userBalance.filter((e) => e.symbol == coin);
    console.log(res);
    return formatAmount(res[0]);
  }

  function formatAmount(data) {
    let decimal;
    console.log("formating ....");
    let balance;
    if (fiats.includes(data.symbol)) {
      decimal = 4;
      balance = Number(data.balance) * 10 ** decimal;
    } else {
      decimal = data.decimals;
      balance = Number(data.balance);
    }
    console.log(data);
    return ethers.utils.formatUnits(
      numberToBN(balance, decimal).toString(),
      decimal
    );
  }
 
  const swapComp = (
    <Fragment>
      <h4 className="text-center mb-4">Swap</h4>
      <span>
        Balance :{" "}
        {selectedTopSide &&
          (() => getBal(selectedTopSide.symbol))() + selectedTopSide.symbol}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
        className="input-group flex items-center mb-3"
      >
        <input
          className="form-control w-4/5 border-2 p-2 h-[60px] rounded-l-[10px] form-control-lg"
          value={inRate}
          id="in"
          type="number"
          step="any"
          onChange={(t) => setInRate(t.target.value)}
        />
        <button
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className="btn flex items-center justify-center w-1/5 border-2 border-l-0 h-[51px] rounded-r-[10px] p-2 "
          type="button"
          // onClick={() => openModal(0)}
          onClick={() => {
            setOpenCoinDropdown(!openCoinDropdown);
            setSide(0);
          }}
        >
          {selectedTopSide ? (
            <Fragment>
              <Image
                src={selectedTopSide.image}
                height={32}
                width={32}
                alt="image"
              />
              <span className="mx-1 lg:block hidden">
                {selectedTopSide.symbol}{" "}
              </span>
              <i className="fa fa-angle-down" />
            </Fragment>
          ) : (
            <i className="fa fa-angle-down" />
          )}
        </button>
        {openCoinDropdown && (
          <div data-tippy-root id="tippy-9" style={{ position: "relative" }}>
            <div
              className="Menu tippy-box light"
              tabIndex={-1}
              data-placement="bottom"
              style={{
                zIndex: 9999,
                margin: 0,
                position: "absolute",
                bottom: -10,
                inset: "0px auto auto 0px",
                transform: "translate(-93%, 35px)",
                opacity: 1,
                width: "90px",
              }}
            >
              <ul>
                {coins.map((e, i) => {
                  //  if (e.symbol == selectedBottomSide.symbol
                  //   ) {
                  //     console.log("skip");
                  //   }
                  //   else{
                  return (
                    <li
                      key={i}
                      onClick={() => handleChoice(i)}
                      className=" flex border-b-2 items-center cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Image
                        src={e.image}
                        className="mx-3 my-3 "
                        alt="image"
                        width={32}
                        height={32}
                      />{" "}
                      <p className="text-[#0d0d0d] font-bold">{e.symbol}</p>
                    </li>
                  );
                    // }
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full justify-center align-center">
        <FontAwesomeIcon
          onClick={switchCoins}
          icon={faArrowsRotate}
          style={{ fontSize: "1rem", width: 32, height: 32 }}
          className=" mb-3 text-center cursor-pointer"
        />
      </div>
      <span>
        Balance :{" "}
        {selectedBottomSide &&
          (() => getBal(selectedBottomSide.symbol))() +
            selectedBottomSide.symbol}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
        className="input-group flex items-center mb-3"
      >
        <input
          type="number"
          id="out"
          step="any"
          className="form-control w-4/5  border-2 p-2 h-[60px] rounded-l-[10px] form-control-lg"
          disabled={true}
          value={formulateOutRate().toString()}
        />

        <button
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className="btn items-center justify-center w-1/5 border-2 border-l-0 h-[51px] rounded-r-[10px] p-2 "
          type="button"
          // onClick={() => openModal(1)}
          onClick={() => {
            setFromCoinDropdown(!FromCoinDropdown);
            setSide(1);
          }}
        >
          {selectedBottomSide ? (
            <Fragment>
              <Image
                src={selectedBottomSide.image}
                height={32}
                width={32}
                alt="image"
              />

              <span className="mx-1 lg:block hidden">
                {selectedBottomSide.symbol}{" "}
              </span>
              <i className="fa fa-angle-down" />
            </Fragment>
          ) : (
            <i className="fa fa-angle-down" />
          )}
        </button>
        {FromCoinDropdown && (
          <div data-tippy-root id="tippy-9" style={{ position: "relative" }}>
            <div
              className="Menu tippy-box light"
              tabIndex={-1}
              data-placement="bottom"
              style={{
                zIndex: 9999,
                margin: 0,
                position: "absolute",
                bottom: -10,
                inset: "0px auto auto 0px",
                transform: "translate(-93%, 35px)",
                opacity: 1,
                width: "90px",
              }}
            >
              <ul>
                {coins.map((e, i) => {
                  // if (e.symbol == selectedTopSide.symbol
                  // ) {
                  //   console.log("skip");
                  // }
                  // else{
                    return (
                      <li
                        key={i}
                        onClick={() => handleChoice(i)}
                        className=" flex border-b-2 items-center cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Image
                          src={e.image}
                          className="mx-3 my-3 "
                          alt="image"
                          width={32}
                          height={32}
                        />{" "}
                        <p className="text-[#0d0d0d] font-bold">{e.symbol}</p>
                      </li>
                    );
                  // }
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
      <p className="mb-3">
        {selectedTopSide && selectedBottomSide && (
          <Fragment>
            {inRate} {selectedTopSide.symbol} = {formulateOutRate().toString()}{" "}
            {selectedBottomSide.symbol}
          </Fragment>
        )}
      </p>
      <button
        className="Button primary block"
        onClick={() => swap()}
        type="submit"
      >
        Swap
      </button>
    </Fragment>
  );

  return (
    <>
      <section>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              {loadingRates ? (
                <div
                  style={{ display: "flex", flexDirection: "column" }}
                  className="items-center justify-center h-[400px]"
                >
                  <h3>Loading ... </h3>
                  <br></br>
                  <SimpleLoader />
                </div>
              ) : (
                swapComp
              )}
            </div>
          </div>
        </div>
      </section>

      {/* <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="CW-modal-content">
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="w-full"
          >
            <h1 className="text-center m-2 text-xl text-[#1e4dd8]">
              Select a Coin
            </h1>
            <ul>
              {coins.map((e, i) => {
                if (
                  selectedTopSide &&
                  fiats.includes(e.symbol) &&
                  fiats.includes(selectedTopSide.symbol)
                ) {
                  console.log(selectedTopSide , " + " , fiats.includes(e.symbol) , " + " , fiats.includes(selectedTopSide.symbol));
                } else {
                return (
                  <li
                    key={i}
                    onClick={() => handleChoice(i)}
                    className=" flex border-b-2 items-center cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Image
                      src={e.image}
                      className="mx-3 my-3 "
                      alt="image"
                      width={32}
                      height={32}
                    />{" "}
                    <p className="text-[#0d0d0d] font-bold">{e.symbol}</p>
                  </li>
                );
                }
              })}
            </ul>
          </div>
        </Box>
      </Modal> */}
      <Modal
        open={verifyModal}
        onClose={() => setVerifyModal(false)}
        aria-labelledby="save address"
        aria-describedby="save address"
      >
        <Box sx={smStyle} className="items-center justify-center">
          <div className="d-flex w-5/5 flex-column justify-center align-center mx-auto">
            <label className="d-inline-block my-2" style={{ color: "inherit" }}>
              Enter your email to receive confirmation link.
            </label>
            <input
              className="border-1 h-16 p-2 my-2"
              id="confirmEmail"
              placeholder="Enter your email"
              required
            />
            <button
              className="Button primary my-2"
              onClick={() => {
                setVerifyModal(false);
                confirmAccount();
              }}
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
