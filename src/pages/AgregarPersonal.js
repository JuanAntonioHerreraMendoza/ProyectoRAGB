import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarAdmin from "../components/NavBarAdmin";
import "leaflet/dist/leaflet.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { createPersonaPersonal, createPersonal } from "../services/PersonalService";
import { createUsuario, existeUsuario } from "../services/UsuarioSevice";
import { validarContraseña } from "../services/Validaciones";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function AgregarPersonal() {
  const MySwal = withReactContent(Swal);
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  const navigate = useNavigate();

  const [modalIsOpenCancelar, setIsOpenCancelar] = useState(false);
  const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);
  const [alerta, setAlerta] = useState(false);
  const [errorConfirmPassword, seterrorConfirmPassword] = useState(false);
  const [errorPassword, seterrorPassword] = useState({
    errorPassword: false,
    errorMsg: "",
  });
  const [errorEmail, seterrorEmail] = useState({
    errorEmail: "",
    errorMsg: "",
  });


  const crearPersonal = async () => {
    if (personalCreatePer.nombres === "" ||
      personalCreatePer.apellidop === "" ||
      personalCreatePer.apellidom === "" ||
      personalCreatePer.edad === 0 ||
      personalCreatePer.calle === "" ||
      personalCreatePer.colonia === "" ||
      personalCreatePer.municipio === "" ||
      personalCreatePer.telefono === "" ||
      personalCreatePer.correo === "" ||
      personalCreatePer.numcuenta === "" ||
      personalCreatePer.claveInterB === "" ||
      personalCreatePer.titularCuenta === "" ||
      personalCreatePer.banco === "" || personalCreateUser.contraseña === "") {
      return setAlerta(true);
    }
    personalCreatePer.tipousuariofk = idtipousuario;
    let response = await createPersonaPersonal(personalCreatePer);
    personalCreateUser.idpersonafk.idpersona = response.data;
    personalCreateUser.tipousuariofk.idtipousuario = idtipousuario.idtipousuario;
    personalCreateUser.usuario = personalCreatePer.correo;
    let response2 = await createUsuario(personalCreateUser);
    //console.log(personalCreateUser);
    //console.log(response);
    personalCreate.idpersonafk.idpersona = response.data;
    personalCreate.tipousuariofk.idtipousuario = personalCreateUser.tipousuariofk.idtipousuario;
    //console.log(personalCreate);
    let reponse3 = await createPersonal(personalCreate);
    if (reponse3.status === 200 && response2.status === 200 && response.status === 200) {
      alertaConfirmacion(true);
    } else {
      alertaConfirmacion(false);
    }

  };

  //Agregar personal
  const [personalCreatePer, setpersonalCreatePer] = useState({
    nombres: "",
    apellidop: "",
    apellidom: "",
    edad: 0,
    calle: "",
    colonia: "",
    municipio: "",
    telefono: "",
    correo: "",
    numcuenta: "",
    activo: true,
    numSuspenciones: 0,
    claveInterB: "",
    titularCuenta: "",
    banco: "",
    imagenperfil: null,
    tipousuariofk: {
      idtipousuario: 0
    }
  });
  const [idtipousuario, setidtipousuario] = useState({
    idtipousuario: 4
  });
  const [personalCreateUser, setpersonalCreateUser] = useState({
    usuario: "",
    contraseña: "",
    idpersonafk: {
      idpersona: 0
    },
    tipousuariofk: {
      idtipousuario: 0
    }
  });
  const [personalCreate] = useState({
    idpersonafk: {
      idpersona: 0
    },
    tipousuariofk: {
      idtipousuario: 0
    }
  });

  const manejadorChange = (e) => {
    setpersonalCreatePer({
      ...personalCreatePer,
      [e.target.name]: e.target.value,
    });
  };

  const manejadorChangeTipoUsuario = (e) => {
    setidtipousuario({
      ...idtipousuario,
      [e.target.name]: e.target.value
    });
  };
  const manejadorChangePassword = (e) => {

    let checkPass = validarContraseña(e.target.value);
    if (checkPass) {
      seterrorPassword({
        errorPassword: true,
        errorMsg: checkPass,
      });

    } else {
      seterrorPassword({
        errorPassword: false,
      });
      setpersonalCreateUser({
        ...personalCreateUser,
        [e.target.name]: e.target.value
      });
    }

  };
  const manejadorChangeConfirmPassword = (e) => {
    if (e.target.value !== personalCreateUser.contraseña) {
      seterrorConfirmPassword(true);
    } else {
      seterrorConfirmPassword(false);
    }
  };

  let filterTimeout;
  const manejadorChangeCheckEmail = (e) => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(function async() {
      existeUsuario(e.target.value).then(
        respuesta => {
          if (respuesta.data) {
            seterrorEmail({
              errorEmail: "occupied",
              errorMsg: "El correo ya esta ocupado!",
            });
          } else {
            seterrorEmail({
              errorEmail: "",
            });
            setpersonalCreatePer({
              ...personalCreatePer,
              [e.target.name]: e.target.value,
            });
          }
        }
      ).catch(
        error => {
          console.log(error);
        }
      );
    }, 2000)
  };

  const alertaConfirmacion = (resolucion) => {
    if (resolucion) {
      MySwal.fire({
        icon: "success",
        title: <p>Se ha creado el personal con exito!</p>,
      }).then(() => {
        navigate("/supervisor");
      });
    } else {
      MySwal.fire({
        icon: "error",
        title: <p>No se ha podido crear el personal.</p>,
      }).then(() => {
        navigate("/supervisor");
      });
    }
  };

  return (
    <>
      {tipoUsuario === "5" ? (
        <>
          <NavBarAdmin />
          <div className="container">
            <form>
              <div className="form-row">
                {alerta ? (
                  <div className="alert alert-danger" role="alert">
                    Rellene todos los campos correctamente
                  </div>
                ) : (
                  <></>
                )}
                <fieldset>
                  <label className="fs-3 fw-bold">Registro de personal</label>
                  <div className="container text-center">
                    <label className="fs-3 fw-bold">Información personal</label>
                  </div>
                  <div className="row align-items-start">
                    <div className="col">
                      <div className="form-group">
                        <label className="fs-5">Nombre(s):</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Nombre o nombres"
                          required
                          name="nombres"
                          maxLength="100"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label className="fs-5">Apellido Paterno:</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Apellido Paterno"
                          required
                          maxLength="100"
                          name="apellidop"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label className="fs-5">Apellido Materno:</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Apellido Materno"
                          required
                          maxLength="100"
                          name="apellidom"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group ">
                        <label className="fs-5">Edad:</label>
                        <input
                          type="number"
                          className="form-control mt-2"
                          placeholder="Edad"
                          required
                          min="18"
                          max="100"
                          name="edad"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group ">
                        <label className="fs-5">Calle:</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Calle"
                          required
                          maxLength="100"
                          name="calle"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group ">
                        <label className="fs-5">Colonia:</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Colonia"
                          required
                          maxLength="100"
                          name="colonia"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label className="fs-5">Municipio:</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Municipio"
                          required
                          maxLength="100"
                          name="municipio"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label className="fs-5">Número de teléfono:</label>
                        <input
                          type="number"
                          className="form-control mt-2"
                          placeholder="Número de teléfono"
                          min="9000000000"
                          max="9999999999"
                          required
                          name="telefono"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label className="fs-5">
                          Número de cuenta bancaria:
                        </label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Num Cuenta Bancaria"
                          required
                          maxLength="20"
                          name="numcuenta"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label className="fs-5">Clave Interbancaria:</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Clave Interbancaria"
                          required
                          maxLength="18"
                          name="claveInterB"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label className="fs-5">Titular de la cuenta:</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Nombre del titutar de la cuenta"
                          required
                          maxLength="255"
                          name="titularCuenta"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label className="fs-5">Banco:</label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Nombre del banco"
                          required
                          maxLength="255"
                          name="banco"
                          onChange={(e) => manejadorChange(e)}
                        ></input>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mt-2">
                    <label className="fs-5">Tipo de usuario:</label>
                    <select
                      id="inputState"
                      name="idtipousuario"
                      className="form-control"
                      onChange={(e) => manejadorChangeTipoUsuario(e)}
                    >
                      <option value="4">Personal(Supervisor)</option>
                      <option value="5">Adminstrador</option>
                    </select>
                  </div>
                </fieldset>
                <fieldset>
                  <div className="container text-center mt-3">
                    <label className="fs-3 fw-bold">
                      Información de Usuario/Inicio de sesión
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="fs-5">Email:</label>
                    <input
                      type="email"
                      className="form-control "
                      placeholder="Correo electronico"
                      name="correo"
                      maxLength="50"
                      onChange={(e) => manejadorChangeCheckEmail(e)}
                    ></input>
                    {errorEmail.errorEmail === "occupied" && (
                      <div className="alert alert-danger" role="alert">
                        {errorEmail.errorMsg}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="fs-5">Contraseña:</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Contraseña"
                      title="La constraseña debe tener: 
                                        1 letra mayúscula
                                        1 letra minúscula
                                        1 dígito
                                        1 caracter especial"
                      name="contraseña"
                      onChange={(e) => manejadorChangePassword(e)}
                    />
                    {errorPassword.errorPassword === true && (
                      <div className="alert alert-danger" role="alert">
                        {errorPassword.errorMsg}
                      </div>
                    )}
                    <label className="fs-5">Ingresa de nuevo la contraseña:</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirmar contraseña"
                      onChange={(e) => manejadorChangeConfirmPassword(e)}
                    />
                    {errorConfirmPassword === true && (
                      <div className="alert alert-danger" role="alert">
                        Error las constraseñas no coiniciden!
                      </div>
                    )}
                  </div>
                </fieldset>
              </div>
              <div className="my-3 d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsOpenCancelar(!modalIsOpenCancelar);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setIsOpenAceptar(!modalIsOpenAceptar);
                  }}
                >
                  Crear Personal
                </button>
              </div>
            </form>

            <Modal style={{ color: "black" }} show={modalIsOpenCancelar}>
              <Modal.Header>
                <Modal.Title>Confirmacion</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Esta seguro de cancelar?</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsOpenCancelar(!modalIsOpenCancelar);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpenCancelar(!modalIsOpenCancelar);
                    navigate("/supervisor");
                  }}
                >
                  Confirmar
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal style={{ color: "black" }} show={modalIsOpenAceptar}>
              <Modal.Header>
                <Modal.Title>Confirmacion</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Esta seguro de agregar el nuevo usuario?</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsOpenAceptar(!modalIsOpenAceptar);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpenAceptar(!modalIsOpenAceptar);
                    crearPersonal();
                  }}
                >
                  Confirmar
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AgregarPersonal;