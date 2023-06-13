import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarDataSupervisor } from "./SidebarDataSupervisor";
import "../App.css";
import { IconContext } from "react-icons";

function NavBarSupervisor() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="sticky-top">
          <div className="navbar">
            <button className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </button>
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <button className="menu-bars">
                <AiIcons.AiOutlineClose />
              </button>
            </li>
            {SidebarDataSupervisor.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icons}
                    <span style={{marginLeft:"16px"}}>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default NavBarSupervisor;
