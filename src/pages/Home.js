import React from "react";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarSupervisor from "../components/NavBarSupervisor";

function Home() {
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  return (
    <>
      {tipoUsuario === "1" ? (
        <>
          <NavBarSupervisor />
          <div className="container text-center">
            <h2>Bienvenido {userInfo.idpersonafk.nombres}</h2>
          </div>
          <div className="container text-center">
            <h2>Supervisión Ciudadana "SuCi"</h2>
            <div className="container">
              <ion-icon
                name="shield"
                style={{ color: "#fefb64", fontSize: "200px" }}
              ></ion-icon>
            </div>
          </div>
        </>
      ) : (
        <>
          <NavBarAdmin />
          <div className="home">
            <h2>Bienvenido {userInfo.idpersonafk.nombres}</h2>
            <h2>{/* <ion-icon name="shield"></ion-icon> */}</h2>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
