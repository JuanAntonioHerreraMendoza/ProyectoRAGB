import React from "react";
import NavBarSupervisor from "../components/NavBarSupervisor";
import NavBarAdmin from "../components/NavBarAdmin";
import SinAcceso from "../components/SinAcceso";

function Oficialesviales() {
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  return (
    <>
      {tipoUsuario === "5" ? (
        <>
          <NavBarAdmin />
          <div className="reports">
            <h1>Oficiales Viales</h1>
          </div>
        </>
      ) : (
        <>
          <NavBarSupervisor />
          <SinAcceso />
        </>
      )}
    </>
  );
}

export default Oficialesviales;
