import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBarAdmin from "../components/NavBarAdmin";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { createPersonaPersonal, searchPersonalById, updatePersonal } from "../services/PersonalService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { findUsuario, updateUsuario } from "../services/UsuarioSevice";

function EditarPersonal() {
    const MySwal = withReactContent(Swal);
    const [loading, setloading] = useState(true);
    const tipoUsuario = sessionStorage.getItem("idtipousuario");
    const navigate = useNavigate();
    let { search } = useLocation();
    const [modalIsOpenCancelar, setIsOpenCancelar] = useState(false);
    const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);
    const [alerta, setAlerta] = useState(false);
    const [personal, setpersonal] = useState({});
    const [wasUpdate, setwasUpdate] = useState(false);
    const [wasUpdateTipoUsu, setwasUpdateTipoUsu] = useState(false);
    //Actualizar persona de personal
    const [personalUpdatePer, setpersonalUpdatePer] = useState({});
    const [usuarioUpdatePer] = useState({
        idusuarios: 0,
        usuario: "",
        contraseña: "",
        idpersonafk: { idpersona: 0 },
        tipousuariofk: { idtipousuario: 0 }
    });
    const [idtipousuario, setidtipousuario] = useState({
        idtipousuario: 4
    });

    const obtenerPersonal = async (id) => {
        return await searchPersonalById(id);
    };
    useEffect(() => {
        let query = new URLSearchParams(search);
        obtenerPersonal(query.get("id")).then(
            response => {
                setpersonal(response.data);
                setpersonalUpdatePer(response.data.idpersonafk);
                idtipousuario.idtipousuario = response.data.idpersonafk.tipousuariofk.idtipousuario;
                setloading(false);
            }
        ).catch(error => {
            console.log(error);
        });
    }, []);

    const manejadorChange = (e) => {
        setwasUpdate(true);
        setpersonalUpdatePer({
            ...personalUpdatePer,
            [e.target.name]: e.target.value,
        });
    };
    const manejadorChangeTipoUsuario = (e) => {
        setwasUpdate(true);
        setwasUpdateTipoUsu(true);
        setidtipousuario({
            ...idtipousuario,
            [e.target.name]: e.target.value
        });
    };

    const actualizarPersonal = async () => {
        let modificacion = "";
        if (wasUpdate) {
            if (personalUpdatePer.nombres === "" ||
                personalUpdatePer.apellidop === "" ||
                personalUpdatePer.apellidom === "" ||
                personalUpdatePer.edad === 0 ||
                personalUpdatePer.calle === "" ||
                personalUpdatePer.colonia === "" ||
                personalUpdatePer.municipio === "" ||
                personalUpdatePer.telefono === "" ||
                personalUpdatePer.correo === "" ||
                personalUpdatePer.numcuenta === "" ||
                personalUpdatePer.claveInterB === "" ||
                personalUpdatePer.titularCuenta === "" ||
                personalUpdatePer.banco === "") {
                return setAlerta(true);
            }
            //console.log("Se hizo una modificacion a la persona");
            if (wasUpdateTipoUsu) {
                //console.log("Se hizo una modificacion en el tipo de usuario");
                let resUsuario = await findUsuario(personalUpdatePer.correo);
                //setusuarioUpdatePer(respuestaUsu.data);
                //usuarioUpdatePer.tipousuariofk.idtipousuario = idtipousuario.idtipousuario;
                usuarioUpdatePer.idusuarios = resUsuario.data.idusuarios;
                usuarioUpdatePer.usuario = resUsuario.data.usuario;
                usuarioUpdatePer.contraseña = resUsuario.data.contraseña;
                usuarioUpdatePer.idpersonafk.idpersona = resUsuario.data.idpersonafk.idpersona;
                usuarioUpdatePer.tipousuariofk.idtipousuario = idtipousuario.idtipousuario;
                //console.log(usuarioUpdatePer);
                let resUsuarioUpd = await updateUsuario(usuarioUpdatePer);
                personalUpdatePer.tipousuariofk.idtipousuario = idtipousuario.idtipousuario;
                personal.tipousuariofk.idtipousuario = idtipousuario.idtipousuario;
                let responseUpdatePersonal = await updatePersonal(personal);
                if (responseUpdatePersonal.status === 200 && resUsuario.status === 200 && resUsuarioUpd.status === 200) {
                    //console.log("Se modifico al personal correctamente");
                    modificacion = "up";
                } else {
                    modificacion = "nu";
                    //console.log("No se modifico al personal");
                }
            }

            //console.log(personalUpdatePer);
            let response = await createPersonaPersonal(personalUpdatePer);
            if (response.status === 200) {
                modificacion = modificacion + "per";
                //console.log("Se modifico al persona correctamente");
            } else {
                modificacion = modificacion + "nop";
                //console.log("No se modifico al persona");
            }
            alertaConfirmacion(modificacion);
        } else {
            //console.log("no se hizo ninguna modificaicon en la persona");
            alertaConfirmacion("nothing");
        }
    };

    const alertaConfirmacion = (resolucion) => {
        if (resolucion === "upper" || resolucion === "per") {
            MySwal.fire({
                icon: "success",
                title: <p>Se ha modificado al personal con exito!</p>,
            }).then(() => {
                navigate("/supervisor");
            });
        } else if (resolucion === "up") {
            MySwal.fire({
                icon: "success",
                title: <p>Se ha modificado al personal pero no con exito!</p>,
            }).then(() => {
                navigate("/supervisor");
            });
        } else if (resolucion === "nothing") {
            MySwal.fire({
                icon: "warning",
                title: <p>No modificaste nada!</p>,
            }).then(() => {
                navigate("/supervisor");
            });
        } else if (resolucion === "nunop") {
            MySwal.fire({
                icon: "error",
                title: <p>No se ha podido modificar al personal!</p>,
            }).then(() => {
                navigate("/supervisor");
            });
        } else {
            MySwal.fire({
                icon: "error",
                title: <p>No pudo modificar el personal.</p>,
            }).then(() => {
                navigate("/supervisor");
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
                                                                maxLength="100"
                                                                name="nombres"
                                                                defaultValue={personalUpdatePer?.nombres || ""}
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
                                                                defaultValue={personalUpdatePer?.apellidop}
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
                                                                defaultValue={personalUpdatePer?.apellidom}
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
                                                                defaultValue={personalUpdatePer?.edad}
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
                                                                defaultValue={personalUpdatePer?.calle}
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
                                                                defaultValue={personalUpdatePer?.colonia}
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
                                                                defaultValue={personalUpdatePer?.municipio}
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
                                                                defaultValue={personalUpdatePer?.telefono}
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
                                                                defaultValue={personalUpdatePer?.numcuenta}
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
                                                                defaultValue={personalUpdatePer?.claveInterB}
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
                                                                defaultValue={personalUpdatePer?.titularCuenta}
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
                                                                defaultValue={personalUpdatePer?.banco}
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
                                                        defaultValue={personalUpdatePer?.tipousuariofk.idtipousuario}
                                                        onChange={(e) => manejadorChangeTipoUsuario(e)}
                                                    >
                                                        <option value="4">Personal(Supervisor)</option>
                                                        <option value="5">Adminstrador</option>
                                                    </select>
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
                                        <Modal.Body>¿Esta seguro de modificar al personal?</Modal.Body>
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
                                                    actualizarPersonal();
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
    )
};

export default EditarPersonal;