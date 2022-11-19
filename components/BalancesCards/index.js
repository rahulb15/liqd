import { Fragment, useEffect, useState } from "react";
import { req } from "../../Utils";
import { testResponse } from "./testResponseBalance";
import axios from "axios";

export default function BalancesCards() {
  const [balance, setBalance] = useState(0);
  const [interest, setInterest] = useState(0);
  const [currency, setCurrency] = useState({});

  async function currencyLayer(from, amount) {
    console.log("from", from);
    console.log("amount", amount);
    var myHeaders = new Headers();
    // myHeaders.append("apikey", "0J6V6VlaHwSAHRRqclsMnmvsSkH8yJTF");
    // myHeaders.append("apikey", "jq8db8CCbgx72OmqxdGBreKaHnBhSthH");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };
    // var date = new Date();
    // date =
    //   date.getFullYear() +
    //   "-" +
    //   (date.getMonth() + 1) +
    //   "-" +
    //   (date.getDate() - 1);

    await fetch(
      `https://api.apilayer.com/currency_data/live?source=EUR&currencies=USD%2CGBP`,
      // `https://api.apilayer.com/currency_data/live?from=USD,GBP&to=EUR`,
      // `https://api.apilayer.com/currency_data/convert?from=${from}&to=EUR&amount=${amount}&date=${date}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        let res = result;
        console.log("resCurrency",res);
        setCurrency(res);
        // return res;
      })
      .catch((error) => console.log("error line43", error));

    // const obj = {
    //   success: true,
    //   timestamp: 1668689103,
    //   source: "EUR",
    //   quotes: {
    //     EURUSD: 1.033415,
    //     EURGBP: 0.874962,
    //   },
    // };
    // setCurrency(obj);
  }
  console.log("currencyccccc", currency);

  // const fetchBalance = async () => {
  //   let resp = await req("balance");
  //   console.log("respBalance", resp);
  //   console.log("respBalance", testResponse);
  //   let sum = 0;
  //   let interest = 0;
  //   let from = null;
  //   let amount = 0;
  //   console.log("resp", resp);
  //   testResponse.map(async (element) => {
  //     // console.log('element',element);
  //     if (element.symbol == "EUR") {
  //       console.log("element", element);
  //       sum = sum + element.balance;
  //       interest += element.balance * element.interest;
  //       console.log("sumEUR", sum);
  //     } else {
  //       amount = element.balance;
  //       from = element.symbol;

  //       // Uncomment when live
  //       sum += amount;
  //       interest += amount * element.interest;
  //       // let value = JSON.parse(currency);
  //       let valueResult = currency;
  //       if (valueResult.success == true) {
  //         sum = sum + valueResult.result;
  //       }
  //       console.log("value  sum ", valueResult);
  //     }
  //   });
  //   setBalance(sum);
  //   setInterest(interest);
  //   console.log("sum = ", sum);
  //   // console.log("balance ", resp);
  // };

  const fetchBalance = async () => {
    let resp = testResponse;
    console.log("respBalance", resp);
    let sum = 0;
    let interest = 0;

    console.log("eeeee", currency.success);

    if (currency.success) {
      resp.map(async (element) => {
        console.log("elementAll", element);
        if (element.symbol == "EUR") {
          sum = sum + element.balance;
          interest += element.balance * element.interest;
          console.log("sumEUR", sum);
        } else if (element.symbol == "USD") {
          // let value = await currencyLayer(element.symbol, element.balance);
          // console.log("value", value);
          console.log("CheckRes", currency.quotes.EURUSD);
          let value = currency.quotes.EURUSD;
          sum = sum + element.balance / value;
          interest += element.balance * element.interest;
          console.log("sumUSD", sum);
        } else if (element.symbol == "GBP") {
          // let value = await currencyLayer(element.symbol, element.balance);
          // console.log("value", value);
          let value = currency.quotes.EURGBP;
          sum = sum + element.balance / value;
          interest += element.balance * element.interest;
          console.log("sumGBP", sum);
        }
      });
      setBalance(sum);
      setInterest(interest);
      console.log("sum = ", sum);
      // console.log("balance ", resp);
    } else {
      console.log("currencybbb", currency);
      currencyLayer();
    }
  };

  useEffect(() => {
    fetchBalance().then(console.log("balance ", balance));
  }, [currency]);

  useEffect(() => {
    console.log("currencyUseeffect", currency);
    setInterval(() => {
      currencyLayer();
    }, 360000);// 1 minute = 60000
  }, [currency]);
  const html = (
    <Fragment>
      <div className="AccountFinancialOverview">
        <div>
          <i className="fa fa-question-circle" />
          <h6>Portfolio Balance</h6>
          <div />
          <span>€{balance}</span>
        </div>
        {/* <div>
            <i className="fa fa-question-circle" />
            <h6>Credit Line</h6>
            <span className="tc-indigo-500">$0.00</span>
            <div />
            <h6>Available Credit</h6>
            <span className="tc-blue-500">$0.00</span>
          </div> */}
        <div>
          <i className="fa fa-question-circle" />
          <h6>Interest Earned</h6>
          <div />
          <span className="tc-mint-500">€{interest}</span>
        </div>
        {/* <div>
            <div
              className="LoyaltyBadge"
              style={{
                width: 60,
                height: 60,
                position: "absolute",
                top: 24,
                right: 24,
              }}
            >
              <img alt width={54} src="/assets/icons/ll-base.png" />
            </div>
            <h6>Loyalty Level</h6>
            <div />
            <span>Base</span>
            <a href="#" onClick={e => e.preventDefault()}>
              Upgrade to Silver Level <i className="fa fa-long-arrow-right" />
            </a>
          </div> */}
      </div>
    </Fragment>
  );

  return html;
}
