import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBarAdmin from "../components/NavBarAdmin";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createPersonaOficial, searchOficialByPlaca, updateOficial } from "../services/OficialVialService";

function EditarOficialVial() {
    const MySwal = withReactContent(Swal);
    const [loading, setloading] = useState(true);
    const tipoUsuario = sessionStorage.getItem("idtipousuario");
    const navigate = useNavigate();
    let { search } = useLocation();
    const [alerta, setAlerta] = useState(false);
    const [oficialVial, setoficialVial] = useState({});
    const [wasUpdate, setwasUpdate] = useState(false);
    const [wasUpdateOficial, setwasUpdateOficial] = useState(false);
    const [modalIsOpenCancelar, setIsOpenCancelar] = useState(false);
    const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);


    //Actualizar persona de oficial
    const [oficialUpdatePer, setoficialUpdatePer] = useState({});



    const obtenerOficialVial = async (placa) => {
        return await searchOficialByPlaca(placa);
    };
    useEffect(() => {
        let query = new URLSearchParams(search);
        obtenerOficialVial(query.get("id")).then(
            response => {
                setoficialVial(response.data);
                setoficialUpdatePer(response.data.idpersonafk);
                setloading(false);
            }
        ).catch(error => {
            console.log(error);
        });
    }, []);
    const manejadorChange = (e) => {
        setwasUpdate(true);
        setoficialUpdatePer({
            ...oficialUpdatePer,
            [e.target.name]: e.target.value,
        });
    };
    const manejadorChangeOficial = (e) => {
        setwasUpdateOficial(true);
        setoficialVial({
            ...oficialVial,
            [e.target.name]: e.target.value,
        });

    };

    const actualizarOficialV = async () => {
        if (oficialUpdatePer.nombres === "" ||
            oficialUpdatePer.apellidop === "" ||
            oficialUpdatePer.apellidom === "" ||
            oficialUpdatePer.edad === 0 ||
            oficialUpdatePer.calle === "" ||
            oficialUpdatePer.colonia === "" ||
            oficialUpdatePer.municipio === "" ||
            oficialUpdatePer.telefono === "" ||
            oficialUpdatePer.correo === "" ||
            oficialUpdatePer.numcuenta === "" ||
            oficialUpdatePer.claveInterB === "" ||
            oficialUpdatePer.titularCuenta === "" ||
            oficialUpdatePer.banco === "" ||
            oficialVial.añosServicio === "" ||
            oficialVial.cuerpoOficial === "" ||
            oficialVial.tipoOficial === "") {
            return setAlerta(true);
        }
        let modificacion = "";
        if (wasUpdate) {
            let response = await createPersonaOficial(oficialUpdatePer);
            if (response.status === 200) {
                //console.log("Se Modifico al usuario con exito");
                modificacion = "per";
            } else {
                //console.log("No se Modifico al usuario");
                modificacion = "nop";
            };
        };
        if (wasUpdateOficial) {
            let response2 = await updateOficial(oficialVial);
            if (response2.status === 200) {
                //console.log("Se Modifico al usuario con exito");
                modificacion = modificacion + "uo";
            } else {
                //console.log("No se Modifico al usuario");
                modificacion = modificacion + "nu";
            };
        };
        alertaConfirmacion(modificacion);
    };
    const alertaConfirmacion = (resolucion) => {
        if (resolucion === "peruo" || resolucion === "per" || resolucion === "uo") {
            MySwal.fire({
                icon: "success",
                title: <p>Se ha modificado al oficial con exito!</p>,
            }).then(() => {
                navigate("/oficialesviales");
            });
        } else if (resolucion === "") {
            MySwal.fire({
                icon: "warning",
                title: <p>No modificaste nada!</p>,
            }).then(() => {
                navigate("/oficialesviales");
            });
        } else if (resolucion === "nopnu") {
            MySwal.fire({
                icon: "error",
                title: <p>No se puede en estos momentos!</p>,
            }).then(() => {
                navigate("/oficialesviales");
            });
        } else {
            MySwal.fire({
                icon: "error",
                title: <p>No se pudo modificar al oficial.</p>,
            }).then(() => {
                navigate("/oficialesviales");
            });
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
                <>
                    {
                        tipoUsuario === '5' ? (
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
                                                <div className="container text-center">
                                                    <label className="fs-3 fw-bold">Información personal del oficial</label>
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
                                                                maxLength="100"
                                                                name="nombres"
                                                                defaultValue={oficialUpdatePer?.nombres || ""}
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
                                                                defaultValue={oficialUpdatePer?.apellidop}
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
                                                                defaultValue={oficialUpdatePer?.apellidom}
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
                                                                defaultValue={oficialUpdatePer?.edad}
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
                                                                defaultValue={oficialUpdatePer?.calle}
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
                                                                defaultValue={oficialUpdatePer?.colonia}
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
                                                                defaultValue={oficialUpdatePer?.municipio}
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
                                                                defaultValue={oficialUpdatePer?.telefono}
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
                                                                defaultValue={oficialUpdatePer?.numcuenta}
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
                                                                defaultValue={oficialUpdatePer?.claveInterB}
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
                                                                defaultValue={oficialUpdatePer?.titularCuenta}
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
                                                                defaultValue={oficialUpdatePer?.banco}
                                                                onChange={(e) => manejadorChange(e)}
                                                            ></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <div className="container text-center mt-3">
                                                    <label className="fs-3 fw-bold">
                                                        Información del Oficial
                                                    </label>
                                                </div>
                                                <div className="form-group">
                                                    <label className="fs-5">Tipo de Oficial:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Tipo de oficial"
                                                        required
                                                        maxLength="20"
                                                        name="tipoOficial"
                                                        defaultValue={oficialVial?.tipoOficial}
                                                        onChange={(e) => manejadorChangeOficial(e)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="fs-5">Cuerpo al que pertenece el Oficial:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="Cuerpo al que pertenece el oficial"
                                                        required
                                                        maxLength="30"
                                                        name="cuerpoOficial"
                                                        defaultValue={oficialVial?.cuerpoOficial}
                                                        onChange={(e) => manejadorChangeOficial(e)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="fs-5">Años de servicio del Oficial:</label>
                                                    <input
                                                        type="number"
                                                        className="form-control mt-2"
                                                        placeholder="Años de servicio del oficial vial"
                                                        required
                                                        min="0"
                                                        max="70"
                                                        name="añosServicio"
                                                        defaultValue={oficialVial?.añosServicio}
                                                        onChange={(e) => manejadorChangeOficial(e)}
                                                    />
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
                                                Actualizar
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
                                                    navigate("/oficialesviales");
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
                                        <Modal.Body>¿Esta seguro de modificar al oficial?</Modal.Body>
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
                                                    actualizarOficialV();
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
                            </>
                        )
                    }
                </>
            )}
        </>
    );
};

export default EditarOficialVial;