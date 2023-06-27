import React, { useState } from "react";
//css
import "../assets/Login.css";
//servicios
import {
  cambiarContraseña,
  editarUsuario,
  login,
} from "../services/UsuarioService";
//libreria
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { validarContraseña } from "../services/Validaciones";
import {
  enviarCodigo,
  enviarCodigoSesionUsuario,
} from "../services/CorreoService";
import { existeUsuario } from "../services/UsuarioService";
import { existeCodigo } from "../services/NotificacionesService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Login() {
  let fechaHoy = new Date();
  const MySwal = withReactContent(Swal);
  const [showPassword, setshowPassword] = useState(false);
  const [showPassword2, setshowPassword2] = useState(false);
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
    setCodigo("");
    setInputsVacios(false);
    e.preventDefault();
    if (
      usuario.usuario !== "" &&
      usuario.contraseña !== "" &&
      existeUsuario(usuario.usuario)
    ) {
      //enviarCodigoUsuario(usuario.usuario);
      setModalOpen(true);
    } else {
      setInputsVacios(true);
    }
  };

  const enviarCodigoUsuario = async (correo) => {
    await enviarCodigoSesionUsuario(correo);
  };

  const enviarCodigoContraseña = async (correo) => {
    await enviarCodigo(correo);
  };

  const manejadorChange = (e) => {
    setusuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const manejadorBoton = async () => {
    setloading(true);
    let response = await login(usuario);
    if (response.status === 200) {
      if (
        fechaHoy.getTime() <
        Date.parse(
          JSON.stringify(response.data?.idpersonafk.fechasuspencion).split(
            "T"
          )[0]
        ) &&
        response.data?.idpersonafk.activo === false
      ) {
        return MySwal.fire({
          icon: "error",
          title: (
            <p>Tienes una suspencion hasta el dia: <br />
              {
                JSON.stringify(response.data.idpersonafk.fechasuspencion).split(
                  "T"
                )[0]
              }"
            </p>
          ),
        }).then(
          setloading(false)
        )
      }
      response.data.idpersonafk.activo = true;
      await editarUsuario(response.data);
      sessionStorage.setItem("userInfo", JSON.stringify(response.data));
      let tUsuario = response.data.tipousuariofk.idtipousuario;
      if (tUsuario === 4 || tUsuario === 5) {
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
    console.log(codigo + " " + contraseña);
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

                    <div className="input-group mb-3">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Contraseña"
                        name="contraseña"
                        onChange={(e) => manejadorChange(e)}
                      />
                      <button
                        className="btn btn-secondary"
                        type="button"
                        id="button-addon2"
                        onClick={() => {
                          setshowPassword(!showPassword);
                        }}
                      >
                        <ion-icon
                          name={showPassword ? "eye-off" : "eye"}
                        ></ion-icon>
                      </button>
                    </div>
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
                      //enviarCodigoContraseña(correo)
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
              contraseña:
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
                  type={showPassword2 ? "text" : "password"}
                  className="form-control"
                  placeholder="Contraseña"
                  name="contraseña"
                  onChange={(e) => setContraseña(e.target.value)}
                />
                <button
                  className="btn btn-secondary"
                  type="button"
                  id="button-addon2"
                  onClick={() => {
                    setshowPassword2(!showPassword2);
                  }}
                >
                  <ion-icon name={showPassword2 ? "eye-off" : "eye"}></ion-icon>
                </button>
              </div>
              <ul className="list-group">
                <li className="fs-6">La contraseña no puede tener espacios</li>
                <li className="fs-6">
                  La contraseña debe tener al menos una letra mayuscula
                </li>
                <li className="fs-6">
                  La contraseña debe tener al menos una letra minuscula
                </li>
                <li className="fs-6">
                  La contraseña debe tener al menos un digito
                </li>
                <li className="fs-6">
                  La contraseña debe tener al menos un caracter especial
                </li>
                <li className="fs-6">
                  La longitud de la contraseña debe esta entre 8 y 16 caracteres
                </li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setAlerta(false);
                  setMensajeError("");
                  setCodigo("");
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
