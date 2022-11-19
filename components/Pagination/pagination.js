import { CollectionsOutlined } from "@material-ui/icons";
import React from "react";
// import notificationData from "../Header/notification/notificationData";

//pagination implementation using function
const Pagination = ({ data, RenderComponent, title, pageLimit, dataLimit, select, search }) => {
  const [pages] = React.useState(Math.round(data.length / dataLimit));
  const [currentPage, setCurrentPage] = React.useState(1);
  const [newData, setNewData] = React.useState([]);

  console.log("pages", pages);

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    const newData = data.slice(startIndex, endIndex);
    return data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    console.log("start", start);
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };
  
  const newDataArray = getPaginatedData();


  return (
    <div>
      {/* show the posts, 10 posts at a time */}
      <div className="dataContainer">
        {/* {getPaginatedData().map(
          (d, idx) => (
            console.log("d", d),
            console.log("idx", idx),
            (<RenderComponent key={idx} data={d} />)
          )
        )} */}
        <RenderComponent data={newDataArray} select={select} search={search} pageNumber={currentPage} />
      </div>

      {/* show the pagiantion
            it consists of next and previous buttons
            along with page numbers, in our case, 5 page
            numbers at a time
        */}
      <div
        className="pagination"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "300px",
          margin: "0 auto",
          marginTop: "20px",
        }}
      >
        {/* previous button */}
        <button
          onClick={goToPreviousPage}
          className={`prev ${currentPage === 1 ? "disabled" : ""}`}
        >
          PREVIOUS
        </button>

        {/* show page numbers */}
        {getPaginationGroup()
          .filter((item) => {
            if (item <= pages) {
              return item;
            }
          })
          .map((item, index) => (
            <button
              key={index}
              onClick={changePage}
              className={`paginationItem ${
                currentPage === item ? "active" : null
              }`}
              // style={{
              //   border: "1px solid #ccc",
              //   padding: "10px",
              //   margin: "10px",
              //   cursor: "pointer",
              //   borderRadius: "5px",
              // }}
              {...(currentPage === item ? { 
                
                style: { 
                backgroundColor: "#1e4dd8", 
                color: "white",
                border: "1px solid #ccc",
                paddingRight: "10px",
                paddingLeft: "10px",
                paddingTop: "5px",
                paddingBottom: "5px",
                margin: "10px",
                cursor: "pointer",
                borderRadius: "50px",
              } } : 
              {})}
            >
              <span
                {...(currentPage === item ? { style: { 
                  color: "white",
                } } : {})}
              >
                {item}
              </span>
            </button>
          ))}

        {/* ... */}
        {pages > pageLimit && <button className="paginationItem">...</button>}

        {/* max page number */}
        {pages > pageLimit && (
          <button
            onClick={changePage}
            className={`paginationItem ${
              currentPage === pages ? "active" : null
            }`}
          >
            <span>{pages}</span>
          </button>
        )}

        {/* next button */}
        <button
          onClick={goToNextPage}
          className={`next ${currentPage === pages ? "disabled" : ""}`}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default Pagination;
