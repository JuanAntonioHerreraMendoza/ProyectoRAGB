import React, { useEffect, useState } from "react";
import {
  enviarCorreoMulta,
  enviarNotificacionMulta,
  enviarNotificacionR,
  getMulta,
  pagarMulta,
} from "../services/ApiRest";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarSupervisor from "../components/NavBarSupervisor";
import NavBarAdmin from "../components/NavBarAdmin";
import SinAcceso from "../components/SinAcceso";
import { Button, Modal } from "react-bootstrap";

function RevisionMulta() {
  let { search } = useLocation();
  const navigate = useNavigate();
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  const [multa, setMulta] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);

  const obtenerMulta = async (id) => {
    return await getMulta(id);
  };

  const cobroMulta = async (multa) => {
    await pagarMulta(multa)
      .then(() => {
        enviarCorreoMulta(multa.idreportadorfk.correo)
          .then(
            enviarNotificacionMulta(multa.idreportadorfk.correo)
          )
          .catch((error) => alert(error));
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    let query = new URLSearchParams(search);
    obtenerMulta(query.get("id"))
      .then((data) => {
        setMulta(data);
      })
      .catch((error) => alert(error));
  }, []);

  return (
    <>
      {tipoUsuario === "1" ? (
        <>
          <NavBarSupervisor />{" "}
          <div className="container">
            <div className="container text-center">
              <h2>Revision de multa</h2>
              {/* Detalles del conductor */}
              <ul className="list-group mt-4 py-2 list-group-item-dark">
                <h5>Detalles del conductor</h5>
                <li className="list-group-item list-group-item-secondary">
                  <div className="row align-items-center">
                    <div className="col">
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Nombres
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.idpersonafk.nombres}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Apellido paterno
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.idpersonafk.apellidop}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Apellido materno
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.idpersonafk.apellidom}
                        </li>
                      </ul>
                    </div>
                    <div className="col">
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Tarjeta de circulacion
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.tarjetaCirculacion}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Placas
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.numplacas}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Numero de licencia
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.noLicencia}
                        </li>
                      </ul>
                    </div>
                    <div className="col">
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Tipo de licencia
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.tipoLicencia}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Vigencia de tenencia
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.vigTenencia}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Vigencia de licencia
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.idconductorfk?.vigLicencia}
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
              {/* Detalles de reporte */}
              <ul className="list-group mt-4 py-2 list-group-item-dark">
                <h5>Detalles del reporte</h5>
                <li className="list-group-item list-group-item-secondary">
                  <div className="row align-items-center">
                    <div className="col">
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Fecha
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.reportefk?.fecha}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Direccion
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.reportefk?.direccion}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Razon
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.reportefk?.razon}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Descripcion
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.reportefk?.descripcion}
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
              {/* Detalles de Multa */}
              <ul className="list-group mt-4 py-2 list-group-item-dark">
                <h5>Detalles de la multa</h5>
                <li className="list-group-item list-group-item-secondary">
                  <div className="row align-items-center">
                    <div className="col">
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Revisor
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.personalfk?.idpersonafk.nombres +
                            " " +
                            multa.personalfk?.idpersonafk.apellidop +
                            " " +
                            multa.personalfk?.idpersonafk.apellidom}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Infraccion
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.infraccion}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Razon
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          {multa.razon}
                        </li>
                      </ul>
                      <ul className="list-group mt-4">
                        <li className="list-group-item list-group-item-dark">
                          Monto
                        </li>
                        <li className="list-group-item list-group-item-secondary">
                          ${multa.monto}
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>

              <div className="my-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label d-md-flex justify-content-md-end fs-5 fw-bold"
                >
                  ¿Quiere proceder con la multa?
                </label>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-success mx-1"
                    onClick={() => {
                      setIsOpenAceptar(!modalIsOpenAceptar);
                    }}
                  >
                    Cobrar multa
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

              <Modal style={{ color: "black" }} show={modalIsOpen}>
                <Modal.Header>
                  <Modal.Title>Confirmacion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  ¿Esta seguro de cancelar el pago de la multa?
                </Modal.Body>
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
                      navigate("/multas");
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
                <Modal.Body>¿Esta seguro del pago de la multa?</Modal.Body>
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
                      cobroMulta(multa);
                      navigate("/multas");
                    }}
                  >
                    Confirmar
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
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

export default RevisionMulta;
