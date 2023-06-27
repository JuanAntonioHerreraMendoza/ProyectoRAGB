import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { useNavigate } from "react-router-dom";
import FiltroGlobal from "../components/FiltroGlobal";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NavBarAdmin from '../components/NavBarAdmin';
import { bloquearOficial, getOficialesViales, suspenderOficial } from "../services/OficialVialService";

function Oficialesviales() {
    const navigate = useNavigate();
    const [loading, setloading] = useState(true);
    const tipoUsuario = sessionStorage.getItem("idtipousuario");
    const [oficialesViales, setOficialesViales] = useState([]);
    const [oficialSeleccionado, setoficialSeleccionado] = useState(null);
    const [modalIsOpenEliminar, setIsOpenEliminar] = useState(false);
    const [modalSuspension, setIsOpenSuspension] = useState(false);
    const [fecha, setFecha] = useState("");
    const MySwal = withReactContent(Swal);

    const columns = useMemo(
        () => [
            {
                Header: "Placa",
                accessor: "placa", // accessor is the "key" in the data
            },
            {
                Header: "Tipo de Oficial",
                accessor: "tipoOficial", // accessor is the "key" in the data
            },
            {
                Header: "Cuerpo de Oficial",
                accessor: "cuerpoOficial", // accessor is the "key" in the data
            },
            {
                Header: "Años de Servicio",
                accessor: "añosServicio", // accessor is the "key" in the data
            },
            {
                Header: "Nombre",
                accessor: "idpersonafk.nombres",
            },
            {
                Header: "Apellido Paterno",
                accessor: "idpersonafk.apellidop",
            },
            {
                Header: "Apellido Materno",
                accessor: "idpersonafk.apellidom",
            },
            {
                Header: "Total Suspenciones",
                accessor: "idpersonafk.numSuspenciones",
            },
            {
                Header: "Estatus",
                accessor: (d) => {
                    return d.idpersonafk.activo ? "Activo" : "Suspendido";
                },
            },
            {
                Header: "Acciones",
                Cell: ({ cell }) => (
                    <>
                        <button
                            className="btn me-1 btn-success"
                            onClick={() =>
                                navigate("/editarOficialVial?id=" + cell.row.values.placa)
                                //console.log("editar")
                            }
                            title="Editar"
                        >
                            <ion-icon name="pencil"></ion-icon>
                        </button>
                        <button
                            className="btn me-1 btn-secondary"
                            title="Suspender"
                            onClick={() => {
                                setIsOpenSuspension(!modalSuspension);
                                setoficialSeleccionado(cell.row.values.placa);
                                //console.log("modificar");
                            }}
                        >
                            <ion-icon name="person-remove"></ion-icon>
                        </button>
                        <button
                            className="btn me-1 btn-danger"
                            onClick={() => {
                                setIsOpenEliminar(!modalIsOpenEliminar);
                                setoficialSeleccionado(cell.row.values.placa);
                                //console.log("eliminar");
                            }
                            }
                            title="Eliminar"
                        >
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </>
                ),
            },
        ],
        []
    );
    const tableInstance = useTable(
        { columns, data: oficialesViales },
        useGlobalFilter,
        usePagination
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state,
        setPageSize,
        setGlobalFilter,
        prepareRow,
    } = tableInstance;
    const { pageIndex, globalFilter } = state;
    const obtenerOficialesViales = async () => {
        return await getOficialesViales();
    };

    useEffect(() => {
        obtenerOficialesViales().then((data) => setOficialesViales(data));
        setPageSize(100);
        setloading(false);
    }, []);

    const eliminarOficial = async () => {
        let resolu = "";
        let resBlock = await bloquearOficial(oficialSeleccionado);
        if (resBlock.status === 200) {
          //console.log("Se elimono el personal");
          resolu ="blockO";
          alertaConfirmacion(resolu);
        } else {
          //console.log("No se elimono el personal");
          resolu ="statusError";
          alertaConfirmacion(resolu);
        }
      };
    
      const suspenderOfi = async () => {
        let resolu = "";
        let resSusPer = await suspenderOficial(oficialSeleccionado, fecha);
        if (resSusPer.status === 200) {
          //console.log("Se suspendio el personal");
          resolu ="suspencionO";
          alertaConfirmacion(resolu);
        } else {
          //console.log("No se suspendio el personal");
          resolu ="statusError";
          alertaConfirmacion(resolu);
        }
      };

      const alertaConfirmacion = (resolucion) => {
        if (resolucion === "blockO") {
          MySwal.fire({
            icon: "error",
            title: <p>Se ha eliminado al oficial con exito!</p>,
          }).then(() => {
            window.location.href = window.location.href;
            //navigate("/oficialesviales");
          });
        } else if (resolucion === "suspencionO") {
          MySwal.fire({
            icon: "warning",
            title: <p>Se suspendio al oficial!</p>,
          }).then(() => {
            window.location.href = window.location.href;
            //navigate("/oficialesviales");
          });
        } else if (resolucion === "statusError") {
          MySwal.fire({
            icon: "question",
            title: <p>Ocurrio un error, intentalo de nuevo!</p>,
          }).then(() => {
            window.location.href = window.location.href;
            //navigate("/oficialesviales");
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
                                <div className="reports text-center">
                                    <div className="container-fluid table-responsive">
                                        <h1>Oficiales Viales</h1>
                                        <div className="d-flex justify-content-center mx-3">
                                            <FiltroGlobal filter={globalFilter} setFilter={setGlobalFilter} />
                                            <button type="button" className="btn btn-light mx-3" title="Agregar Oficial"
                                                onClick={() =>
                                                    navigate("/agregarOficialVial")
                                                }
                                            >
                                                <ion-icon name="person-add-sharp"></ion-icon>
                                            </button>
                                        </div>
                                        <div
                                            className="container-fluid btn-group mb-2"
                                            role="group"
                                            aria-label="Basic checkbox toggle button group"
                                        >
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                id="btncheck1"
                                                autoComplete="off"
                                                onClick={(e) => {
                                                    if (e.target.checked === true) {
                                                        setGlobalFilter("Activo");
                                                    } else {
                                                        setGlobalFilter("");
                                                    }
                                                }}
                                            />
                                            <label className="btn btn-dark" htmlFor="btncheck1">
                                                Activos
                                            </label>

                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                id="btncheck2"
                                                autoComplete="off"
                                                onClick={(e) => {
                                                    if (e.target.checked === true) {
                                                        setGlobalFilter("Suspendido");
                                                    } else {
                                                        setGlobalFilter("");
                                                    }
                                                }}
                                            />
                                            <label className="btn btn-dark" htmlFor="btncheck2">
                                                Suspendido
                                            </label>
                                        </div>
                                        <table className="table-dark " {...getTableProps()}>
                                            <thead>
                                                {
                                                    // Loop over the header rows
                                                    headerGroups.map((headerGroup) => (
                                                        // Apply the header row props
                                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                                            {
                                                                // Loop over the headers in each row
                                                                headerGroup.headers.map((column) => (
                                                                    // Apply the header cell props
                                                                    <th className="table-dark" {...column.getHeaderProps()}>
                                                                        {
                                                                            // Render the header
                                                                            column.render("Header")
                                                                        }
                                                                    </th>
                                                                ))
                                                            }
                                                        </tr>
                                                    ))
                                                }
                                            </thead>
                                            {/* Apply the table body props */}
                                            <tbody {...getTableBodyProps()}>
                                                {
                                                    // Loop over the table rows
                                                    page.map((row) => {
                                                        // Prepare the row for display
                                                        prepareRow(row);
                                                        return (
                                                            // Apply the row props
                                                            <tr {...row.getRowProps()}>
                                                                {
                                                                    // Loop over the rows cells
                                                                    row.cells.map((cell) => {
                                                                        // Apply the cell props
                                                                        return (
                                                                            <td {...cell.getCellProps()}>
                                                                                {
                                                                                    // Render the cell contents
                                                                                    cell.render("Cell")
                                                                                }
                                                                            </td>
                                                                        );
                                                                    })
                                                                }
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <div className="container mt-2 text-center justify-content-end fs-5">
                                        </div>
                                    </div>
                                </div>
                                <Modal style={{ color: "black" }} show={modalIsOpenEliminar}>
                                    <Modal.Header>
                                        <Modal.Title>Confirmacion</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>¿Esta seguro de eliminar al oficial?</Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setIsOpenEliminar(!modalIsOpenEliminar);
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                setIsOpenEliminar(!modalIsOpenEliminar);
                                                eliminarOficial();
                                            }}
                                        >
                                            Eliminar
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                <Modal style={{ color: "black" }} show={modalSuspension}>
                                    <Modal.Header>
                                        <Modal.Title>Suspension de usuario</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <label className="form-label">Fecha de suspension</label>
                                        <input type="date" name="fecha" className="form-control" onChange={(e) => setFecha(e.target.value)}
                                            min={"19-06-2023"} />
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setIsOpenSuspension(!modalSuspension);
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                setIsOpenSuspension(!modalSuspension);
                                                suspenderOfi();
                                            }}
                                        >
                                            Confirmar
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
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
}

export default Oficialesviales;