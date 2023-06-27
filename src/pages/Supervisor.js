import React, { useEffect, useMemo, useState } from "react";
import { bloquearPersonal, getPersonal, suspenderPersonal } from "../services/PersonalService";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import NavBarAdmin from "../components/NavBarAdmin";
import { useNavigate } from "react-router-dom";
import FiltroGlobal from "../components/FiltroGlobal";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


function Supervisor() {
  const MySwal = withReactContent(Swal);
  const tipoUsuario = sessionStorage.getItem("idtipousuario");
  const navigate = useNavigate();
  const [personal, setPersonal] = useState([]);
  const [modalIsOpenEliminar, setIsOpenEliminar] = useState(false);
  const [personalSeleccionado, setpersonalSeleccionado] = useState(null);
  const [modalSuspension, setIsOpenSuspension] = useState(false);
  const [fecha, setFecha] = useState("");
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "idpersonal", // accessor is the "key" in the data
      },
      {
        Header: "ID Persona",
        accessor: "idpersonafk.idpersona", // accessor is the "key" in the data
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
        Header: "Tipo Usuario",
        accessor: "tipousuariofk.tipousuario",
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
                navigate("/editarPersonal?id=" + cell.row.values.idpersonal)
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
                setpersonalSeleccionado(cell.row.values.idpersonal);
              }}
            >
              <ion-icon name="person-remove"></ion-icon>
            </button>
            <button
              className="btn me-1 btn-danger"
              onClick={() => {
                setIsOpenEliminar(!modalIsOpenEliminar);
                setpersonalSeleccionado(cell.row.values.idpersonal);
                //console.log("eliminar")
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
    { columns, data: personal },
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

  const obtenerPersonal = async () => {
    return await getPersonal();
  };

  useEffect(() => {
    obtenerPersonal().then((data) => setPersonal(data));
    setPageSize(100);
  }, []);

  const eliminarPersonal = async () => {
    let resBlock = await bloquearPersonal(personalSeleccionado);
    if (resBlock.status === 200) {
      //console.log("Se elimono el personal");
      alertaConfirmacion("blockP");
    } else {
      //console.log("No se elimono el personal");
      alertaConfirmacion("statusError");
    }
  };

  const suspenderPer = async () => {
    let resSusPer = await suspenderPersonal(personalSeleccionado, fecha);
    if (resSusPer.status === 200) {
      //console.log("Se suspendio el personal");
      alertaConfirmacion("suspencionP");
    } else {
      //console.log("No se suspendio el personal");
      alertaConfirmacion("statusError");
    }
  };

  const alertaConfirmacion = (resolucion) => {
    if (resolucion === "blockP") {
      MySwal.fire({
        icon: "error",
        title: <p>Se ha eliminado el personal con exito!</p>,
      }).then(() => {
        window.location.href = window.location.href;
      });
    } else if (resolucion === "suspencionP") {
      MySwal.fire({
        icon: "warning",
        title: <p>Se suspendio al personal!</p>,
      }).then(() => {
        window.location.href = window.location.href;
      });
    } else if (resolucion === "statusError") {
      MySwal.fire({
        icon: "question",
        title: <p>Ocurrio un error, intentalo de nuevo!</p>,
      }).then(() => {
        window.location.href = window.location.href;
      });
    }
  };

  return (
    <>
      {
        tipoUsuario === '5' ? (
          <>
            <NavBarAdmin />

            <div className="reports text-center">
              <div className="container-fluid table-responsive">
                <h1>Personal</h1>
                <div className="d-flex justify-content-center mx-3">
                  <FiltroGlobal filter={globalFilter} setFilter={setGlobalFilter} />
                  <button type="button" className="btn btn-light mx-3" title="Agregar Personal"
                    onClick={() =>
                      navigate("/agregarPersonal")}
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
                        setGlobalFilter("Admin");
                      } else {
                        setGlobalFilter("");
                      }
                    }}
                  />
                  <label className="btn btn-dark" htmlFor="btncheck1">
                    Adminstradores
                  </label>

                  <input
                    type="checkbox"
                    className="btn-check"
                    id="btncheck2"
                    autoComplete="off"
                    onClick={(e) => {
                      if (e.target.checked === true) {
                        setGlobalFilter("Personal");
                      } else {
                        setGlobalFilter("");
                      }
                    }}
                  />
                  <label className="btn btn-dark" htmlFor="btncheck2">
                    Personal (Supervisores)
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
              <Modal.Body>¿Esta seguro de eliminar al personal?</Modal.Body>
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
                    eliminarPersonal();
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
                    suspenderPer();
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
  );
}

export default Supervisor;