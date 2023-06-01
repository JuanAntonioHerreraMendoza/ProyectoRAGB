import React from "react";
import SinAcceso from "../components/SinAcceso";
import NavBarSupervisor from "../components/NavBarSupervisor";
import NavBarAdmin from "../components/NavBarAdmin";


function Supervisor() {
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  return (
    <>
      {tipoUsuario === "5" ? (
        <>
          <NavBarAdmin />
          <div className="products">
            <h1>Supervisor</h1>
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

export default Supervisor;
