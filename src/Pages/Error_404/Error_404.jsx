import React from "react";
import { Link } from "react-router-dom";
import "./Error_404.scss";

const Error_404 = () => {
  return (
    <section className="Error_404" id="error">
      <h2>404 Error</h2>
      <h3>This Page Doesn't Exist</h3>
      <Link to="/">
        <p>Go back to Home</p>
      </Link>
    </section>
  );
};

export default Error_404;
