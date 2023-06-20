import React, { useEffect, useMemo, useState } from "react";
import {
  editarUsuario,
  eliminarUsuario,
  getUsuario,
  getUsuarios,
  suspenderUsuario,
} from "../services/UsuarioService";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarSupervisor from "../components/NavBarSupervisor";
import FiltroGlobal from "../components/FiltroGlobal";
import { Button, Modal } from "react-bootstrap";
import SinAcceso from "../components/SinAcceso";

function Usuarios() {
  let fechaHoy = new Date();
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  const [fecha, setFecha] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenAceptar, setIsOpenAceptar] = useState(false);
  const [modalSuspension, setIsOpenSuspension] = useState(false);
  const [modalEliminar, setIsOpenEliminar] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [persona, setPersona] = useState(null);
  const [lgShow, setLgShow] = useState(false);
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "idusuarios", // accessor is the "key" in the data
      },
      {
        Header: "Nombre",
        accessor: "idpersonafk.nombres", // accessor is the "key" in the data
      },
      {
        Header: "Apellido paterno",
        accessor: "idpersonafk.apellidop",
      },
      {
        Header: "Apellido materno",
        accessor: "idpersonafk.apellidom",
      },
      {
        Header: "Usuario",
        accessor: "usuario",
      },
      {
        Header: "Estatus",
        accessor: (d) => {
          return d.idpersonafk.activo ? "Activo" : "Suspendido";
        },
      },
      {
        Header: "N° de suspenciones",
        accessor: "idpersonafk.numSuspenciones",
      },
      {
        Header: "Acciones",
        Cell: ({ cell }) => (
          <div>
            <button
              className="btn me-1 btn-primary"
              title="Editar"
              onClick={() => {
                obtenerUsuario(cell.row.values.idusuarios).then((res) => {
                  setUsuario(res);
                  setPersona(res.idpersonafk);
                  setLgShow(!lgShow);
                });
              }}
            >
              <ion-icon name="eye"></ion-icon>
            </button>
            <button
              className="btn me-1 btn-secondary"
              title="Suspender"
              onClick={() => {
                obtenerUsuario(cell.row.values.idusuarios).then((res) => {
                  setUsuario(res);
                  setPersona(res.idpersonafk);
                  setIsOpenSuspension(!modalSuspension);
                });
              }}
            >
              <ion-icon name="person-remove"></ion-icon>
            </button>
            <button
              className="btn btn-danger"
              title="Eliminar"
              onClick={() => {
                obtenerUsuario(cell.row.values.idusuarios).then((data) => {
                  setUsuario(data);
                });
                setIsOpenEliminar(!modalEliminar);
              }}
            >
              <ion-icon name="trash"></ion-icon>
            </button>
          </div>
        ),
      },
    ],
    []
  );
  const tableInstance = useTable(
    { columns, data: usuarios },
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

  const manejadorChange = (e) => {
    setPersona({
      ...persona,
      [e.target.name]: e.target.value,
    });
  };

  const obtenerUsuarios = async () => {
    return await getUsuarios();
  };

  const obtenerUsuario = async (id) => {
    return await getUsuario(id);
  };

  useEffect(() => {
    obtenerUsuarios().then((data) => setUsuarios(data));
    setPageSize(10);
  }, []);
  return (
    <>
      {tipoUsuario === "1" ? (
        <>
          <NavBarSupervisor />{" "}
          <div className="reports">
            <Modal
              size="lg"
              show={lgShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton style={{ color: "black" }}>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Vista/Edicion de usuarios
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {usuario ? (
                  <div
                    className="container text-center"
                    style={{ color: "black" }}
                  >
                    <div className="row">
                      <div className="col">
                        <label className="form-label">Nombres</label>
                        <input
                          type="text"
                          name="nombres"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.nombres || ""}
                          onChange={(e) => {
                            setUsuario({
                              ...usuario,
                              "usuarios.idpersonafk.nombres": e.target.value,
                            });
                          }}
                        />
                        <label className="form-label">Apellido Paterno</label>
                        <input
                          type="text"
                          name="apellidop"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.apellidop || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                        <label className="form-label">Apellido Materno</label>
                        <input
                          type="text"
                          name="apellidom"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.apellidom || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                        <label className="form-label">Calle</label>
                        <input
                          type="text"
                          name="calle"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.calle || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="inputPassword5" className="form-label">
                          Colonia
                        </label>
                        <input
                          type="text"
                          name="colonia"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.colonia || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                        <label className="form-label">Municipio</label>
                        <input
                          type="text"
                          name="municipio"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.municipio || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                        <label className="form-label">Telefono</label>
                        <input
                          type="text"
                          name="telefono"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.telefono || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                        <label className="form-label">Edad</label>
                        <input
                          type="text"
                          name="edad"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.edad || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label">Titular de cuenta</label>
                        <input
                          type="text"
                          name="titularCuenta"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.titularCuenta || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                        <label className="form-label">Numero de cuenta</label>
                        <input
                          type="text"
                          name="numcuenta"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.numcuenta || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                        <label className="form-label">
                          Clave Interbancaria
                        </label>
                        <input
                          type="text"
                          name="claveInterB"
                          className="form-control"
                          defaultValue={usuario.idpersonafk.claveInterB || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                        <label className="form-label">Banco</label>
                        <input
                          type="text"
                          className="form-control"
                          name="banco"
                          defaultValue={usuario.idpersonafk.banco || ""}
                          onChange={(e) => {
                            manejadorChange(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="btn btn-secondary"
                  onClick={() => setIsOpen(!modalIsOpen)}
                >
                  Cancelar
                </Button>
                <Button
                  className="primary"
                  onClick={() => {
                    setIsOpenAceptar(!modalIsOpenAceptar);
                  }}
                >
                  Editar
                </Button>
              </Modal.Footer>
            </Modal>
            <div className="container-fluid table-responsive">
              <h1>Usuarios</h1>
              <div className="d-flex justify-content-center mx-3">
                <FiltroGlobal
                  filter={globalFilter}
                  setFilter={setGlobalFilter}
                />
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
                  Usuarios activos
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
                  Usuarios suspendidos
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
                            <th
                              className="table-dark"
                              {...column.getHeaderProps()}
                            >
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
                <div className="container row">
                  <span>
                    Pagina{" "}
                    <strong>
                      {pageIndex + 1} de {pageOptions.length}
                    </strong>
                  </span>
                </div>
                <div>
                  <button
                    className="btn btn-dark me-md-2"
                    onClick={() => {
                      previousPage();
                    }}
                    disabled={!canPreviousPage}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => {
                      nextPage();
                    }}
                    className="btn btn-dark"
                    disabled={!canNextPage}
                  >
                    Siguiente
                  </button>
                </div>
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
                  setLgShow(!lgShow);
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
            <Modal.Body>¿Esta seguro de editar este usuario?</Modal.Body>
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
                  usuario.idpersonafk = persona;
                  editarUsuario(usuario)
                    .then(setLgShow(!lgShow))
                    .catch((e) => console.error(e));
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal style={{ color: "black" }} show={modalSuspension}>
            <Modal.Header>
              <Modal.Title>Suspension de usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className="form-label">Fecha de suspension</label>
              <input
                type="date"
                name="fecha"
                min={fechaHoy?.toISOString().split("T")[0]}
                className="form-control"
                onChange={(e) => setFecha(e.target.value)}
              />
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
                  suspenderUsuario(usuario.usuario, fecha).then(
                    setIsOpenSuspension(!modalSuspension)
                  );
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal style={{ color: "black" }} show={modalEliminar}>
            <Modal.Header>
              <Modal.Title>Eliminacion de usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Esta seguro de eliminar este usuario?</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsOpenEliminar(!modalEliminar);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  eliminarUsuario(usuario)
                    .then(setIsOpenEliminar(!modalEliminar))
                    .catch((error) => alert(error));
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
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

export default Usuarios;
