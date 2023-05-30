import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarSupervisor from "../components/NavBarSupervisor";
import {
  cambiarEstatus,
  enviarCorreoReporte,
  getConductorInfo,
  getReporte,
  nuevaMulta,
} from "../services/ApiRest";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function RevisionReportes() {
  const navigate = useNavigate();
  let tipoUsuario = localStorage.getItem("idtipousuario");

  const [alerta, setAlerta] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);
  const [modalIsOpenRechazar, setIsOpenRechazar] = useState(false);
  let { search } = useLocation();
  const [reporte, setReporte] = useState({});
  const [tipoArchivo, setTipoArchivo] = useState("");
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [archivo, setArchivo] = useState("");
  const [datoConductor, setDatoConductor] = useState("");
  const [multa, setMulta] = useState({
    infraccion: "",
    razon: "",
    monto: "",
    estatus: false,
    idconductorfk: {
      idconductor: "",
    },
    idreportadorfk: { idpersona: "" },
    reportefk: { idreporte: "" },
    personal: { idpersonal: "" },
  });

  const obtenerReporte = async (id) => {
    return await getReporte(id);
  };
  const asignarUbicacion = (ubicacionReporte) => {
    let latitud = ubicacionReporte.split(",")[0];
    let longitud = ubicacionReporte.split(",")[1];
    setLatitud(latitud);
    setLongitud(longitud);
  };
  const manejadorChange = (e) => {
    setMulta({
      ...multa,
      [e.target.name]: e.target.value,
    });
  };
  const denegarReporte = () => {
    if (datoConductor === "" || multa.monto === "" || multa.razon === "") {
      return setAlerta(true);
    }
    cambiarEstatus(reporte.idreporte, "Rechazado")
      .then(enviarCorreoReporte(reporte.idreportadorfk.correo, false))
      .catch((error) => alert(error));
    navigate("/reportes");
  };
  const AceptarReporte = async (reporte) => {
    multa.idreportadorfk = reporte.idreportadorfk;
    multa.personal.idpersonal = "1";
    multa.reportefk.idreporte = reporte.idreporte;
    multa.infraccion = reporte.razon;
    if (datoConductor === "" || multa.monto === "" || multa.razon === "") {
      return setAlerta(true);
    }
    multa.idconductorfk = await getConductorInfo(
      datoConductor,
      datoConductor,
      datoConductor
    );
    nuevaMulta(multa).then(
      cambiarEstatus(reporte.idreporte, "Aceptado")
        .then()
        .catch((error) => console.error(error))
    );
    await enviarCorreoReporte(reporte.idreportadorfk.correo, true);
    navigate("/reportes");
  };

  useEffect(() => {
    let query = new URLSearchParams(search);
    obtenerReporte(query.get("id")).then((data) => {
      setReporte(data);
      setArchivo(data.evidencia);
      setTipoArchivo(data.evidencia.split(".")[1]);
      asignarUbicacion(data.ubicacion);
    });
  }, []);
  return (
    <>
      {tipoUsuario === "1" ? <NavBarSupervisor /> : <NavBarAdmin />}

      <div className="container">
        <div className="container text-center">
          <div className="row align-items-start">
            <div className="col">
              <ul className="list-group mt-4">
                <li className="list-group-item list-group-item-dark">Fecha</li>
                <li className="list-group-item list-group-item-secondary">
                  {reporte.fecha}
                </li>
              </ul>
              <ul className="list-group mt-4">
                <li className="list-group-item list-group-item-dark">
                  Direccion
                </li>
                <li className="list-group-item list-group-item-secondary">
                  {reporte.direccion}
                </li>
              </ul>
              <ul className="list-group mt-4">
                <li className="list-group-item list-group-item-dark">Razon</li>
                <li className="list-group-item list-group-item-secondary">
                  {reporte.razon}
                </li>
              </ul>
              <ul className="list-group mt-4">
                <li className="list-group-item list-group-item-dark">
                  Descripcion
                </li>
                <li className="list-group-item list-group-item-secondary">
                  {reporte.descripcion}
                </li>
              </ul>
            </div>
            <div className="col">
              <ul className="list-group mt-4">
                <li className="list-group-item list-group-item-dark">
                  Evidencia
                </li>
                <li className="list-group-item list-group-item-secondary">
                  {tipoArchivo === "mov" || tipoArchivo === "mp4" ? (
                    <div>
                      <video
                        style={{ width: 400, height: 340 }}
                        src={
                          "http://192.168.1.75:8080/images/" +
                          archivo +
                          "?path=reportes"
                        }
                        controls
                      />
                    </div>
                  ) : (
                    <img
                      style={{ width: 400, height: 340 }}
                      src={
                        "http://192.168.1.75:8080/images/" +
                        archivo +
                        "?path=reportes"
                      }
                      alt=""
                    />
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container text-center">
          <ul className="list-group mt-4">
            <li className="list-group-item list-group-item-dark">Ubicacion</li>
            <li className="list-group-item list-group-item-secondary">
              {" "}
              <div>
                {latitud === 0 ? (
                  <></>
                ) : (
                  <MapContainer
                    center={{ lat: latitud, lng: longitud }}
                    zoom={20}
                    style={{ height: 500, zIndex: 0 }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={{ lat: latitud, lng: longitud }} />
                  </MapContainer>
                )}
              </div>
            </li>
          </ul>
          <ul className="list-group mt-4">
            <li className="list-group-item list-group-item-dark">Formulario</li>
            <li className="list-group-item list-group-item-secondary">
              {alerta ? (
                <div className="alert alert-danger" role="alert">
                  Rellene todos los campos correctamente
                </div>
              ) : (
                <></>
              )}
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Conductor
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Num. Licencia,Tarjeta de circulacion o Placas"
                  onChange={(text) => {
                    setDatoConductor(text.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Monto
                </label>
                <input
                  type="numeric"
                  className="form-control"
                  name="monto"
                  id="exampleFormControlInput1"
                  placeholder="Monto de la multa"
                  onChange={(e) => manejadorChange(e)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Razon
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder="Escriba aqui..."
                  name="razon"
                  onChange={(e) => manejadorChange(e)}
                ></textarea>
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
                      Autorizar Reporte
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger mx-1"
                      onClick={() => {
                        setIsOpenRechazar(!modalIsOpenRechazar);
                      }}
                    >
                      Denegar reporte
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
            </li>
          </ul>
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
                navigate("/reportes");
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
          <Modal.Body>¿Esta seguro de aceptar el reporte?</Modal.Body>
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
                AceptarReporte(reporte);
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
          <Modal.Body>¿Esta seguro de rechazar el reporte?</Modal.Body>
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
                denegarReporte();
              }}
            >
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
      />
      <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
    </>
  );
}

export default RevisionReportes;
