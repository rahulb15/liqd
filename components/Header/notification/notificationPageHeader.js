import { Fragment, useContext, useEffect, useState } from "react";
import Loader from "../../Loader";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import NotificationCss from "../../../styles/modular/Notification.module.css";

export default function NotificationPageHeader(props) {
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(
    // new Date(fromDate.getTime() + 3600 * 24 * 1000)
    null
  );
  const [selectData, setSelectData] = useState("All");
  const [values, setValues] = useState({
    search: "",
  });

  console.log(props);

  props.selectFunction(selectData);
  props.searchFunction(values.search);




  function filterByDate(fromD = null, toD = null) {
    let from = fromDate;
    let to = toDate;
    if (fromD) {
      from = fromD;
    }
    if (toD) {
      to = toD;
    }
    console.log(to);
    // let temp = data.filter((e) => {
    //   let date = new Date(e.date);
    //   date.setHours(0, 0, 0, 0);
    //   from.setHours(0, 0, 0, 0);
    //   to.setHours(0, 0, 0, 0);
    //   return date >= from && date < to;
    // });
    // console.log(temp);
  }

  function handleDateChange(t, side) {
    console.log(t);
    switch (side) {
      case "from":
        setFromDate(t);
        filterByDate(t, null);
        break;
      case "to":
        setToDate(t);
        filterByDate(null, t);
        break;
    }
  }
  function resetFilter() {
    let date = new Date();
    setFromDate(date);
    let toDate = new Date();
    toDate.setDate(date.getDate() + 1);
    setToDate(toDate);
    console.log("to date", toDate, " from date ", date);
    setSelectData("All");
    setValues({
      search: "",
    });
    setFromDate(null);
    setToDate(null);
  }

  console.log("selectData", selectData);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  console.log(values);

  const html = (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <main>
          <section
            className="TransactionsPage customd"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginTop: "20px",
              height: "10vh",
              border: "1px solid #e0e0e0",
              backgroundColor: "white",
              borderRadius: "3px",
            }}
          >
            <aside>
              <div
                className="Filter"
                style={{
                  display: "flex",
                  flexFlow: "wrap",
                  alignItems: "center",
                  justifyContent: "space-around",
                  baclgroundColor: "white",
                }}
              >
                <div
                  className="FilterSearch">
                  <input
                    type="text"
                    placeholder="Search"
                    className="border-2 w-full p-2 rounded-[5px]"
                    onChange={handleChange("search")}
                    value={values.search}
                  />
                </div>

                <div
                  className="FilterDate">
                  <fieldset>
                    <div className="DateRangeBox pt-10">
                      <div className="DateRangePicker DateRangePicker_1">
                        <div>
                          <div className="DateRangePickerInput DateRangePickerInput_1">
                            <MobileDatePicker
                              label="From Date"
                              inputFormat="dd/MM/yyyy"
                              value={fromDate}
                              onChange={(v) => handleDateChange(v, "from")}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                            <div
                              className="DateRangePickerInput_arrow DateRangePickerInput_arrow_1"
                              aria-hidden="true"
                              role="presentation"
                            >
                              -
                            </div>
                            <MobileDatePicker
                              label="To Date"
                              inputFormat="dd/MM/yyyy"
                              value={toDate}
                              onChange={(v) => handleDateChange(v, "to")}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                            <button
                              className="DateRangePickerInput_calendarIcon DateRangePickerInput_calendarIcon_1"
                              type="button"
                              aria-label="Interact with the calendar and add the check-in date for your trip."
                            >
                              <svg
                                className="DateRangePickerInput_calendarIcon_svg DateRangePickerInput_calendarIcon_svg_1"
                                focusable="false"
                                viewBox="0 0 1393.1 1500"
                              >
                                <path d="m107 1393h241v-241h-241zm295 0h268v-241h-268zm-295-295h241v-268h-241zm295 0h268v-268h-268zm-295-321h241v-241h-241zm616 616h268v-241h-268zm-321-616h268v-241h-268zm643 616h241v-241h-241zm-322-295h268v-268h-268zm-294-723v-241c0-7-3-14-8-19-6-5-12-8-19-8h-54c-7 0-13 3-19 8-5 5-8 12-8 19v241c0 7 3 14 8 19 6 5 12 8 19 8h54c7 0 13-3 19-8 5-5 8-12 8-19zm616 723h241v-268h-241zm-322-321h268v-241h-268zm322 0h241v-241h-241zm27-402v-241c0-7-3-14-8-19-6-5-12-8-19-8h-54c-7 0-13 3-19 8-5 5-8 12-8 19v241c0 7 3 14 8 19 6 5 12 8 19 8h54c7 0 13-3 19-8 5-5 8-12 8-19zm321-54v1072c0 29-11 54-32 75s-46 32-75 32h-1179c-29 0-54-11-75-32s-32-46-32-75v-1072c0-29 11-54 32-75s46-32 75-32h107v-80c0-37 13-68 40-95s57-39 94-39h54c37 0 68 13 95 39 26 26 39 58 39 95v80h321v-80c0-37 13-69 40-95 26-26 57-39 94-39h54c37 0 68 13 94 39s40 58 40 95v80h107c29 0 54 11 75 32s32 46 32 75z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div
                  className="FilterSelect">
                  <fieldset>
                    <div className="SelectBox filter">
                      <div className="NotificationPage__container__header__filter">
                        <div className="NotificationPage__container__header__filter__select">
                          <Select
                            style={{
                              width: "280px",
                              height: "42.5px",
                              border: "1px solid #E5E5E5",
                              borderRadius: "5px",
                            }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectData}
                            onChange={(e) => setSelectData(e.target.value)}
                          >
                            <MenuItem value={"All"}>All</MenuItem>
                            <MenuItem value={"withdrawal"}>Withdrawal</MenuItem>
                            <MenuItem value={"topup"}>Topup</MenuItem>
                            <MenuItem value={"earn"}>Earn</MenuItem>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div className="resetButton mb-l">
                  <button className="Button primary" onClick={resetFilter}>
                    Reset
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </LocalizationProvider>
    </Fragment>
  );

  return loading ? <Loader setLoading={setLoading} /> : html;
}
