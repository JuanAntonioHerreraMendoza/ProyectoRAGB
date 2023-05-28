import React, { useEffect, useMemo, useState } from "react";
import { getUsuarios } from "../services/ApiRest";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarSupervisor from "../components/NavBarSupervisor";
import { useNavigate } from "react-router-dom";
import FiltroGlobal from "../components/FiltroGlobal";

function Usuarios() {
  const navigate = useNavigate();
  let tipoUsuario = localStorage.getItem("idtipousuario");
  const [reportes, setReportes] = useState([]);
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "idusuarios", // accessor is the "key" in the data
      },
      {
        Header: "Descripcion",
        accessor: "idpersonafk.nombres", // accessor is the "key" in the data
      },
      {
        Header: "Fecha",
        accessor: "idpersonafk.apellidop",
      },
      {
        Header: "Direccion",
        accessor: "idpersonafk.apellidom",
      },
      {
        Header: "Estatus",
        accessor: "usuario",
      },
      {
        Header: "Reportador",
        accessor: (d) => {
          return d.idpersonafk.activo ? "Activo" : "Inactivo";
        },
      },
      {
        Header: "Acciones",
        Cell: ({ cell }) => (
          <div>
            <button
              className="btn me-1 btn-primary"
              onClick={() =>
                navigate("/revisionReportes?id=" + cell.row.values.idreporte)
              }
            >
              <ion-icon name="eye"></ion-icon>
            </button>
            <button
              className="btn me-1 btn-secondary"
              onClick={() =>
                navigate("/revisionReportes?id=" + cell.row.values.idreporte)
              }
            >
              <ion-icon name="pencil"></ion-icon>
            </button>
            <button
              className="btn btn-danger"
              onClick={() =>
                navigate("/revisionReportes?id=" + cell.row.values.idreporte)
              }
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
    { columns, data: reportes },
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

  const obtenerUsuarios = async () => {
    return await getUsuarios();
  };

  useEffect(() => {
    obtenerUsuarios().then((data) => setReportes(data));
    setPageSize(10);
    console.log(reportes);
  }, []);
  return (
    <>
      {tipoUsuario === "1" ? <NavBarSupervisor /> : <NavBarAdmin />}
      <div className="reports">
        <div className="container-fluid table-responsive">
          <h1>Usuarios</h1>
          <div className="d-flex justify-content-center mx-3">
            <FiltroGlobal filter={globalFilter} setFilter={setGlobalFilter} />
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
                  setGlobalFilter("Aceptado");
                } else {
                  setGlobalFilter("");
                }
              }}
            />
            <label className="btn btn-dark" htmlFor="btncheck1">
              Reportes aceptados
            </label>

            <input
              type="checkbox"
              className="btn-check"
              id="btncheck2"
              autoComplete="off"
              onClick={(e) => {
                if (e.target.checked === true) {
                  setGlobalFilter("Rechazado");
                } else {
                  setGlobalFilter("");
                }
              }}
            />
            <label className="btn btn-dark" htmlFor="btncheck2">
              Reportes rechazados
            </label>

            <input
              type="checkbox"
              className="btn-check"
              id="btncheck3"
              autoComplete="off"
              onClick={(e) => {
                if (e.target.checked === true) {
                  setGlobalFilter("Revision");
                } else {
                  setGlobalFilter("");
                }
              }}
            />
            <label className="btn btn-dark" htmlFor="btncheck3">
              Reportes en revisión
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
    </>
  );
}

export default Usuarios;
