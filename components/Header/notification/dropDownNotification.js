import React, { useEffect } from "react";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
// import Link from "@material-ui/core/Link";
import notificationData from "./notificationData";
import NotificationCss from "../../../styles/modular/Notification.module.css";
import Badge from '@material-ui/core/Badge';



const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  menu: {
        marginTop: 40,  
        marginLeft: -230,
        ['@media (max-width:600px)']: {
          marginLeft: -100,
        },
        ['@media (max-width:960px)']: {
          marginLeft: -150,
        },
        ['@media (max-width:1280px)']: {
          marginLeft: -80,
        },
        ['@media (max-width:1920px)']: {
          marginLeft: -100,
        },
  },
}));

export default function headerNotification() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [colorToggle, setColorToggle] = React.useState(false);
  const [notificationCount, setNotificationCount] = React.useState(10);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setColorToggle(true);
    setNotificationCount(0);

  };

  const handleClose = () => {
    setAnchorEl(null);
    setColorToggle(false);
  };

  const classes = useStyles();

  useEffect(() => {
    if (notificationCount === 0) {
      setColorToggle(false);
    }
  }, [notificationCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationCount(notificationCount + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [notificationCount]);



  return (
    <div>
      <Badge badgeContent={notificationCount} color="primary">
      <a
        className="NotificationsButton"
        aria-expanded="false"
        style={{ color: "#777d84" }}
        onClick={handleClick}
      >
        <i className="fa fa-bell" style={
          colorToggle ? { color: "#007bff" } : { }
          }></i>
      </a>
      </Badge>
      <Menu
      className={classes.menu}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        // style={{
        //   marginTop: 40,
        //   marginLeft: -230,
        // }}
      >
   
        <List
          className={classes.root}
          style={{
            width: 300,
            height: 510,
            overflow: "auto",
          }}
        >
          {notificationData.map((data) => (
            <div>
              {data.id <= 5 ? (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                          style={{ fontSize: 14, fontWeight: 550 }}
                        >
                          {data.head}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            <span>{data.body}</span>{" "}
                            <span style={{ color: "#263238", fontWeight: 600 }}>
                              {"$" + data.amount}
                            </span>{" "}
                          </Typography>
                          <br />
                          {data.date + ", " + data.time}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <hr
                    style={{
                      width: "100%",
                      color: "#ccc",
                      backgroundColor: "#ccc",
                      height: 1,
                      borderColor: "#ccc",
                    }}
                  />

                  {data.id === 5 ? (
                    <ListItem alignItems="flex-start">
                      <button
                        className="Button primary"
                        style={{
                          width: "100%",
                          height: 30,
                          marginTop: 10,
                          marginBottom: 10,
                          color: "#fff",
                          border: "none",
                          borderRadius: 5,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          window.location.href = "/app/notification";
                        }}
                      >
                        View All
                      </button>
                    </ListItem>
                  ) : null}
                </>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </List>
      </Menu>
    </div>
  );
}
