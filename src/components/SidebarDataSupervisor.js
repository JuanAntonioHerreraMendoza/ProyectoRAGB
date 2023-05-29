import React from "react";
import * as AiIcons from "react-icons/ai";

export const SidebarDataSupervisor = [
  {
    title: "Inicio",
    path: "/home",
    icons: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Reportes",
    path: "/reportes",
    icons: <ion-icon name="flag"></ion-icon>, //<FaIcons.FaCartPlus/>,
    cName: "nav-text",
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    icons: <ion-icon name="people"></ion-icon>, //<IoIcons.IoIosPaper/>,
    cName: "nav-text",
  },
  {
    title: "Posibles Usuarios",
    path: "/posiblesUsuarios",
    icons: <ion-icon name="person-add"></ion-icon>,
    cName: "nav-text",
  },
  {
    title: "Configuracion",
    path: "/configuracion",
    icons: <ion-icon name="settings"></ion-icon>,
    cName: "nav-text",
  },
];
