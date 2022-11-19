import { Fragment, useContext, useState, useEffect } from "react";
import { logout, isLogged } from "../../Utils";
import { UserContext } from "../../contexts/UserContext";
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import SavingsIcon from "@mui/icons-material/Savings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Notification from "./notification/dropDownNotification";
import Notify from "../../pages/app/notification";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

export default function Header(props) {
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [User, setUser] = useContext(UserContext);
  const [isSuper, setIsSuper] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectData, setSelectData] = useState("Liqd");

  useEffect(() => {
    console.log("props location", props.location);
    console.log("props admin ", props.admin);
    if (User.logged) {
      console.log("User", User);

      if (User.isA && !User.isSuper && props.admin) {
        console.log("admin");
      } else if (User.isSuper && User.isA && props.admin) {
        setIsSuper(true);
        console.log("super admin");
      } else {
        console.log("not admin");
      }
    } else {
      console.log("need login");
      Router.push("/app/login");
    }
  }, [User]);
  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };
  const html = (
    <Fragment>
      {!props.admin && (
        <header id="Header">
          <section>
            <aside>
              <a className="logo">
                <img alt="Nexo" width={150} src="/assets/images/LIQD.png" />
              </a>
            </aside>
            <nav className="menu">
              <Link href="/app/profile">
                <a
                  className={props.location == "profile" ? "active" : ""}
                  aria-current="page"
                >
                  <i className="fa fa-th-list" />
                  <span>Account</span>
                </a>
              </Link>

              <Link href="/app/transaction">
                <a className={props.location == "transaction" ? "active" : ""}>
                  <i className="fa fa-history" />
                  <span>Transactions</span>
                </a>
              </Link>
              {/* <Link href="/app/exchange">
                <a
                  className={props.location == "exchange" ? "active" : ""}
                  aria-expanded="false"
                >
                  <i className="fa fa-exchange"></i>
                  <span>Exchange</span> */}
              {/* <i className="fas fa-caret-down" /> */}
              {/* </a>
              </Link> */}
              <Link href="/app/tickets">
                <a
                  className={props.location == "tickets" ? "active" : ""}
                  aria-expanded="false"
                >
                  <i className="fa fa-ticket"></i>
                  <span>Tickets</span>
                  {/* <i className="fas fa-caret-down" /> */}
                </a>
              </Link>
              {/* <a>
                <i className="fa fa-poll" />
                <span>Vote</span>
                <span className="HighlightLabel info" style={{ marginLeft: 8 }}>
                  Soon
                </span>
              </a> */}
            </nav>
            {menuOpen ? (
              <nav className="mobile_menu">
                <Link href="/app/profile">
                  <a
                    className={props.location == "profile" ? "active" : ""}
                    aria-current="page"
                  >
                    <i className="fa fa-th-list" />
                    <span>Account</span>
                  </a>
                </Link>

                <Link href="/app/transaction">
                  <a
                    className={props.location == "transaction" ? "active" : ""}
                  >
                    <i className="fa fa-history" />
                    <span>Transactions</span>
                  </a>
                </Link>
                {/* <Link href="/app/exchange">
                  <a
                    className={props.location == "exchange" ? "active" : ""}
                    aria-expanded="false"
                  >
                    <i className="fa fa-exchange"></i>
                    <span>Exchange</span> */}
                {/* <i className="fas fa-caret-down" /> */}
                {/* </a>
                </Link> */}
                <Link href="/app/tickets">
                  <a
                    className={props.location == "tickets" ? "active" : ""}
                    aria-expanded="false"
                  >
                    <i className="fa fa-ticket"></i>
                    <span>Tickets</span>
                    {/* <i className="fas fa-caret-down" /> */}
                  </a>
                </Link>
                {/* <a>
                <i className="fa fa-poll" />
                <span>Vote</span>
                <span className="HighlightLabel info" style={{ marginLeft: 8 }}>
                  Soon
                </span>
              </a> */}
              </nav>
            ) : (
              ""
            )}
            <aside>
              <button className="toggle_menu" onClick={handleToggle}>
                {menuOpen ? <MenuOpenIcon /> : <i className="fa fa-bars"></i>}
              </button>
              {/* <a
                className="NotificationsButton"
                aria-expanded="false"
                style={{ color: "#777d84" }}
                
              >
                <i className="fa fa-bell" />
              </a> */}
              <Notification />
              <a
                className="MenuHelp"
                aria-expanded="false"
                style={{ color: "#777d84" }}
                href="https://liqd.freshdesk.com/support/home"
                target={"_blank"}
              >
                <i className="fa fa-question-circle" />
              </a>

              <div
                className="dropdown-handler"
                onClick={() => setOpenUserDropdown(!openUserDropdown)}
              >
                <a className="MenuAccount" aria-expanded="false">
                  <i className="fa fa-user" />
                  <i className="fa fa-angle-down" />
                </a>
                {openUserDropdown && (
                  <div
                    data-tippy-root
                    id="tippy-9"
                    style={{
                      zIndex: 9999,
                      margin: 0,
                      position: "absolute",
                      bottom: -10,
                      inset: "0px auto auto 0px",
                      transform: "translate(-50%, 38px)",
                    }}
                  >
                    <div
                      className="Menu tippy-box light"
                      tabIndex={-1}
                      data-placement="bottom"
                      style={{ opacity: 1, transform: "translateY(0px)" }}
                    >
                      <div className="tippy-content">
                        <Link href="/app/profile">
                          <a>My Profile</a>
                        </Link>
                        {/*  <Link href="/app/secrity"><a>Security</a></Link> */}
                        <hr />
                        <a>English (EN)</a>
                        <hr />
                        <a onClick={() => logout(setUser)} data-dismiss="false">
                          <span>Logout</span>{" "}
                          <i className="fa fa-sign-out muted" />
                        </a>
                      </div>
                      <div
                        className="tippy-arrow"
                        style={{
                          position: "absolute",
                          left: 0,
                          transform: "translate(81px, 0px)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </section>
        </header>
      )}

      {props.admin && (
        <header id="Header">
          <section className="admin_header">
            <aside>
              {/* <Link href="/"> */}
              <a className="logo">
                <img alt="Nexo" width={150} src="/assets/images/LIQD.png" />
              </a>
              {/* </Link> */}
            </aside>
            <nav className="menu">
              <Link href="/panelad/users">
                <a
                  className={props.location == "users" ? "active" : ""}
                  aria-current="page"
                >
                  <i className="fa fa-user" />
                  <span>Users</span>
                </a>
              </Link>
              <Link href="/panelad/manageusers">
                <a
                  className={props.location == "manageusers" ? "active" : ""}
                  aria-current="page"
                >
                  <VerifiedIcon />
                  <span>Verification</span>
                </a>
              </Link>

              <Link href="/panelad/deposits">
                <a
                  className={props.location == "deposits" ? "active" : ""}
                  aria-current="page"
                >
                  <AccountBalanceWalletIcon />
                  <span>Deposits</span>
                </a>
              </Link>
              {isSuper && (
                <Link href="/panelad/coins">
                  <a
                    className={props.location == "coins" ? "active" : ""}
                    aria-current="page"
                  >
                    <CurrencyBitcoinIcon />
                    <span>Coins</span>
                  </a>
                </Link>
              )}
              <Link href="/panelad/tickets">
                <a
                  className={props.location == "tickets" ? "active" : ""}
                  aria-current="page"
                >
                  <i className="fa fa-ticket"></i>
                  <span>Tickets</span>
                </a>
              </Link>
              <Link href="/panelad/earn">
                <a
                  className={props.location == "earn" ? "active" : ""}
                  aria-current="page"
                >
                  {/* <PaidIcon/> */}
                  <i className="fa fa-sack-dollar"></i>
                  <span>Earn</span>
                </a>
              </Link>
              <Link href="/panelad/withdraw">
                <a
                  className={props.location == "withdraw" ? "active" : ""}
                  aria-current="page"
                >
                  {/* <i class="fa fa-money-bills"></i> */}
                  <MoneyOffIcon />
                  <span>Withdraw</span>
                </a>
              </Link>
              {/* <Link href="/panelad/anchorpanel">
          <a className={ props.location == "anchor" ? "active" : "" } aria-current="page">
          <i className="fa fa-user" />
          <span>Anchor</span>
        </a>
          </Link> */}
              <Link href="/panelad/transactions">
                <a
                  className={props.location == "transactions" ? "active" : ""}
                  aria-current="page"
                >
                  <i className="fa fa-history" />
                  <span>Transactions</span>
                </a>
              </Link>
              <Link href="/panelad/terms">
                <a
                  className={props.location == "terms" ? "active" : ""}
                  aria-current="page"
                >
                  <SavingsIcon />
                  <span>Terms</span>
                </a>
              </Link>
              {/* <Link href="/panelad/anchorpanel">
          <a className={ props.location == "anchor" ? "active" : "" } aria-current="page">
          <i className="fa fa-user" />
          <span>Anchor</span>
        </a>
          </Link> */}
              <div className="Filter">
                <div className="FilterSelect">
                  <fieldset
                    style={{
                      border: "none",
                    }}
                  >
                    <div className="SelectBox filter">
                      <div className="NotificationPage__container__header__filter">
                        <div className="NotificationPage__container__header__filter__select">
                          <Select
                            style={{
                              width: "180px",
                              height: "42.5px",
                              border: "1px solid #E5E5E5",
                              borderRadius: "5px",
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectData}
                            onChange={(e) => setSelectData(e.target.value)}
                          >
                            <MenuItem value={"Liqd"}>Liqd</MenuItem>
                            <MenuItem value={"Liqdex"}>Liqdex</MenuItem>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </nav>
            {menuOpen ? (
              <nav className="mobile_menu">
                <Link href="/panelad/users">
                  <a
                    className={props.location == "users" ? "active" : ""}
                    aria-current="page"
                  >
                    <i className="fa fa-user" />
                    <span>Users</span>
                  </a>
                </Link>
                <Link href="/panelad/manageusers">
                  <a
                    className={props.location == "manageusers" ? "active" : ""}
                    aria-current="page"
                  >
                    <VerifiedIcon />
                    <span>Verification</span>
                  </a>
                </Link>

                <Link href="/panelad/deposits">
                  <a
                    className={props.location == "deposits" ? "active" : ""}
                    aria-current="page"
                  >
                    <AccountBalanceWalletIcon />
                    <span>Deposits</span>
                  </a>
                </Link>
                {isSuper && (
                  <Link href="/panelad/coins">
                    <a
                      className={props.location == "coins" ? "active" : ""}
                      aria-current="page"
                    >
                      <CurrencyBitcoinIcon />
                      <span>Coins</span>
                    </a>
                  </Link>
                )}
                <Link href="/panelad/tickets">
                  <a
                    className={props.location == "tickets" ? "active" : ""}
                    aria-current="page"
                  >
                    <i className="fa fa-ticket"></i>
                    <span>Tickets</span>
                  </a>
                </Link>
                <Link href="/panelad/earn">
                  <a
                    className={props.location == "earn" ? "active" : ""}
                    aria-current="page"
                  >
                    {/* <PaidIcon/> */}
                    <i className="fa fa-sack-dollar"></i>
                    <span>Earn</span>
                  </a>
                </Link>
                <Link href="/panelad/withdraw">
                  <a
                    className={props.location == "withdraw" ? "active" : ""}
                    aria-current="page"
                  >
                    {/* <i class="fa fa-money-bills"></i> */}
                    <MoneyOffIcon />
                    <span>Withdraw</span>
                  </a>
                </Link>
                {/* <Link href="/panelad/anchorpanel">
          <a className={ props.location == "anchor" ? "active" : "" } aria-current="page">
          <i className="fa fa-user" />
          <span>Anchor</span>
        </a>
          </Link> */}
                <Link href="/panelad/transactions">
                  <a
                    className={props.location == "transactions" ? "active" : ""}
                    aria-current="page"
                  >
                    <i className="fa fa-history" />
                    <span>Transactions</span>
                  </a>
                </Link>
                <Link href="/panelad/terms">
                  <a
                    className={props.location == "terms" ? "active" : ""}
                    aria-current="page"
                  >
                    <SavingsIcon />
                    <span>Terms</span>
                  </a>
                </Link>
                {/* <Link href="/panelad/anchorpanel">
          <a className={ props.location == "anchor" ? "active" : "" } aria-current="page">
          <i className="fa fa-user" />
          <span>Anchor</span>
        </a>
          </Link> */}
              </nav>
            ) : (
              ""
            )}
            <aside>
              <button className="toggle_menu" onClick={handleToggle}>
                {menuOpen ? <MenuOpenIcon /> : <i className="fa fa-bars"></i>}
              </button>
              <a
                className="MenuAccount"
                onClick={() => logout(setUser)}
                aria-expanded="false"
              >
                <i className="fa fa-sign-out" /> <span>Logout</span>{" "}
              </a>
            </aside>
          </section>
        </header>
      )}
    </Fragment>
  );

  return html;
}
