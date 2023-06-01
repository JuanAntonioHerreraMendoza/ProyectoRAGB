import React, { useEffect, useState } from "react";
import NavBarSupervisor from "../components/NavBarSupervisor";
import NavBarAdmin from "../components/NavBarAdmin";
import { cambiarContraseña, enviarCodigo } from "../services/ApiRest";
import { validarContraseña } from "../services/Validaciones";
import { useNavigate } from "react-router-dom";

function Configuracion() {
  const navigate = useNavigate();
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const [show, setShow] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [alerta, setAlerta] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const manejadorContraseña = (codigo, contraseña) => {
    let checkPass = validarContraseña(contraseña);
    if (checkPass) {
      setAlerta(true);
      setMensajeError(checkPass);
      return;
    }
    cambiarContraseña(codigo, contraseña).then((res) => {
      if (!res) {
        setMensajeError("El codigo no coincide");
        setAlerta(true);
      }
      navigate("../home");
    });
  };

  return (
    <div className="configuracion text-center">
      {tipoUsuario === "1" ? <NavBarSupervisor /> : <NavBarAdmin />}
      <h1>Configuracion</h1>
      <div className="col mx-5">
        {alerta ? (
          <div className="alert alert-danger" role="alert">
            {mensajeError}
          </div>
        ) : (
          <></>
        )}
        <ul className="list-group mt-4">
          <li className="list-group-item list-group-item-dark">
            Cambiar contraseña
          </li>
          <li className="list-group-item list-group-item-secondary">
            Si desea cambiar la contraseña presione el boton para enviarle un
            codigo
            <br />
            <button
              className="btn btn-primary my-2"
              disabled={show}
              onClick={() => {
                setShow(true);
                //enviarCodigo(userInfo.idpersonafk.correo);
              }}
            >
              Cambiar contraseña
            </button>
            {show ? (
              <>
                <div class="container input-group mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Codigo"
                    aria-label="Codigo"
                    aria-describedby="basic-addon1"
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
                <div class="container input-group mb-3">
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Contraseña"
                    aria-label="Contraseña"
                    aria-describedby="basic-addon1"
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    manejadorContraseña(codigo, contraseña);
                  }}
                >
                  Confirmar
                </button>
              </>
            ) : (
              <></>
            )}
          </li>
          <button
            className="btn btn-secondary my-2"
            onClick={() => {sessionStorage.clear();navigate("../")}}
          >
            Cerrar sesión
          </button>
        </ul>
      </div>
    </div>
  );
}

export default Configuracion;
