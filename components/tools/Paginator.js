import React, { Component } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

class Paginator extends Component {
    render() {
    let offeritems = this.props.itemslist;
    let lastpage = offeritems.total_pages - 1;
    //// PAGINATION /////////////////////
    const initialNumbers = [];
    for (let i = 1; i <= offeritems.total_pages && i < 6; i++) {
      initialNumbers.push(i);
    };

    const nearbyFivePages = [];
    for (let i = offeritems.page - 1; i <= offeritems.page + 3; i++) {
      nearbyFivePages.push(i);
    };

    const lastPages = [];
    for (let i = offeritems.total_pages - 5; i <= offeritems.total_pages; i++) {
      lastPages.push(i);
    };

    const initPageNumbers = initialNumbers.map(number => {
      return (
          <li 
          key={number}
          id={number}
           className={number - 1 === offeritems.page ? "page-item active" : "page-item"}>
          <a className="page-link" 
          onClick={() => this.props.selectNewPage(number)}
          >{number}</a>
        </li>
      );
    });

    const adjustedPageNumbers = nearbyFivePages.map(number => {
      return (
          <li 
          key={number}
          id={number}
           className={number - 1 === offeritems.page ? "page-item active" : "page-item"}>
          <a className="page-link" 
          onClick={() => this.props.selectNewPage(number)}
          >{number}</a>
        </li>
      );
    });

    const lastPageNumbers = lastPages.map(number => {
      return (
          <li 
          key={number}
          id={number}
           className={number - 1 === offeritems.page ? "page-item active" : "page-item"}>
          <a className="page-link" 
          onClick={() => this.props.selectNewPage(number)}
          >{number}</a>
        </li>
      );
    });
    if (offeritems.total_pages > 0)
    return (
            <div className="paginator-fontsize">
              <style jsx>
                {`
                .page-item:active {
                  background: ${this.props.primary} !important;
                  color: ${this.props.buttontexts} !important;
                }
                .page-item:hover {
                  background: ${this.props.primary} !important;
                  color: ${this.props.buttontexts} !important;
                }
                
                `}
              </style>
              
                {/****   Show initial pagination when total_pages is greater than 1 ******/}
                {offeritems.page < 5 ? 
                  <ul className="pagination flex-wrap">

                {/****   Show PREV button when page number is greater than 0 ******/}
                {offeritems.page > 0 ?  <li className="page-item">
                  <a className="page-link" aria-label="Previous"
                    onClick={() => this.props.prevPage(offeritems.page)}
                    style={{paddingRight: "12px", paddingLeft: "12px"}}>
                    <FaChevronLeft style={{fontSize: "0.8em"}} />
                  </a>
                </li> : null}
               
              
                {initPageNumbers}

                  {offeritems.total_pages > 7 ? <React.Fragment> 
                    <li 
                  className="page-item">
                    <a className="page-link"
                    onClick={() => this.props.pageSix()}
                    >
                    ...
                    </a>
                </li>

                <li 
                  className="page-item">
                    <a className="page-link"
                    onClick={() => this.props.lastPage(lastpage)}>
                      {offeritems.total_pages}
                    </a>
                </li></React.Fragment> : null}
               

                {/****   Show NEXT button when page number is smaller than total_pages ******/}
                {offeritems.page < offeritems.total_pages - 1 &&
                 offeritems.page !== offeritems.total_pages &&
                 offeritems.page < 5 ? 
                      <li className="page-item">
                      <a className="page-link" aria-label="Next"
                      onClick={() => this.props.nextPage(offeritems.page)}
                      style={{paddingRight: "12px", paddingLeft: "12px"}}>
                        <FaChevronRight style={{fontSize: "0.8em"}} />
                      </a>
                    </li>
                : null}
                </ul> : null }





                {/****   Show adjusted pagination when pages is greater than 5 ******/}
                {offeritems.page > 4 && 
                offeritems.page < lastpage - 5 &&
                lastpage > 9 ? 
                  <ul className="pagination flex-wrap">
     

                <li className="page-item">
                  <a className="page-link" aria-label="Previous"
                    onClick={() => this.props.prevPage(offeritems.page)}
                    style={{paddingRight: "12px", paddingLeft: "12px"}}>
                    <FaChevronLeft style={{fontSize: "0.8em"}} />
                  </a>
                </li>

                <li 
                  className="page-item">
                    <a className="page-link"
                    onClick={() => this.props.firstPage(offeritems.page)}>
                     1
                    </a>
                </li>
               
                <li 
                  className="page-item">
                    <a className="page-link">
                    ...
                    </a>
                </li>

                {adjustedPageNumbers}

                <li 
                  className="page-item">
                    <a className="page-link">
                    ...
                    </a>
                </li>

                <li 
                  className="page-item">
                    <a className="page-link"
                    onClick={() => this.props.lastPage(lastpage)}>
                      {offeritems.total_pages}
                    </a>
                </li>
 
                <li className="page-item">
                <a className="page-link" aria-label="Next"
                onClick={() => this.props.nextPage(offeritems.page)}
                style={{paddingRight: "12px", paddingLeft: "12px"}}>
                  <FaChevronRight style={{fontSize: "0.8em"}} />
                </a>
              </li>


            
                </ul> : null }



                {/****   Pagination when it's 7 pages before the final page ******/}
                {offeritems.page > 4 &&
                 offeritems.page > lastpage - 6 ? 
                  <ul className="pagination flex-wrap">

                {/****   Show PREV button when page number is greater than 0 ******/}
                {offeritems.page > 0 ?  <li className="page-item">
                  <a className="page-link" aria-label="Previous"
                    onClick={() => this.props.prevPage(offeritems.page)}
                    style={{paddingRight: "12px", paddingLeft: "12px"}}>
                    <FaChevronLeft style={{fontSize: "0.8em"}} />
                  </a>
                </li> : null}
                {offeritems.total_pages > 8 ? <React.Fragment>
                  <li 
                  className="page-item">
                    <a className="page-link"
                    onClick={() => this.props.firstPage(offeritems.page)}>
                     1
                    </a>
                </li>
                <li 
                  className="page-item">
                    <a className="page-link"
                     onClick={() => this.props.minusSix(lastpage)}>
                    ...
                    </a>
                </li>
                </React.Fragment>:null}
               

              
                {lastPageNumbers}

 
                </ul> : null }





            </div> 
        )
      else return null
    }
}

export default Paginator;
