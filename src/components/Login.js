import React, { useState } from "react";
//css
import "../assets/Login.css";
//servicios
import { Apiurl } from "../services/ApiRest";
//libreria
import axios from "axios";

import { useNavigate } from "react-router-dom";

function Login() {
  const [usuario, setusuario] = useState({ usuario: "", contraseña: "" });

  const [error, seterror] = useState({ error: false, errorMsg: "" });

  const navigate = useNavigate();

  const mandejadorSubmit = (e) => {
    e.preventDefault();
    manejadorBoton();
  };

  const manejadorChange = (e) => {
    setusuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const manejadorBoton = () => {
    let url = Apiurl + "usuarios/login";
    axios
      .post(url, usuario)
      .then((response) => {
        if (response.status === 200) {
          let tUsuario = response.data.tipousuariofk.idtipousuario;
          if (tUsuario === 1) {
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            localStorage.setItem("idusuario", response.data.idusuarios);
            localStorage.setItem(
              "idpersona",
              response.data.idpersonafk.idpersona
            );
            localStorage.setItem(
              "idtipousuario",
              response.data.tipousuariofk.idtipousuario
            );
            navigate("/home");
          } else if (tUsuario === 2) {
            localStorage.setItem("idusuario", response.data.idusuarios);
            localStorage.setItem(
              "idpersona",
              response.data.idpersonafk.idpersona
            );
            localStorage.setItem(
              "idtipousuario",
              response.data.tipousuariofk.idtipousuario
            );
          } else {
            seterror({
              error: true,
              errorMsg: "Error: Usuario no encontrado",
            });
          }
          //console.log(response);
        } else {
          seterror({
            error: true,
            errorMsg: "Usuario y/o Constraseña Incorrectos",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        seterror({
          error: true,
          errorMsg: "Error: Ocurrio un problema",
        });
      });
  };

  return (
    <>
      <div className="container text-center">
        <div className="row align-items-start">
          <div className="col login-main-text">
            <h2>Supervisión Ciudadana "SuCi"</h2>
            <div className="icon-login">
              <ion-icon name="shield"></ion-icon>
            </div>
          </div>
          <div className="col">
            <div className="login-form">
              <form
                onSubmit={(event) => {
                  mandejadorSubmit(event);
                }}
              >
                <div className="form-group">
                  <label>Usuario: </label>
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    name="usuario"
                    placeholder="Email"
                    onChange={(e) => manejadorChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label>Contraseña: </label>
                  <br />
                  <input
                    type="password"
                    className="form-control"
                    name="contraseña"
                    placeholder="Contraseña"
                    onChange={(e) => manejadorChange(e)}
                  />
                </div>
                {error.error === true && (
                  <div className="alert alert-danger" role="alert">
                    {error.errorMsg}
                  </div>
                )}
                <br />
                <button type="submit" className="btn btn-black">
                  Iniciar Sesión
                </button>
              </form>
              <div>
                <br />
                <a className="suci-fondo" href="###">
                  ¿Olvidaste la contraseña?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
