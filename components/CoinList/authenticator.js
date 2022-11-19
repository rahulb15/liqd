import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import QRCode from "react-qr-code";
import OtpInput from "react-otp-input";
import AuthenticatorCss from "../../styles/modular/Authenticator.module.css";
import { refreshToken } from "../../Utils";
import { useToasts } from "react-toast-notifications";


const questionList = [
  {
    description:
      "- Android users download Authenticator from Google Play Store",
    key: 0,
  },
  {
    description: "- IOS users download Google Authenticator from App Store",
    key: 1,
  },
  {
    description: "- Scan the QR code from the Google Authenticator app",
    key: 2,
  },
  {
    description: "- Enter the 6 digit code from the Google Authenticator app",
    key: 3,
  },
];

export default function AlertDialog(props) {
  const { addToast } = useToasts();
  console.log("propsssssssssssssssssssssssssssssssssssss", props);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [qrCode, setQrCode] = React.useState();
  const[showORCode, setshowQRCode] = React.useState(false);
  const[is2FAEnabled, setis2FAEnabled] = React.useState(false);
  const[error, setError] = React.useState(false);
  console.log(otp);

  props.set2FAEnabled(is2FAEnabled);

  const handleClickOpen2 = () => {
    console.log("handleClickOpen2");
    setOpen2(true);
  };

  const handleClose2 = () => {
    console.log("handleClose2");
    setOtp("");
    setOpen2(false);
  };

  const handleCloseAll = () => {
    setOtp("");
    setOpen2(false);
    setOpen(false);
    setshowQRCode(false);
    setError(false);
  };

   const submitOtp = async () => {
    let access = sessionStorage.getItem("accessToken");
    console.log(access);
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access,
    };
    console.log("header========", headers);
    let data = {
      otp: otp,
    };
    console.log("data", data);
    let response = await fetch(
      "https://api.liqd.flexsin.org/api/totp",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      }
    );
    console.log("response", response);
    if (response.ok) {
      let resp = await response.json();
      console.log("resp", resp);
      if (resp.success) {
        console.log("1111111111111111111111111111111111")
        setis2FAEnabled(true);
        handleCloseAll();        
      }
      else if (resp_json.code === "token_not_valid") {
        let dec = await refreshToken();
        console.log("dec", dec);
        if (dec) {
          return submitOtp();
        } else {
          return false;
        }
      } else {
        addToast("Failed", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    else {
      setError(true);
      addToast("Invalid OTP", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };


  const fetchOtp = async () => {
    let access = sessionStorage.getItem("accessToken");
    let resp = await fetch(
      "https://api.liqd.flexsin.org/api/totp",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access,
        }
      }
    );
    const data = await resp.json();
    if (data.success) {
      setQrCode(data.data.otpAuthUrl);
      setshowQRCode(data.data.showQR);
    }
    else if (data.code === "token_not_valid") {
      let dec = await refreshToken();
      console.log("dec", dec);
      if (dec) {
        return fetchOtp();
      } else {
        return false;
      }
    }
  };

  const handleClickOpen = () => {

    if (is2FAEnabled) {
      handleClickOpen2();

    }
    else {
      fetchOtp();
      setOpen(true);
    }
  };

  const handleClose = () => {
    setshowQRCode(false);
    setOpen(false);
  };

  console.log("otp", otp);



  return (
    <div>
      <button
        type="button"
        className="Button secondary"
        style={{ minWidth: 110 }}
        onClick={handleClickOpen}
      >
        Withdraw
      </button>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={showORCode}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-container": {
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
        }}
        PaperProps={{
          style: {
            width: "52%",
            maxWidth: "52%",
            height: "54%",
            maxHeight: "54%",
            margin: 0,
            padding: 0,
            borderRadius: 5,
          },
        }}
      >
        <div className={AuthenticatorCss.authenticator}>
          <DialogTitle id="alert-dialog-title">
            <div className={AuthenticatorCss.authenticator__title}>
              Google 2 factor Authentication
            </div>

            <div className={AuthenticatorCss.authenticator__qr}>
              <QRCode
                className={AuthenticatorCss.authenticator__qr__code}
                // value="hey i am rahul"
                value={qrCode}

                size={160}
              />
            </div>

            <h3 className={AuthenticatorCss.authenticator__description}>
              Scan the QR code with your Google Authenticator app
            </h3>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className={AuthenticatorCss.authenticator__questions}>
                <div
                  className={AuthenticatorCss.authenticator__questions__head}
                >
                  {/* style={{ fontSize: 20, fontWeight: "bold" }} */}
                  Steps to Setup Google 2 Factor Authentication
                </div>
                <ol
                  className={AuthenticatorCss.authenticator__questions__list}
                  type="1"
                >
                  {questionList.map((question) => {
                    return (
                      <li style={{ marginBottom: 10 }} key={question.key}>
                        {question.description}
                      </li>
                    );
                  })}

                  {/* <li style={{ marginBottom: 10 }}>
                    1. Android users download Google Authenticator from Google
                       Play Store
                  </li>
                  <li style={{ marginBottom: 10 }}>
                    2. IOS users download Google Authenticator from App Store
                  </li>
                  <li style={{ marginBottom: 10 }}>
                    3. Scan the QR code from the Google Authenticator app
                  </li>
                  <li style={{ marginBottom: 10 }}>
                    4. If you are unable to scan the QR code, enter the secret
                    key
                  </li>  */}
                  <h3
                    className={
                      AuthenticatorCss.authenticator__questions__secret
                    }
                  >
                    Download Authenticator App
                  </h3>
                </ol>
                <div
                  className={AuthenticatorCss.authenticator__questions__image}
                >
                  <img src="/assets/img/aboutus/android.png" />
                  <img src="/assets/img/aboutus/ios.png" />
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </div>
        <div className={AuthenticatorCss.authenticator__button}>
          {/* <Button
          className={AuthenticatorCss.authenticator__button__verify}
            onClick={handleClickOpen2}
            variant="contained"
            color="primary"
            // style={{
            //   width: 200,
            //   height: 50,
            //   background: "#2853c3",
            //   borderRadius: 5,
            //   color: "white",
            //   fontSize: 16,
            //   fontWeight: "bold",
            //   // marginTop: 20,
            //   marginBottom: 20,
            //   textTransform: "none",
            // }}
          >
            Verify
          </Button> */}
          <button
            className={AuthenticatorCss.authenticator__button__verify}
            onClick={handleClickOpen2}
            type="button"
            style={{ minWidth: 110 }}
          >
            Verify
          </button>
        </div>
      </Dialog>
      <Dialog
          open={open2}
          onClose={handleClose2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "flex-start",
              alignItems: "flex-start",
            },
          }}
          PaperProps={{
            style: {
              padding: 5,
              borderRadius: 10,
            },
          }}
        >
          <DialogTitle
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
            }}
            id="alert-dialog-title"
          >
            {"Google Two Factor Authentication"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                separator={<span>-</span>}
                isInputNum={true}
                inputStyle={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: 10,
                  border: "1px solid #E5E5E5",
                  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#9B9B9B",
                  textAlign: "center",
                  margin: 10,
                }}
              />
            </DialogContentText>
          </DialogContent>
          {/* <DialogActions> */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              disabled={otp.length < 6}
              onClick={submitOtp}
              // color={otp.length < 6 ? "disabled" : "primary"}
              variant="contained"
              // onSubmit={submitOtp}
              autoFocus
              style={{
                color: otp.length < 6 ? "disabled" : "white",
                background: otp.length < 6 ? "#E5E5E5" : "#2853c3",
                borderRadius: 4,
                minWidth: 10,
                marginBottom: 20,
                width: 200,
                height: 40,
                textTransform: "none",
                fontSize: 16,
              }}
            >
              2-Step Verification
            </Button>
            <div>
            {error && (
              <div
                style={{  
                  color: "red",
                  fontSize: 12,
                  fontWeight: "bold",
                  marginLeft: 10,
                }}
              >
                Invalid OTP
              </div>
            )}
            </div>
          </div>
          {/* </DialogActions> */}
        </Dialog>
    </div>
  );
}
