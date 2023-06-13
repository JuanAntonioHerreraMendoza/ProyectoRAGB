import React, { useEffect, useState } from "react";
import NavBarSupervisor from "../components/NavBarSupervisor";
import NavBarAdmin from "../components/NavBarAdmin";
import SinAcceso from "../components/SinAcceso";
import {
  aceptarUsuarioPosible,
  deleteUsuarioPosible,
  enviarCorreoUsuarioPosible,
  getConductor,
  getConductorInfo,
  getUsuarioPosible,
} from "../services/ApiRest";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Carousel, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function RevisionUsuarios() {
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  const navigate = useNavigate();
  const [usuarioPosible, setUsuarioPosible] = useState({});
  const [usuario, setUsuario] = useState({
    usuario: "",
    contraseña: "",
    idpersonafk: {},
  });
  const [persona, setPersona] = useState({
    nombres: "",
    apellidop: "",
    apellidom: "",
    edad: "",
    calle: "",
    colonia: "",
    municipio: "",
    telefono: "",
    activo: true,
    numSuspenciones: 0,
    numcuenta: "",
    claveInterB: "",
    titularCuenta: "",
    banco: "",
    correo: "",
    tipousuariofk: {},
  });
  const [conductor, setConductor] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);
  const [modalIsOpenRechazar, setIsOpenRechazar] = useState(false);
  let { search } = useLocation();
  const MySwal = withReactContent(Swal);

  const obtenerUsuario = async (id) => {
    return await getUsuarioPosible(id);
  };

  const denegarUsuario = (id, correo) => {
    deleteUsuarioPosible(id).then(enviarCorreoUsuarioPosible(correo, false));
  };
  const aceptarUsuario = async (usuarioP) => {
    persona.nombres = usuarioP.nombres;
    persona.apellidop = usuarioP.apellidop;
    persona.apellidom = usuarioP.apellidom;
    persona.calle = usuarioP.calle;
    persona.colonia = usuarioP.colonia;
    persona.municipio = usuarioP.municipio;
    persona.telefono = usuarioP.telefono;
    persona.correo = usuarioP.correo;
    persona.claveInterB = usuarioP.claveInterB;
    persona.titularCuenta = usuarioP.titularCuenta;
    persona.banco = usuarioP.banco;
    persona.tipousuariofk = usuarioP.tipousuariofk;
    usuario.usuario = usuarioP.correo;
    usuario.contraseña = usuarioP.contraseña;
    usuario.idpersonafk = persona;

    await aceptarUsuarioPosible(usuario).then(
      enviarCorreoUsuarioPosible(usuarioP.correo, true)
    );
  };

  function alerta(resolucion) {
    if (resolucion) {
      MySwal.fire({
        icon: "success",
        title: <p>Se ha autorizado con exito al usuario</p>,
      }).then(() => {
        navigate("/posiblesUsuarios");
      });
    } else {
      MySwal.fire({
        icon: "error",
        title: <p>Se ha rechazado con exito al usuario</p>,
      }).then(() => {
        denegarUsuario(usuarioPosible.idposibleusuario, usuarioPosible.correo);
        navigate("/posiblesUsuarios");
      });
    }
  }

  useEffect(() => {
    let query = new URLSearchParams(search);
    obtenerUsuario(query.get("id"))
      .then((data) => {
        setUsuarioPosible(data);
        if (data.tipousuariofk.idtipousuario === 2) {
          getConductorInfo(data.datoconductor, data.datoconductor, "").then(
            (res) => setConductor(res)
          );
        }
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <>
      {tipoUsuario === "1" ? (
        <>
          <NavBarSupervisor />
          <div className="container">
            <div className="container text-center">
              <h3>Datos de conductor</h3>
              <div className="col">
                <ul className="list-group mt-4">
                  <li className="list-group-item list-group-item-dark">
                    Imagenes
                  </li>
                  <li className="list-group-item list-group-item-secondary">
                    <Carousel>
                      <Carousel.Item>
                        <img
                          style={{ width: 400, height: 340 }}
                          src={
                            "http://192.168.1.75:8080/images/" +
                            usuarioPosible.imagen1 +
                            "?path=imagesRegistro"
                          }
                          alt=""
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          style={{ width: 400, height: 340 }}
                          src={
                            "http://192.168.1.75:8080/images/" +
                            usuarioPosible.imagen2 +
                            "?path=imagesRegistro"
                          }
                          alt=""
                        />
                        <Carousel.Caption></Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                  </li>
                </ul>
              </div>
              <div className="row align-items-start">
                <div className="col">
                  <ul className="list-group mt-4">
                    <li className="list-group-item list-group-item-dark">
                      Nombres
                    </li>
                    <li className="list-group-item list-group-item-secondary">
                      {usuarioPosible.nombres}
                    </li>
                  </ul>
                  <ul className="list-group mt-4">
                    <li className="list-group-item list-group-item-dark">
                      Apellido paterno
                    </li>
                    <li className="list-group-item list-group-item-secondary">
                      {usuarioPosible.apellidop}
                    </li>
                  </ul>
                  <ul className="list-group mt-4">
                    <li className="list-group-item list-group-item-dark">
                      Apellido materno
                    </li>
                    <li className="list-group-item list-group-item-secondary">
                      {usuarioPosible.apellidom}
                    </li>
                  </ul>
                  <ul className="list-group mt-4">
                    <li className="list-group-item list-group-item-dark">
                      Edad
                    </li>
                    <li className="list-group-item list-group-item-secondary">
                      {usuarioPosible.edad}
                    </li>
                  </ul>
                  <ul className="list-group mt-4">
                    <li className="list-group-item list-group-item-dark">
                      Calle
                    </li>
                    <li className="list-group-item list-group-item-secondary">
                      {usuarioPosible.calle}
                    </li>
                  </ul>
                  <ul className="list-group mt-4">
                    <li className="list-group-item list-group-item-dark">
                      Colonia
                    </li>
                    <li className="list-group-item list-group-item-secondary">
                      {usuarioPosible.colonia}
                    </li>
                  </ul>
                </div>
                <div className="col">
                  <div className="container text-center">
                    <ul className="list-group mt-4">
                      <li className="list-group-item list-group-item-dark">
                        Municipio
                      </li>
                      <li className="list-group-item list-group-item-secondary">
                        {usuarioPosible.municipio}
                      </li>
                    </ul>
                    <ul className="list-group mt-4">
                      <li className="list-group-item list-group-item-dark">
                        Telefono
                      </li>
                      <li className="list-group-item list-group-item-secondary">
                        {usuarioPosible.telefono}
                      </li>
                    </ul>
                    <ul className="list-group mt-4">
                      <li className="list-group-item list-group-item-dark">
                        Titular de la cuenta
                      </li>
                      <li className="list-group-item list-group-item-secondary">
                        {usuarioPosible.titularCuenta}
                      </li>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Numero de cuenta
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {usuarioPosible.numcuenta}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Clave interbancaria
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {usuarioPosible.claveInterB}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Banco
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {usuarioPosible.banco}
                        </li>
                      </ul>
                    </ul>
                  </div>
                </div>
              </div>
              {usuarioPosible.tipousuariofk?.idtipousuario === 2 ? (
                <div className="row align-items-start">
                  <h3>Datos de conductor</h3>
                  <div className="col">
                    <div className="container text-center">
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Licencia
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {conductor.noLicencia}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Placas
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {conductor.numplacas}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Tarjeta de circulacion
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {conductor.tarjetaCirculacion}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col">
                    <div className="container text-center">
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Tipo de licencia
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {conductor.tipoLicencia}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Vigencia de licencia
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {conductor.vigLicencia}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Vigencia de tenencia
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {conductor.vigTenencia}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="my-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label d-md-flex justify-content-md-end fs-5 fw-bold"
                ></label>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-success mx-1"
                    onClick={() => {
                      setIsOpenAceptar(!modalIsOpenAceptar);
                    }}
                  >
                    Autorizar usuario
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mx-1"
                    onClick={() => {
                      setIsOpenRechazar(!modalIsOpenRechazar);
                    }}
                  >
                    Rechazar usuario
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsOpen(!modalIsOpen);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
            <Modal style={{ color: "black" }} show={modalIsOpen}>
              <Modal.Header>
                <Modal.Title>Confirmacion</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Esta seguro de cancelar la revision?</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(!modalIsOpen);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpen(!modalIsOpen);
                    navigate("/posiblesUsuarios");
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
              <Modal.Body>¿Esta seguro de aceptar este usuario?</Modal.Body>
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
                    aceptarUsuario(usuarioPosible).then(alerta(true));
                  }}
                >
                  Confirmar
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal style={{ color: "black" }} show={modalIsOpenRechazar}>
              <Modal.Header>
                <Modal.Title>Confirmacion</Modal.Title>
              </Modal.Header>
              <Modal.Body>¿Esta seguro de rechazar este usuario?</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsOpenRechazar(!modalIsOpenRechazar);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpenRechazar(!modalIsOpenRechazar);
                    alerta(false);
                  }}
                >
                  Confirmar
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </>
      ) : (
        <>
          <NavBarAdmin />
          <SinAcceso />
        </>
      )}
    </>
  );
}

export default RevisionUsuarios;
