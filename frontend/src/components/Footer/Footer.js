/* eslint-disable */
import React from "react";

// reactstrap components
import { Container } from "reactstrap";
// import { scrollTop } from "utility/Utils";

// const company = (process.env.REACT_APP_COM === 'sec' ? 'Securli Limited' : 'Netswitch Inc.')
const companyUrl = process.env?.REACT_APP_COMPANY_URL || "";
const company = process.env?.REACT_APP_COMPANY_NAME || "";

// const handleScrollToTop = (event) => {
//   event.preventDefault(); // Prevent the default behavior of the link
//   console.log("Scrolling to top...");
//   window.scrollTo({
//     top: 0,
//     behavior: "smooth", // Smooth scrolling
//   });
// };

function Footer() {
  return (
    <footer className="footer">
      {/* <a
        href="javascript:void(0)"
        className="back-to-top"
        onClick={(event) => handleScrollToTop(event)}
      >
        <i className="tim-icons icon-minimal-up"></i>
      </a> */}
      <Container fluid>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href={companyUrl}>
              {company}
            </a>
          </li>{" "}
          <li className="nav-item">
            <a
              className="nav-link"
              href={companyUrl}
            >
              About us
            </a>
          </li>{" "}
        </ul>

        <div className="copyright">
          © {new Date().getFullYear()}{" "}by{" "}
          <a href={companyUrl} target="_blank">
            {company}
          </a>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
