import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import { postReq } from "../../../Utils";
import { useToasts  } from "react-toast-notifications";
import { TRUE_LAYER_API_BASE_URL, TRUE_LAYER_CALLBACK_URL } from "../constants";

const boxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "auto",
    height: "95%",
    width: "75%",
    borderRadius: 4,
    boxShadow: 24,
    textAlign: "center",
    padding: "20px"
};

const PaymentModel = (props) => {
    const {
        currency,
        isOpen = false,
        setIsOpen,
        handleOnClose,
    } = props;

    const [amount, setAmount] = useState(0);
    const { addToast } = useToasts();

    const handleOnChange = (e) => {
        const value = e.target.value;
        setAmount(value);
    }

    const executePayment = async () => {
        const requestBody = {
            amount: amount * 100,
            currency: currency
        };
        const response = await postReq("tl/createPayment", requestBody, true);
        console.log("respo",response)
        // setIsOpen(false);
        setAmount(0);
        if (response?.data?.id) {
            const redirectURL = `${TRUE_LAYER_API_BASE_URL}/payments#payment_id=${response?.data?.id}&resource_token=${response?.data?.resource_token}&return_uri=${TRUE_LAYER_CALLBACK_URL}`;
            // const testUrl = "https://auth.truelayer.com/?response_type=code&client_id=rahul-1f5066&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=https://console.truelayer.com/redirect-page&providers=uk-ob-all%20uk-oauth-all";
            window.location.href = redirectURL;
            // window.location.href = testUrl;
        } else {
            const errorResponse = response.result;
            if (errorResponse?.data?.detail) {
                addToast(errorResponse?.data?.detail,{
                    autoDismiss:true,
                    appearance:"error"
                });
            } else {
                addToast("Oops! Something went wrong. Please try again later.",{
                    autoDismiss:true,
                    appearance:"error"
                });
            }
            console.error(errorResponse);
        }
    }

    return (
        // <Modal
        //     open={isOpen}
        //     onClose={() => {
        //         setAmount(0);
        //         handleOnClose();
        //     }}
        //     aria-labelledby="modal-modal-title"
        //     aria-describedby="modal-modal-description"
        // >
        //     <Box sx={boxStyle} className="items-center justify-center">
                <>
                    <h1 className="text-center my-3">Submit a payment request</h1>
                    <h3 className="my-2">For Coin : {currency ?? "-"}</h3>
                    <label className="mt-l">Currency</label>
                    <div className="TextBox m-4 w-5/5">
                        <input
                            type="text"
                            id="currency"
                            placeholder="Currency"
                            value={currency ?? ""}
                            readOnly
                        />
                    </div>

                    <label className="mt-l">Amount</label>
                    <div className="TextBox m-4 w-5/5">
                        <input
                            type="number"
                            id="currency"
                            placeholder="Amount"
                            value={amount}
                            onChange={handleOnChange}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => { executePayment() }}
                        className="Button primary my-5  w-1/5"
                    >
                        Send
                    </button>
                </>
        //     {/* </Box>
        // </Modal> */}
    );
}

export default PaymentModel;