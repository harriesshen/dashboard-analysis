import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

const Header = (props) => {
  const [visible, setVisible] = useState(false);
  const { title, onClickRoute, logo, isMobile, menu } = props;
  const pathname = _.get(window, "location.pathname", "");
  return (
    <>
      <div id="header">
        <div className="title" onClick={() => onClickRoute("/")}>
          <div>{title}</div>
          <img src={logo} alt={title} className="logo" />
        </div>
        <div className="menu">
          {isMobile ? (
            <div className="icon-btn" onClick={() => setVisible(!visible)}>
              <Icon icon={faBars} className="icon" />
            </div>
          ) : (
            <ul className="flex-nav">
              {_.map(menu, (m, i) => {
                const active = pathname === "/" + m.key ? "active" : "";
                return (
                  <li key={`${m.key}-${i}`}>
                    <a className={active} onClick={() => onClickRoute(m)}>
                      {m.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div id="mobile-menu" className={visible ? "active" : "inactive"}>
        <ul className="flex-nav" style={{ display: visible ? "flex" : "none" }}>
          {_.map(menu, (m, i) => {
            const active = pathname === "/" + m.key ? "active" : "";
            return (
              <li
                key={`${m.key}-${i}`}
                className={active}
                onClick={() => onClickRoute(m)}
              >
                <a>{m.title}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  menu: PropTypes.array,
  isMobile: PropTypes.bool,
  onClickRoute: PropTypes.func,
};

Header.defaultProps = {
  title: "",
  menu: [],
  isMobile: false,
  onClickRoute: () => {},
};

export default Header;
