import React, { useState } from "react";
//css
import "../assets/Login.css";
//servicios
import { login } from "../services/UsuarioService";
//libreria
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import {
  cambiarContraseña,
  enviarCodigo,
  existeCodigo,
  existeUsuario,
} from "../services/ApiRest";
import { validarContraseña } from "../services/Validaciones";

function Login() {
  const [modal, setModalOpen] = useState(false);
  const [modalContraseña, setModalContraseña] = useState(false);
  const [modalCambioContraseña, setmodalCambioContraseña] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [inputsVacios, setInputsVacios] = useState(false);
  const [codigoAlerta, setCodigoAlerta] = useState(false);
  const [alerta, setAlerta] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [codigo, setCodigo] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
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
    setInputsVacios(false);
    e.preventDefault();
    if (usuario.usuario !== "" && usuario.contraseña !== "") {
      //enviarCodigoUsuario(usuario.usuario);
      setModalOpen(true);
    } else {
      setInputsVacios(true);
    }
  };

  const enviarCodigoUsuario = async (correo) => {
    await enviarCodigo(correo);
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
        navigate("/home", { state: { logeado: true } });
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

  const manejadorContraseña = (codigo, contraseña) => {
    console.log(codigo+" "+contraseña)
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
      } else {
        setmodalCambioContraseña(false);
      }
    });
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
                {inputsVacios ? (
                  <div className="alert alert-danger" role="alert">
                    Rellene todos los campos correctamente
                  </div>
                ) : (
                  <></>
                )}
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
                  <button
                    className="btn link-secondary"
                    onClick={() => {
                      setModalContraseña(true);
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal style={{ color: "black" }} show={modal}>
            <Modal.Header>
              <Modal.Title>Codigo de confirmacion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {codigoAlerta ? (
                <div className="alert alert-danger" role="alert">
                  No existe el codigo que escribiste
                </div>
              ) : (
                <></>
              )}
              Ingrese el codigo que se la enviado a su correo para iniciar
              sesion:
              <div className="input-group input-group-sm my-3">
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Escriba el codigo que se le envio..."
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value.toUpperCase());
                  }}
                  maxLength={6}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalOpen(!modal);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  existeCodigo(codigo).then((res) => {
                    if (res) {
                      setModalOpen(false);
                      manejadorBoton();
                    } else {
                      setCodigoAlerta(true);
                    }
                  });
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal style={{ color: "black" }} show={modalContraseña}>
            <Modal.Header>
              <Modal.Title>Cambio de contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Ingrese su usuario para enviarle un codigo para recuperar su
              contraseña:
              <div className="input-group input-group-sm my-3">
                <input
                  type="email"
                  required
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Escriba su usuario..."
                  onChange={(e) => {
                    setCorreo(e.target.value);
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalContraseña(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  existeUsuario(correo).then((res) => {
                    if (res) {
                      //enviarCodigoUsuario(correo)
                      setModalContraseña(false);
                      setmodalCambioContraseña(true);
                    }
                  });
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal style={{ color: "black" }} show={modalCambioContraseña}>
            <Modal.Header>
              <Modal.Title>Codigo de confirmacion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {alerta ? (
                <div className="alert alert-danger" role="alert">
                  {mensajeError}
                </div>
              ) : (
                <></>
              )}
              Ingrese el codigo que se la enviado a su correo para cambiar su
              contraseña
              <div className="input-group input-group-sm my-3">
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Escriba el codigo que se le envio..."
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value.toUpperCase());
                  }}
                  maxLength={6}
                />
              </div>
              <div className="input-group input-group-sm my-3">
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Escriba su nueva contraseña..."
                  onChange={(e) => {
                    setContraseña(e.target.value);
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setAlerta(false);
                  setMensajeError("");
                  setCodigo("")
                  setmodalCambioContraseña(!modalCambioContraseña);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setModalConfirmacion(true);
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal style={{ color: "black" }} show={modalConfirmacion}>
            <Modal.Header>
              <Modal.Title>Confirmacion</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Esta seguro de cambiar su contraseña?</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalConfirmacion(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  manejadorContraseña(codigo, contraseña);
                  setModalConfirmacion(false);
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default Login;
