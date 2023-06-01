import React, { useState } from "react";
//css
import "../assets/Login.css";
//servicios
import { login } from "../services/UsuarioService";
//libreria
import { useNavigate } from "react-router-dom";

function Login() {
  const [usuario, setusuario] = useState({
    usuario: "",
    contraseña: "",
  });

  const [error, seterror] = useState({
    error: false,
    errorMsg: "",
  });

  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const mandejadorSubmit = (e) => {
    e.preventDefault();
    manejadorBoton();
    setloading(true);
  };

  const manejadorChange = (e) => {
    setusuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const manejadorBoton = async () => {
    let response = await login(usuario);
    if (response.status === 200) {
      sessionStorage.setItem("userInfo", JSON.stringify(response.data));
      let tUsuario = response.data.tipousuariofk.idtipousuario;
      if (tUsuario === 1 || tUsuario === 2) {
        sessionStorage.setItem("idusuario", response.data.idusuarios);
        sessionStorage.setItem(
          "idpersona",
          response.data.idpersonafk.idpersona
        );
        sessionStorage.setItem(
          "idtipousuario",
          response.data.tipousuariofk.idtipousuario
        );
        setloading(false);
        navigate("/home",{state:{logeado:true}});
      } else {
        seterror({
          error: true,
          errorMsg: "Error: Usuario no encontrado",
        });
        setloading(false);
      }
    } else if (response === "errorConexion") {
      seterror({
        error: true,
        errorMsg: "Error: Ocurrio un problema",
      });
      setloading(false);
    } else if (response === "UYCI") {
      seterror({
        error: true,
        errorMsg: "Usuario y/o Constraseña Incorrectos",
      });
      setloading(false);
    } else {
      seterror({
        error: true,
        errorMsg: "Usuario y/o Constraseña Incorrectos",
      });
      setloading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div>
          <div className="hijo">
            <span className="loader"></span>
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default Login;
