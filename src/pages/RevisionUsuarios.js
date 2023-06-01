import React, { useEffect, useState } from "react";
import NavBarSupervisor from "../components/NavBarSupervisor";
import NavBarAdmin from "../components/NavBarAdmin";
import SinAcceso from "../components/SinAcceso";
import {
  aceptarUsuarioPosible,
  deleteUsuarioPosible,
  enviarCorreoUsuarioPosible,
  getUsuarioPosible,
} from "../services/ApiRest";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Carousel, Modal } from "react-bootstrap";

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
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);
  const [modalIsOpenRechazar, setIsOpenRechazar] = useState(false);
  let { search } = useLocation();

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

  useEffect(() => {
    let query = new URLSearchParams(search);
    obtenerUsuario(query.get("id"))
      .then((data) => setUsuarioPosible(data))
      .catch((e) => console.error(e));
  }, []);

  return (
    <>
      {tipoUsuario === "1" ? (
        <>
          <NavBarSupervisor />
          <div className="container">
            <div className="container text-center">
              <div className="col">
                <ul className="list-group mt-4">
                  <li className="list-group-item list-group-item-dark">
                    Fecha
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
                    aceptarUsuario(usuarioPosible).then(
                      navigate("/posiblesUsuarios")
                    );
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
                    denegarUsuario(
                      usuarioPosible.idposibleusuario,
                      usuarioPosible.correo
                    );
                    navigate("/posiblesUsuarios");
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
