import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarAdmin from "../components/NavBarAdmin";
import "leaflet/dist/leaflet.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { validarContraseña } from "../services/Validaciones";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createUsuario, existeUsuario } from "../services/UsuarioService";
import { createOficial, createPersonaOficial } from "../services/OficialVialService";

function AgregarOficialVial() {
    let tipoUsuario = sessionStorage.getItem("idtipousuario");
    const [alerta, setAlerta] = useState(false);
    const navigate = useNavigate();
    const [errorPlaca, seterrorPlaca] = useState({
        errorPlaca: "",
        errorMsg: "",
    });
    const [errorPassword, seterrorPassword] = useState({
        errorPassword: false,
        errorMsg: "",
    });
    const [errorConfirmPassword, seterrorConfirmPassword] = useState(false);
    const [modalIsOpenCancelar, setIsOpenCancelar] = useState(false);
    const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);
    const [showPassword, setshowPassword] = useState(false);
    const MySwal = withReactContent(Swal);

    //Agregar Oficial Vial
    const [oficialCreatePer, setoficialCreatePer] = useState({
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
            idtipousuario: 3
        }
    });
    //Creando el usuario
    const [oficialCreateUser, setoficialCreateUser] = useState({
        usuario: "",
        contraseña: "",
        idpersonafk: {
            idpersona: 0
        },
        tipousuariofk: {
            idtipousuario: 3
        }
    });
    //Creando al oficial
    const [oficialCreate, setoficialCreate] = useState({
        placa: "",
        tipoOficial: "",
        cuerpoOficial: "",
        añosServicio: 0,
        idpersonafk: {
            idpersona: 0
        }
    });

    const manejadorChange = (e) => {
        setoficialCreatePer({
            ...oficialCreatePer,
            [e.target.name]: e.target.value,
        });
    };
    const manejadorChangeOficial = (e) => {
        setoficialCreate({
            ...oficialCreate,
            [e.target.name]: e.target.value,
        });
    };
    //Revision del email
    let filterTimeout;
    const manejadorChangeCheckPlaca = (e) => {
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(function async() {
            existeUsuario(e.target.value).then(
                respuesta => {
                    if (respuesta.data) {
                        seterrorPlaca({
                            errorPlaca: "occupied",
                            errorMsg: "La placa ya esta ocupada!",
                        });
                    } else {
                        seterrorPlaca({
                            errorPlaca: "",
                        });
                        setoficialCreate({
                            ...oficialCreate,
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
            setoficialCreateUser({
                ...oficialCreateUser,
                [e.target.name]: e.target.value
            });
        }

    };
    const manejadorChangeConfirmPassword = (e) => {
        if (e.target.value !== oficialCreateUser.contraseña) {
            seterrorConfirmPassword(true);
        } else {
            seterrorConfirmPassword(false);
        }
    };

    const crearOficialVial = async () => {
        if (oficialCreatePer.nombres === "" ||
            oficialCreatePer.apellidop === "" ||
            oficialCreatePer.apellidom === "" ||
            oficialCreatePer.edad === 0 ||
            oficialCreatePer.calle === "" ||
            oficialCreatePer.colonia === "" ||
            oficialCreatePer.municipio === "" ||
            oficialCreatePer.telefono === "" ||
            oficialCreatePer.correo === "" ||
            oficialCreatePer.numcuenta === "" ||
            oficialCreatePer.claveInterB === "" ||
            oficialCreatePer.titularCuenta === "" ||
            oficialCreatePer.banco === "" ||
            oficialCreateUser.contraseña === "" ||
            oficialCreate.placa === "" ||
            oficialCreate.añosServicio === "" ||
            oficialCreate.cuerpoOficial === "" ||
            oficialCreate.tipoOficial === "") {
            return setAlerta(true);
        }
        oficialCreateUser.usuario = oficialCreate.placa;
        console.log(oficialCreatePer);
        console.log(oficialCreateUser);
        console.log(oficialCreate);
        let response = await createPersonaOficial(oficialCreatePer);
        oficialCreateUser.idpersonafk.idpersona = response.data;
        let response2 = await createUsuario(oficialCreateUser);
        oficialCreate.idpersonafk.idpersona = response.data;
        let response3 = await createOficial(oficialCreate);
        if (response3.status === 200 && response2.status === 200 && response.status === 200) {
            alertaConfirmacion(true);
        } else {
            alertaConfirmacion(false);
        }
    };

    const alertaConfirmacion = (resolucion) => {
        if (resolucion) {
            MySwal.fire({
                icon: "success",
                title: <p>Se ha creado el oficial con exito!</p>,
            }).then(() => {
                navigate("/oficialesViales");
            });
        } else {
            MySwal.fire({
                icon: "error",
                title: <p>No se ha podido crear el oficial.</p>,
            }).then(() => {
                navigate("/oficialesViales");
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
                                    <div>
                                        <div className="form-group mt-2">
                                            <label className="fs-5">Correo electronico:</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Correo electronico/ Email"
                                                required
                                                maxLength="50"
                                                name="correo"
                                                onChange={(e) => manejadorChange(e)}
                                            ></input>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <div className="container text-center mt-3">
                                        <label className="fs-3 fw-bold">
                                            Información de Oficial/Inicio de sesión
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label className="fs-5" title="Con la placa iniciara sesión en la APP">Placa (Usuario):</label>
                                        <input
                                            type="text"
                                            title="Con la placa iniciara sesión en la APP"
                                            className="form-control "
                                            placeholder="Num. Placa/ Usuario"
                                            name="placa"
                                            maxLength="50"
                                            onChange={(e) => manejadorChangeCheckPlaca(e)}
                                        ></input>
                                        {errorPlaca.errorPlaca === "occupied" && (
                                            <div className="alert alert-danger" role="alert">
                                                {errorPlaca.errorMsg}
                                            </div>
                                        )}
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
                                            onChange={(e) => manejadorChangeOficial(e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="fs-5">Contraseña:</label>
                                        <div className="container input-group my-3">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Contraseña"
                                                name="contraseña"
                                                maxLength="16"
                                                minLength="8"
                                                title="La constraseña debe tener: 
                                        1 letra mayúscula
                                        1 letra minúscula
                                        1 dígito
                                        1 caracter especial"
                                                onChange={(e) => manejadorChangePassword(e)}
                                            />
                                            <button
                                                title="Ver/Ocultar Contraseña"
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
                                        navigate("/oficialesViales");
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
                                        crearOficialVial();
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
            )}
        </>
    );

};

export default AgregarOficialVial;