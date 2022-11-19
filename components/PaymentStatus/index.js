import React from 'react';
import HeaderMark from '../../marketing/HeaderMark';
import FooterMark from '../../marketing/FooterMark';


const statusMessageHandler = (status, paymentId = null) => {
    let msg = "";
    switch (status) {
        case "success":
            msg = "Your payment has been successfully completed.";
            break;
        case "failed":
            msg = "Your payment has been failed, please try again!";
            break;
        case "executed":
            msg = "Your payment has been accepted successfully. The payment will be executed by the bank.";
            break;
        case "exception":
            msg = `Something went wrong. Please try again later or contact us with your paymentId: ${ paymentId ?? ""}`;
            break;
        default:
            msg = "Your payment has been failed, please try again!";
            break;
    }
    return msg;
}

const PaymentStatus = (props) => {
    const {
        pageStatus,
        paymentId = null,
    } = props
    return (
        <>
            <HeaderMark />
            <section className="py-5 d-flex align-items-center justify-content-center">
                <div className="container-fluid">
                    <div className="row margin-row py-5 justify-content-center">
                        <div className="text-center">
                            <h2>{statusMessageHandler(pageStatus, paymentId)}</h2>
                        </div>
                    </div>
                </div>
            </section>
            <FooterMark />
        </>
    );
}

export default PaymentStatus;