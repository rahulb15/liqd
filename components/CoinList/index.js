import { Fragment, useState, useEffect, useContext } from "react";
import Image from "next/image";
import { DropzoneDialog } from "material-ui-dropzone";
import {
  handleSingleFileSubmit,
  postReq,
  req,
  numberToBN,
  handleResp,
  isLogged,
} from "../../Utils";
import { useToasts } from "react-toast-notifications";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import { fiats } from "../../Utils/constants";
import { UserContext } from "../../contexts/UserContext";
import PaymentModel from "./components/PaymentModal";
import axios from "axios";
import Router from "next/router";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import { Select } from "@material-ui/core";
import Authenticator from "./authenticator"
import {testResponse} from "../BalancesCards/testResponseBalance"


export default function CoinList(props) {
  const [User, setUser] = useContext(UserContext);
  const [coins, setCoins] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openSubscribe, setOpenSubscribe] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openDep, setopenDep] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedCoinData, setSelectedCoinData] = useState("");
  const [selectedId, setSelectedId] = useState(-1);
  const { addToast } = useToasts();
  const [total, setTotal] = useState(0);
  const [selectedOption, setSelectedOption] = useState("Subscribe");
  const [addressBookIndex, setAddressBookIndex] = useState();
  const [addAddress, showAddAddress] = useState(false);
  const [savedAddress, showSavedAddress] = useState(true);
  const [addressBook, setAddressBook] = useState([]);
  const [addressBook2, setAddressBook2] = useState();
  const [showModal, setShowModal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [payInCurrency, setPayInCurrency] = useState("");
  const [openPaymentModel, setOpenPaymentModel] = useState(false);
  const [schema, setSchema] = useState();
  const [requestType, setRequestType] = useState();
  const [twoFactor, setTwoFactor] = useState(false);
  const style = {
    // position: "absolute",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
    // bgcolor: "background.paper",
    // overflow: "auto",
    // height: "95%",
    // width: "50% !important",
    // borderRadius: 4,
    // boxShadow: 24,
    // textAlign: "center",
    // padding: "20px",
  };
  console.log("selectedDATA", selectedCoinData);
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


  const set2FAEnabled = (data) => {
    console.log("set2FAEnabled", data);
    setTwoFactor(data);
  }  


  console.log("twoFactor",twoFactor);



  async function fetchBalances() {
    let resp = await req("balance");
    props.setBalanceLoader(false);
    if (resp) {
      // setCoins(resp);
      setCoins(testResponse);
      getTotal(resp);
      addToast("Success", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("fetching balances failed", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  async function handleFile(file) {
    let body = {
      coin_id: selectedCoin,
      file: file,
    };
    setOpenDeposit(false);
    setSelectedCoin(null);
    let resp = await handleSingleFileSubmit(file[0], "fiat", body);
    if (resp) {
      addToast("Success", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Failed Sending Document", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }



  function openDepositModal(c_id) {
    setSelectedCoin(c_id);
    setOpenDeposit(true);
  }

  useEffect(() => {
    fetchBalances().then(() => console.log("finished fetching balances"));
  }, []);

  function getTotal(coins) {
    let tot = 0;
    for (let coin of coins) {
      tot += coin.usd_price;
    }
    tot = Math.round((tot + Number.EPSILON) * 100) / 100;
    setTotal(tot);
  }

  function formatAmount(data) {
    let decimal;
    let balance;
    if (fiats.includes(data.symbol)) {
      decimal = 4;
      balance = Number(data.balance) * 10 ** decimal;
    } else {
      decimal = data.decimals;
      balance = Number(data.balance);
    }
    return ethers.utils.formatUnits(
      numberToBN(balance, decimal).toString(),
      decimal
    );
  }

  function formatEarn(data) {
    let decimal;
    let balance;
    if (fiats.includes(data.symbol)) {
      decimal = 4;
      balance = Number(data.earn) * 10 ** decimal;
    } else {
      decimal = data.decimals;
      balance = Number(data.earn);
    }
    return ethers.utils.formatUnits(
      numberToBN(balance, decimal).toString(),
      decimal
    );
  }

  async function handleSubscribe(data) {
    let verified = await isLogged();
    if (verified.is_confirmed) {
      setSelectedCoinData(data);
      setOpenSubscribe(true);
    } else {
      addToast("Confirm your email to perform transactions.", {
        appearance: "error",
        autoDismiss: true,
      });
      setVerifyModal(true);
    }
  }

  async function handleWithdraw(data) {
    let verified = await isLogged();
    if (verified.is_confirmed) {
      setSelectedCoinData(data);
      getSavedAddress();
      setOpenWithdraw(true);
    } else {
      addToast("Confirm your email to perform transactions.", {
        appearance: "error",
        autoDismiss: true,
      });
      setVerifyModal(true);
    }
  }

  async function subscribe() {
    let amount = document.getElementById("earnAmount").value;
    let type = null;
    if (selectedOption == "Subscribe") {
      type = "stake";
    } else {
      type = "unstake";
    }
    let body = {
      amount,
      id: selectedCoinData.id,
      type: type,
    };
    setOpenSubscribe(false);
    let resp = await postReq("earn", body);
    handleResp(resp, addToast);
  }

  const handleClick = (e) => {
    e.preventDefault();
    let amount = document.getElementById("earnAmount").value;
    Router.push({
      pathname: "/app/term",
      query: {
        amount,
        coin: selectedCoinData.symbol,
        coin_id: selectedCoinData.id,
        image: selectedCoinData.image,
      },
    });
  };
  const gbpSchema = Yup.object().shape({
    accountName: Yup.string().required("Account name is required"),
    bankName: Yup.string().required("Bank name is required"),
    accountNumber: Yup.string()
      .min(15, "Account number should be at least 15 digits long")
      .required("Account Number is required"),
    sortCode: Yup.string()
      .min(8, "Sort Code should be at least 8 digits long")
      .max(9, "Sort Code cannot be more than 9 digits")
      .required("Sort Code is required"),
  });

  const eurSchema = Yup.object().shape({
    accountName: Yup.string().required("Account name is required"),
    bankName: Yup.string().required("Bank name is required"),
    iban: Yup.string()
      .min(15, "IBAN should be at least 15 digits long")
      .required("IBAN is required"),
    bic: Yup.string()
      .min(8, "BIC should be at least 8 digits long")
      .max(9, "BIC cannot be more than 9 digits")
      .required("BIC is required"),
  });
  const usdSchema = Yup.object().shape({
    accountName: Yup.string().required("Account name is required"),
    bankName: Yup.string().required("Bank name is required"),
    iban: Yup.string()
      .min(15, "IBAN should be at least 15 digits long")
      .required("IBAN is required"),
    bic: Yup.string()
      .min(8, "BIC should be at least 8 digits long")
      .required("BIC is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
  });

  const walletSchema = Yup.object().shape({
    walletAddress: Yup.string().required("Wallet Address is required"),
  });
  const savedSchema = Yup.object().shape({
    address: Yup.string().required("Please select address"),
  });
  const initialValues = {
    accountName: "",
    bankName: "",
    walletAddress: "",
    sortCode: "",
    bic: "",
    iban: "",
    accountNumber: "",
    city: "",
    country: "",
    address: -1,
  };
  const handleSchema = () => {
    if (document.getElementById("accountNumber")) {
      setSchema(gbpSchema);
    } else if (document.getElementById("city")) {
      setSchema(usdSchema);
    } else if (document.getElementById("bic")) {
      setSchema(eurSchema);
    } else if (document.getElementById("address")) {
      setSchema(walletSchema);
    } else if (document.getElementById("saved-addressbook1")) {
      setSchema(savedSchema);
    }
  };

  async function withdraw(data) {
    // setOpenWithdraw(false);
    // add 2FA here
    // <Authenticator data={data} set2FAEnabled={set2FAEnabled} />
    if (twoFAEnabled) {
      console.log("data", data);
      let amount = document.getElementById("earnAmount").value;
      let body = {};
      // console.log("method selected is  ", addressBookIndex.target.value);
      if (document.getElementById("accountName")) {
        console.log("accountName");
        let account_name = data.accountName;
        let bank_name = data.bankName;
        if (selectedCoinData.symbol == "EUR") {
          let bic = data.bic;
          let iban = data.iban;
          body = {
            account_name,
            bank_name,
            bic,
            iban,
          };
        } else if (selectedCoinData.symbol == "USD") {
          let bic = data.bic;
          let iban = data.iban;
          let city = data.city;
          let country = data.country;
          body = {
            account_name,
            bank_name,
            bic,
            iban,
            city,
            country,
          };
        } else {
          let account_number = data.accountNumber;
          let sort_code = data.sortCode;
          body = {
            account_name,
            bank_name,
            sort_code,
            account_number,
          };
        }
      } else if (document.getElementById("saved-addressbook1")) {
        console.log(addressBookIndex.target);
        if (addressBookIndex?.target?.value) {
          if (data.address != -1) {
            body["bank_detail_id"] = data.address;
            body["address"] = data.address;
          }
          // console.log(bankDetail);
        } else {
          alert("Please select bank details");
          return false;
        }
      } else if (document.getElementById("address")) {
        console.log("condition wallet address");
        let address = document.getElementById("address")?.value;
        body = {
          address,
        };
      }
      body["amount"] = amount;
      body["coin_id"] = selectedCoinData.id;
      setOpenWithdraw(false);
      let resp = await postReq("withdraw", body);
      handleResp(resp, addToast);
      setAddressBookIndex(null);
      showAddAddress(false);
      showSavedAddress(true);
      
    }

  }
  const saveAddress = async () => {
    let label = document.getElementById("addressName").value;
    let coin_id = selectedCoinData.id;
    let body;
    if (document.getElementById("accountName")) {
      let account_name = document.getElementById("accountName").value;
      let bank_name = document.getElementById("bankName").value;
      if (selectedCoinData.symbol == "EUR") {
        let bic = document.getElementById("bic").value;
        let iban = document.getElementById("iban").value;
        body = {
          label,
          account_name,
          bank_name,
          bic,
          iban,
          coin_id,
        };
      } else if (selectedCoinData.symbol == "USD") {
        let bic = document.getElementById("bic").value;
        let iban = document.getElementById("iban").value;
        let city = document.getElementById("city").value;
        let country = document.getElementById("country").value;
        body = {
          label,
          account_name,
          bank_name,
          bic,
          iban,
          city,
          country,
          coin_id,
        };
      } else {
        let account_number = document.getElementById("accountNumber").value;
        let sort_code = document.getElementById("sortCode").value;
        body = {
          label,
          account_name,
          bank_name,
          sort_code,
          account_number,
          coin_id,
        };
      }
      // setAddressBook(body);
    } else {
      let address = document.getElementById("address").value;
      body = {
        label,
        address,
        coin_id,
      };
      // setAddressBook2(body);
    }
    addNewAddress(body);
    showAddAddress(false);
    showSavedAddress(true);
  };

  const addNewAddress = async (body) => {
    let resp = await postReq("bankdetail", body);
    if (resp.success) {
      addToast("Bank details saved.", {
        appearance: "success",
        autoDismiss: true,
      });
      getSavedAddress();
    }
  };

  const getSavedAddress = async () => {
    let user_id = window.btoa(User.id);
    user_id = encodeURIComponent(user_id);
    let resp = await req(`bankdetail/${user_id}`);
    setAddressBook(resp.data);
    if (resp.data.length > 0) {
      showSavedAddress(true);
    }
  };

  async function handleDepositFiat(data) {
    let verified = await isLogged();
    console.log("verified", verified);
    if (verified.is_confirmed) {
      // setRequestType(data);
      setSelectedId(data);
      let coin = null;
      if (data === 12) {
        setRequestType("banking");
        coin = "GBP";
      } else if (data === 11) {
        setRequestType("banking");
        coin = "EUR";
      } else {
        setRequestType("upload");
      }
      setPayInCurrency(coin);
      setopenDep(true);
    } else {
      addToast("Confirm your email to perform transactions.", {
        appearance: "error",
        autoDismiss: true,
      });
      setVerifyModal(true);
    }
  }

  const paymentHandler = (currency) => {
    console.log("currency ", currency);
    let coin = null;
    if (currency === 12) {
      coin = "GBP";
    } else {
      coin = "EUR";
    }
    setPayInCurrency(coin);
    setOpenPaymentModel(true);
    setopenDep(false);
  };

  const closePaymentModel = () => {
    setPayInCurrency("");
    setOpenPaymentModel(false);
  };

  const handleNonFiatDeposit = async (data) => {
    let verified = await isLogged();

    if (verified.is_confirmed) {
      setSelectedCoinData(data);
      setOpenModal(true);
    } else {
      addToast("Confirm your email to perform transactions.", {
        appearance: "error",
        autoDismiss: true,
      });
      setVerifyModal(true);
    }
  };
  const confirmAccount = async () => {
    let email = document.getElementById("confirmEmail").value;
    console.log("confirm email", email);
    // send confirmation link
    addToast("Confirmation link sent on you email.", {
      appearance: "success",
      autoDismiss: true,
    });
  };

 

  const coinField = (data, key) => {
    console.log("dataforcoin", data);
    console.log("key", key);
    return (
      <tr key={key}>
        <td align="left">
          <span className="AssetVisual">
            <Image src={data.image} height={32} width={32} alt={data.name} />
            <strong>{data.name}</strong>
          </span>
        </td>
        <td align="right">
          <span className="AssetBalance right semi-bold">
            <span>
              {data.symbol}
              <strong className="semi-bold">{" " + formatAmount(data)}</strong>
            </span>
            <span className="usd">{"$" + data.usd_price}</span>
          </span>
        </td>
        {/* <td align="right">
          <span className="normal">${data.credit}</span>
        </td> */}
        <td align="right">
          <span className="normal">{formatEarn(data)}</span>
        </td>
        <td align="right">
          <span className="HighlightLabel success clickable">
            {Number(data.interest) >= 0
              ? `Earn up to ${data.interest * 100}%`
              : "No Interest"}
          </span>
        </td>
        {/* <td style={{ paddingRight: 0 }}>
          {(data.name === "GBP" || data.name === "EUR") && (
            <a onClick={() => paymentHandler(data.name)}>
              <button type="button" className="Button primary block">
                Pay
              </button>
            </a>
          )}
        </td> */}
        <td style={{ paddingRight: 0 }}>
          <a
            onClick={
              fiats.includes(data.symbol)
                ? () => {
                  console.log("data ", data);
                    handleDepositFiat(data.id);
                    console.log("selected coin", selectedId);
                  }
                : () => {
                    setSelectedCoinData(data);
                    setOpenModal(true);
                    console.log("selected coin 2", selectedId);
                  }
            }
          >
            <button type="button" className="Button primary block">
              Top Up
            </button>
          </a>
        </td>
        <td style={{ paddingRight: 0 }}>
          <a onClick={() => handleSubscribe(data)}>
            <button type="button" className="Button primary block">
              Earn
            </button>
          </a>
        </td>

        <td
          align={
            data.name !== "GBP" || data.name !== "EUR" ? "center" : "right"
          }
          width={110}
          // colSpan={data.name !== "GBP" || data.name !== "EUR" ? 2 : undefined}
        >
          <a>
            {/* <button
              type="button"
              className="Button secondary"
              style={{ minWidth: 110 }}
              onClick={() => handleWithdraw(data)}
            >
              Withdraw
            </button>
             */}
            <Authenticator data={data} set2FAEnabled={set2FAEnabled} />
          </a>
        </td>
      </tr>
    );
  };
  const initial = {
    earn: "",
    earnAmount: 100,
  };

  const validationSchema = Yup.object().shape({
    earn: Yup.string().required("Request Type is required."),
    earnAmount: Yup.string().required("Amount is required."),
  });

  const handleEarnSubmit = (data) => {
    console.log("data", data);
    subscribe();
  };
  const handleChange = (e) => {
    let value = e.target.value;
    setSelectedOption(value);
  };
  const html = (
    <Fragment>
      {!props.balanceLoader && (
        <Fragment>
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
                    {/* <a href="calculator.html">
                  <button type="button" className="Button secondary">
                    Calculator
                  </button>
                </a> */}
                  </th>
                  <th align="right" width={200}>
                    Balance
                  </th>
                  {/* <th align="right">Credit Line</th> */}
                  <th align="right">Earn Balance</th>
                  <th align="right">Earn Interest</th>
                  <th colSpan={3} align="right">
                    {/* <div className="Toggle">
                  <label>Hide Zero BalanceAssets</label>
                  <span>off</span>
                </div> */}
                  </th>
                </tr>
              </thead>
              <tbody>{coins && coins.map((e, i) => coinField(e, i))}</tbody>
            </table>
          </div>
          {/* <div className="AccountTotalAssetValuePerWallet flex ">
            <h5 aria-expanded="false">
              Total Savings: <span>${total}</span>
            </h5>
            <small>
              If the value of your collateral assets reaches
              <span>$0.00</span>, small partial loan repayments will be
              initiated automatically
            </small>
            <button
              className="Button primary my-2 ms-auto"
              onClick={(e) => handleClick(e)}
            >
              Subscribe Fixed Term
            </button>
          </div> */}
        </Fragment>
      )}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"z
      >
        <Box
          sx={style}
          className=" items-center justify-center custom_modal_lg"
        >
          <div className=" flex items-center justify-center h-5/5 w-5/5 bg-[#f6f8fb]">
            <div className="text-center w-5/5 p-6">
              <h1 className="text-center">Your Deposit Address</h1>
              <p>{selectedCoinData.address}</p>
            </div>
          </div>
          <div className="w-5/5 text-center my-5">
            <p>
              Minimum Deposit : {selectedCoinData.min_deposit}{" "}
              {selectedCoinData.symbol}{" "}
            </p>
            {selectedCoinData.token ? (
              <p>
                You need to send a fee payment of {selectedCoinData.token_fee}{" "}
                {selectedCoinData.network_symbol}{" "}
              </p>
            ) : (
              ""
            )}
          </div>
        </Box>
      </Modal>

      <Modal
        open={openWithdraw}
        onClose={() => {
          setOpenWithdraw(false);
          showAddAddress(false);
          showSavedAddress(true);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className=" items-center justify-center custom_modal_lg"
        >
          {selectedCoinData && (
            <>
              <h1 className="text-center my-3">Submit a withdraw request</h1>
              <h3 className="my-2">Currency : {selectedCoinData.symbol}</h3>
              <Formik
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={withdraw}
              >
                {(formik) => {
                  const {
                    value,
                    errors,
                    touched,
                    isValid,
                    dirty,
                    setFieldValue,
                    handleChange,
                  } = formik;
                  return (
                    <Form>
                      {savedAddress &&
                        (addressBook.length > 0 &&
                        addressBook.filter(
                          (e) => e.coin.id === selectedCoinData.id
                        ).length > 0 ? (
                          <>
                            {/* {console.log('address book after update',addressBook)} */}
                            <div className="d-flex w-5/5 flex-column mx-4 select_field">
                              <Field
                                name="address"
                                id="saved-addressbook1"
                                as="select"
                                onChange={(e) => {
                                  setAddressBookIndex(e);
                                  setFieldValue("address", e.target.value);
                                  console.log("values of e ", e);
                                }}
                                defaultValue={-1}
                                className={`w-5/5 p-3 border-1 ${
                                  touched.address && errors.address
                                    ? "input-error"
                                    : ""
                                }`}
                              >
                                <option value={-1}>Select Address</option>
                                {addressBook
                                  .filter(
                                    (e) => e.coin.id === selectedCoinData.id
                                  )
                                  .map((address) => {
                                    return (
                                      <option
                                        value={address?.id}
                                        key={address?.id}
                                      >
                                        {address?.label}
                                      </option>
                                    );
                                  })}
                              </Field>
                              <ErrorMessage
                                name="address"
                                component="span"
                                className="error"
                              />
                            </div>
                            <div className="text-center py-3">
                              <button
                                className="Button primary"
                                onClick={() => {
                                  showAddAddress(true);
                                  showSavedAddress(false);
                                }}
                              >
                                Add New Address +
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-3">
                            <button
                              className="Button primary"
                              onClick={() => {
                                showAddAddress(true);
                                showSavedAddress(false);
                              }}
                            >
                              Add New Address +
                            </button>
                          </div>
                        ))}
                      {addAddress && fiats.includes(selectedCoinData.symbol) && (
                        <>
                          <label className="mt-l">Account Name</label>
                          <div className="custom_TextBox m-2 w-5/5">
                            <Field
                              type="text"
                              id="accountName"
                              placeholder="Account Name"
                              name="accountName"
                              onClick={handleSchema}
                              className={`${
                                touched.accountName && errors.accountName
                                  ? "input-error"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name="accountName"
                              component="span"
                              className="error"
                            />
                          </div>

                          {selectedCoinData.symbol == "EUR" ||
                          selectedCoinData.symbol == "USD" ? (
                            <>
                              <label className="mt-l">IBAN</label>
                              <div className="custom_TextBox m-2 w-5/5">
                                <Field
                                  type="text"
                                  id="iban"
                                  placeholder="IBAN"
                                  name="iban"
                                  className={`${
                                    touched.iban && errors.iban
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="iban"
                                  component="span"
                                  className="error"
                                />
                              </div>
                              <label className="mt-l">BIC</label>
                              <div className="custom_TextBox m-2 w-5/5">
                                <Field
                                  type="text"
                                  id="bic"
                                  placeholder="BIC"
                                  name="bic"
                                  className={`${
                                    touched.bic && errors.bic
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="bic"
                                  component="span"
                                  className="error"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <label className="mt-l">Sort Code</label>
                              <div className="custom_TextBox m-2 w-5/5">
                                <Field
                                  type="text"
                                  id="sortCode"
                                  placeholder="Sort Code"
                                  name="sortCode"
                                  className={`${
                                    touched.sortCode && errors.sortCode
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="sortCode"
                                  component="span"
                                  className="error"
                                />
                              </div>
                              <label className="mt-l">Account Number</label>
                              <div className="custom_TextBox m-2 w-5/5">
                                <Field
                                  type="text"
                                  id="accountNumber"
                                  placeholder="Account Number"
                                  name="accountNumber"
                                  className={`${
                                    touched.accountNumber &&
                                    errors.accountNumber
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="accountNumber"
                                  component="span"
                                  className="error"
                                />
                              </div>
                            </>
                          )}

                          <label className="mt-l">Bank Name</label>
                          <div className="custom_TextBox m-2 w-5/5">
                            <Field
                              type="text"
                              id="bankName"
                              placeholder="Bank Name"
                              name="bankName"
                              className={`${
                                touched.bankName && errors.bankName
                                  ? "input-error"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name="bankName"
                              component="span"
                              className="error"
                            />
                          </div>

                          {selectedCoinData.symbol == "USD" && (
                            <>
                              <label className="mt-l">Bank City</label>
                              <div className="custom_TextBox m-2 w-5/5">
                                <Field
                                  type="text"
                                  id="city"
                                  placeholder="City"
                                  name="city"
                                  className={`${
                                    touched.city && errors.city
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="city"
                                  component="span"
                                  className="error"
                                />
                              </div>
                              <label className="mt-l">Country</label>
                              <div className="custom_TextBox m-2 w-5/5">
                                <Field
                                  type="text"
                                  id="country"
                                  placeholder="Country"
                                  name="country"
                                  className={`${
                                    touched.country && errors.country
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name="country"
                                  component="span"
                                  className="error"
                                />
                              </div>
                            </>
                          )}
                          <div className="m-4 w-5/5">
                            <p>
                              Please note that we can only withdraw to bank
                              accounts under your own name and not third-party
                              accounts.
                            </p>
                          </div>
                          <div className="text-right my-l me-4">
                            <button
                              className="Button secondary small mr-3"
                              type="button"
                              onClick={() => {
                                showAddAddress(false);
                                showSavedAddress(true);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className={`Button primary small ${
                                !(dirty && isValid) ? "disabled-btn" : ""
                              }`}
                              disabled={!(dirty && isValid)}
                              type="button"
                              onClick={() => {
                                setShowModal(true);
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </>
                      )}

                      {addAddress && !fiats.includes(selectedCoinData.symbol) && (
                        <>
                          <label className="mt-l">Address</label>
                          <div className="custom_TextBox m-2 w-5/5">
                            <Field
                              type="text"
                              id="address"
                              placeholder="Address"
                              name="walletAddress"
                              onClick={handleSchema}
                              className={`${
                                touched.address && errors.address
                                  ? "input-error"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name="accountName"
                              component="span"
                              className="error"
                            />
                          </div>
                          <div className="text-right my-l me-4">
                            <button
                              className="Button secondary small me-3"
                              onClick={() => {
                                showAddAddress(false);
                                showSavedAddress(true);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className={`Button primary small ${
                                !(dirty && isValid) ? "disabled-btn" : ""
                              }`}
                              disabled={!(dirty && isValid)}
                              type={"button"}
                              onClick={() => {
                                setShowModal(true);
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </>
                      )}
                      <label className="mt-l">Amount to withdraw</label>
                      <div className="TextBox m-4 w-5/5">
                        <input
                          type="number"
                          step=".01"
                          id="earnAmount"
                          defaultValue={0}
                          placeholder="Value"
                        />
                      </div>

                      <button
                        type="submit"
                        className={`Button primary my-5  w-1/5 ${
                          !(dirty && isValid) ? "disabled-btn" : ""
                        }`}
                        disabled={!(dirty && isValid)}
                      >
                        {" "}
                        Send{" "}
                      </button>
                      <Authenticator data={data} set2FAEnabled={set2FAEnabled} />
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </Box>
      </Modal>

      {/* <PaymentModel
        currency={payInCurrency}
        isOpen={openPaymentModel}
        setIsOpen={setOpenPaymentModel}
        handleOnClose={closePaymentModel}
      /> */}

      <DropzoneDialog
        open={openDeposit}
        onSave={handleFile}
        dropzoneText={`Drag or drop the Receipt Image`}
        previewText={`Drag or drop the Receipt Image`}
        acceptedFiles={["image/*", "application/*"]}
        filesLimit={1}
        showPreviews={true}
        maxFileSize={5000000}
        onClose={() => {
          setSelectedCoin(null);
          setOpenDeposit(false);
        }}
      />
      {/* </Fragment>
    ); */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="save address"
        aria-describedby="save address"
      >
        <Box sx={smStyle} className="items-center justify-center">
          <div className="d-flex w-5/5 flex-column justify-center align-center mx-auto">
            <label className="d-inline-block my-2" style={{ color: "inherit" }}>
              Give a name to this address.
            </label>
            <input
              className="border-1 h-16 p-2 my-2"
              id="addressName"
              placeholder="Save Address With Name..."
              required
            />
            <button
              className="Button primary my-2"
              onClick={() => {
                setShowModal(false);
                saveAddress();
              }}
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openSubscribe}
        onClose={() => setOpenSubscribe(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className=" items-center justify-center custom_modal_lg"
        >
          {selectedCoinData && (
            <>
              <h1 className="text-center my-3">Subscribe to Earn</h1>
              <h3 className="my-2">For Currency : {selectedCoinData.symbol}</h3>
              <Formik
                initialValues={initial}
                validationSchema={validationSchema}
                onSubmit={handleEarnSubmit}
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
                  } = formik;
                  return (
                    <Form>
                      <div className="f1 mt-5">
                        <label className="Label" id="earn">
                          Request Type
                        </label>
                        <div
                          className="flex justify-content-evenly"
                          role={"group"}
                          aria-labelledby="earn"
                          onChange={handleChange}
                        >
                          <div className="border-1 earn_option_field">
                            <label for="subscribe" className="m-0">
                              <Field
                                name="earn"
                                id="subscribe"
                                type={"radio"}
                                value={"Subscribe"}
                              />
                              Subscribe
                            </label>
                          </div>
                          <div className="border-1 earn_option_field">
                            <label for="redeem" className="m-0">
                              <Field
                                name="earn"
                                id="redeem"
                                type={"radio"}
                                value={"Redeem"}
                              />
                              Redeem
                            </label>
                          </div>
                        </div>
                        <ErrorMessage
                          name="earn"
                          component="span"
                          className="error"
                        />
                      </div>
                      <div>
                        <label className="mt-l">Amount to Stake</label>
                        <div className="TextBox my-3 w-5/5">
                          <Field
                            type="number"
                            step=".01"
                            name="earnAmount"
                            id="earnAmount"
                            defaultValue={100}
                            placeholder="Value"
                            min={100}
                          />
                          <ErrorMessage
                            name="earnAmount"
                            component="span"
                            className="error"
                          />
                        </div>
                      </div>

                      {selectedOption == "Subscribe" ? (
                        <div className="flex justify-content-evenly my-5">
                          <div>
                            <p>Earn interest upto 8%</p>
                            <button
                              // className="Button primary my-2 ms-auto"
                              onClick={(e) => handleClick(e)}
                              className={`Button primary${
                                !(dirty && isValid) ? "disabled-btn" : ""
                              }`}
                              disabled={!(dirty && isValid)}
                              type="submit"
                            >
                              Fixed Term
                            </button>
                            {/* <a
                              onClick={handleClick}
                              className="block"
                              style={{ cursor: "pointer" }}
                            >
                              See fixed terms
                            </a> */}
                          </div>
                          <div>
                            <p>Earn interest upto 4%</p>
                            <button
                              // className="Button primary my-2 ms-auto"
                              // onClick={() => subscribe()}
                              className={`Button primary${
                                !(dirty && isValid) ? "disabled-btn" : ""
                              }`}
                              disabled={!(dirty && isValid)}
                              type="submit"
                            >
                              Flex Earn
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          // type="button"
                          // onClick={() => subscribe()}
                          // className="Button primary my-5  w-1/5"
                          className={`Button primary${
                            !(dirty && isValid) ? "disabled-btn" : ""
                          }`}
                          disabled={!(dirty && isValid)}
                          type="submit"
                        >
                          {" "}
                          Send{" "}
                        </button>
                      )}
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </Box>
      </Modal>
      <Modal
        open={openDep}
        onClose={() => {
          setopenDep(false);
          setRequestType(null);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className=" items-center justify-center custom_modal_lg payment_modal"
        >
          {(selectedId === 12 || selectedId === 11) && (
            <select
              className="form-select mb-3"
              name="topUprequest"
              onChange={(e) => {
                setRequestType(e.target.value);
              }}
            >
              <option value="banking">Open Banking</option>
              <option value="upload">Upload Screenshot</option>
            </select>
          )}
          {requestType == "banking" ? (
            <PaymentModel currency={payInCurrency} />
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column" }}
              className=" p-2 rounded-[10px] items-center justify-center h-full mx-auto w-9/10 bg-[#f6f8fb] bank_detail"
            >
              {selectedId == 12 ? (
                <>
                  <h1 className="text-center font-bold">Banking Details</h1>
                  <div className="w-full flex my-2">
                    <h2 className="text-2xl font-bold mx-2">Bank Name : </h2>
                    <h3 className="text-2xl">Clear Bank</h3>
                  </div>
                  <div className="w-full flex  my-2">
                    <h2 className="text-2xl font-bold mx-2">Name : </h2>
                    <h3 className="text-2xl">Lithex UAB</h3>
                  </div>
                  <div className="w-full flex  my-2">
                    <h2 className="text-2xl font-bold mx-2">
                      Account Number :{" "}
                    </h2>
                    <h3 className="text-2xl">00009137</h3>
                  </div>

                  <div className="w-full flex  my-2">
                    <h2 className="text-2xl font-bold mx-2">Sort Code : </h2>
                    <h3 className="text-2xl">040679</h3>
                  </div>
                  <div className="w-full flex  my-2">
                    <h2 className="text-2xl font-bold mx-2">Deposit Note : </h2>
                    <h3 className="text-2xl">
                      {User.depositID ? User.depositID : ""}
                    </h3>
                  </div>
                  <div className="w-full flex center my-2">
                    <p>FPS Faster payments only supported, not SWIFT</p>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-center font-bold">Banking Details</h1>
                  <div className="w-full flex my-2">
                    <h2 className="text-2xl font-bold text-nowrap mx-2">
                      Account Holder Name :{" "}
                    </h2>
                    <h3 className="text-2xl">Lithex UAB</h3>
                  </div>
                  <div className="w-full flex  my-2">
                    <h2 className="text-2xl font-bold text-nowrap mx-2">
                      EUR IBAN :{" "}
                    </h2>
                    <h3 className="text-2xl">
                      MT83CFTE28004000000000000258816{" "}
                    </h3>
                  </div>
                  <div className="w-full flex  my-2">
                    <h2 className="text-2xl font-bold mx-2">BIC : </h2>
                    <h3 className="text-2xl">CFTEMTM1</h3>
                  </div>

                  <div className="w-full flex align-items-start my-2">
                    <h2 className="text-2xl font-bold text-nowrap mx-2">
                      Bank address :{" "}
                    </h2>
                    <h3 className="text-2xl w-3/4 text-left">
                      OPEN FINANCIAL SERVICES MALTA LIMITED ST. JULIANS · MALTA
                    </h3>
                  </div>
                  <div className="w-full flex  my-2">
                    <h2 className="text-2xl font-bold mx-2">
                      Business address :{" "}
                    </h2>
                    <h3 className="text-2xl">Vilnius, Lithuania</h3>
                  </div>
                  <div className="w-full flex  my-2">
                    <h2 className="text-2xl font-bold mx-2">Deposit Note : </h2>
                    <h3 className="text-2xl">
                      {User.depositID ? User.depositID : ""}
                    </h3>
                  </div>
                  <div className="w-full flex center my-2">
                    <p>SEPA payments only supported, not SWIFT</p>
                  </div>
                </>
              )}
              <p>
                After Sending the deposit please send us a screenshot of the
                receipt
              </p>
              {/* <div className="flex justify-content-evenly w-100"> */}
              <button
                type="button"
                onClick={() => {
                  setopenDep(false);
                  openDepositModal(selectedId);
                }}
                className="Button primary my-2 me-2 w-1/3"
              >
                {" "}
                Upload{" "}
              </button>
              {/* </div> */}
            </div>
          )}
        </Box>
      </Modal>
      <Modal
        open={verifyModal}
        onClose={() => setVerifyModal(false)}
        aria-labelledby="save address"
        aria-describedby="save address"
      >
        <Box className="items-center justify-center custom_modal_sm">
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
      <DropzoneDialog
        open={openDeposit}
        onSave={handleFile}
        dropzoneText={`Drag or drop the Receipt Image`}
        previewText={`Drag or drop the Receipt Image`}
        acceptedFiles={["image/*", "application/*"]}
        filesLimit={1}
        showPreviews={true}
        maxFileSize={5000000}
        onClose={() => {
          setSelectedCoin(null);
          setOpenDeposit(false);
        }}
      />
    </Fragment>
  );

  return html;
}


// const set2FAEnabled = (data) => {
//   console.log("set2FAEnabled", data);
// }
