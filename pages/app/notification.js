import Head from "next/head";
import { Fragment, useContext, useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import NotificationCss from "../../styles/modular/Notification.module.css";
import notificationData from "../../components/Header/notification/notificationData";
import NotificationPageHeader from "../../components/Header/notification/notificationPageHeader";
import Pagination from "../../components/Pagination/pagination";
import ReactPaginate from 'react-paginate';



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 275,
  },
  margin: {
    margin: theme.spacing(1),
    marginTop: "30px",
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "43ch",
    height: "40px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  pos: {
    marginBottom: 12,
  },
  cardContentText: {
    fontSize: 14,
  },
  cardContent: {
    backgroundColor: "#fff",
    padding: "5px 30px",
    borderRadius: "3px",
    marginBottom: "20px",
    borderBottom: "1px solid #e6e6e6",
    height: "90px",
  },
}));



const CardContentOptions = (props) => {
  console.log("propsPagination",props.data)
  const classes = useStyles();
  // console.log("propsSearch",props.search);

  const notificationDataArray = notificationData;
  const notificationDataArray2 = props.data;

  // const randomNotificationData =
  //   notificationDataArray[
  //     Math.floor(Math.random() * notificationDataArray.length)
  //   ];
  // console.log("randomNotificationData", randomNotificationData);
  console.log("notificationDataArray", notificationDataArray);
  console.log("notificationDataArray2", notificationDataArray2);

 

  return (
    <>
      {notificationDataArray2.filter((notificationData) => {
        if (props.select === "All") {
          return notificationData;
        } else if (props.select === "withdrawal") {
          return notificationData.head === "Withdrawal"? notificationData : null;
        } else if (props.select === "topup") {
          return notificationData.head === "Top Up" ? notificationData : null;
        }
        else if (props.select === "earn") {
          return notificationData.head === "Earn" ? notificationData : null;
        }
      }).filter((notificationData) => {
        if (props.search === "") {
          return notificationData;
        } else if (
          notificationData.head
            .toLowerCase()
            .includes(props.search.toLowerCase())
        ) {
          return notificationData;
        }
        else if (
          notificationData.body
            .toLowerCase()
            .includes(props.search.toLowerCase())
        ) {
          return notificationData;
        }
        else if (
          notificationData.date
            .toLowerCase()
            .includes(props.search.toLowerCase())
        ) {
          return notificationData;
        }
        else if (
          notificationData.time
            .toLowerCase()
            .includes(props.search.toLowerCase())
        ) {
          return notificationData;
        }
      })
      .map((notificationData) => {
        return (
          <Card
          style={{
            boxShadow: "none",
          }
        }>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="#546e7a" gutterBottom>
              {notificationData.head}
            </Typography>
            <Typography
              className={classes.cardContentText}
              variant="body2"
              component="p"
            >
              <span>{notificationData.body}</span>{" "}
              <span style={{ color: "#263238", fontWeight: 600 }}>
                {"$" + notificationData.amount}
              </span>
              <br />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#546e7a",
                  // marginLeft: "10px",
                }}
              >
                {notificationData.date + ", " + notificationData.time}
              </span>
            </Typography>
          </CardContent>
        </Card>
        );
      }
      )
      }
    </>
  );
};
      



export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [select, setSelect] = useState("All");
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const handlePageClick = (data) => {
    let selected = data.selected;
    setPageNumber(selected);
  };


  const selectDataFromChild = (data) => {
    console.log("selectData",data);
    setSelect(data);
    return data;
  }
  const searchDataFromChild = (data) => {
    console.log("searchData",data);
    setSearch(data);
    return data;
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

        <title>Notification</title>
      </Head>
      <div id="liqid-platform" className="application">
        <Header location="notification" />
        <main>
          <section className="NotificationPage">
            <div>
              <div className="NotificationPage__container">
                <div className="NotificationPage__container__header">
                  <div
                    className="NotificationPage__container__header__title"
                    style={{
                      color: "#546e7a",
                      marginTop: "20px",
                    }}
                  >
                    <h1>Notifications</h1>
                  </div>
                </div>
              </div>

              <div className="liqidBenefits empty" />

              {<NotificationPageHeader selectFunction={selectDataFromChild} searchFunction={searchDataFromChild} />}

              <div className="card">
              <Pagination data={notificationData} RenderComponent={CardContentOptions} title="Notifications" pageLimit={5} dataLimit={7} select={select} search={search} />
                {/* {<CardContentOptions select={select} search={search} pageNumber={pageNumber} />} */}
                </div>
              {/* <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={50}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              /> */}

            </div>
          </section>
          <Footer />
        </main>
      </div>
    </Fragment>
  );

  return loading ? <Loader setLoading={setLoading} /> : html;
}
