import React from "react";

const Header = () => {
  return (
    <header>
      <div className="cbe-header-content">
        <div className="cbe-header-logo">
          <img src="/img/ABC-logo.png" alt="CBE logo" />
        </div>

        <div className="cbe-tool-title">
          <a href="/">Advanced Berkeley Comfort tool</a>
        </div>

        <nav className="cbe-header-nav">
          <a href="about.html">About</a>
          <a href="#">Documentation</a>
          <div className="cbe-tool-dropdown">
            <button className="dropbtn">
              More CBE Tools <i className="fa fa-sort"></i>
            </button>
            <div className="cbe-tool-dropdown-content">
              <a href="#">CBE Clima Tool</a>
              <a href="#">CBE Comfort Tool</a>
              <a href="#">CBE Fan Tool</a>
              <a href="#">pythermalcomfort</a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
