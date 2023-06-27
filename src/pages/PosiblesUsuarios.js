import React, { useEffect, useMemo, useState } from "react";
import NavBarAdmin from "../components/NavBarAdmin";
import NavBarSupervisor from "../components/NavBarSupervisor";
import { getUsuariosPosibles } from "../services/UsuariosPosiblesService";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import FiltroGlobal from "../components/FiltroGlobal";
import { useNavigate } from "react-router-dom";
import SinAccesso from "../components/SinAcceso";

function PosiblesUsuarios() {
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  const navigate = useNavigate();
  const [usuariosP, setUsuariosP] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "idposibleusuario", // accessor is the "key" in the data
      },
      {
        Header: "Nombre",
        accessor: "nombres", // accessor is the "key" in the data
      },
      {
        Header: "Apellido paterno",
        accessor: "apellidop",
      },
      {
        Header: "Apellido materno",
        accessor: "apellidom",
      },
      {
        Header: "Usuario",
        accessor: "usuario",
      },
      {
        Header: "Acciones",
        Cell: ({ cell }) => (
          <div>
            <button
              className="btn btn-primary"
              title="Revisar"
              onClick={() => {
                navigate(
                  "/revisionUsuarios?id=" + cell.row.values.idposibleusuario
                );
              }}
            >
              <ion-icon name="pencil"></ion-icon>
            </button>
          </div>
        ),
      },
    ],
    []
  );
  const tableInstance = useTable(
    { columns, data: usuariosP },
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
    return await getUsuariosPosibles();
  };

  useEffect(() => {
    obtenerUsuarios().then((data) => {
      setUsuariosP(data);
    });
    //setPageSize(10);
  }, []);

  return (
    <>
      {tipoUsuario === "4" ? (
        <>
          <NavBarSupervisor />
          <div className="reports">
            <div className="container-fluid table-responsive">
              <h1>Solicitudes de usuarios</h1>
              <div className="d-flex justify-content-center mx-3">
                <FiltroGlobal
                  filter={globalFilter}
                  setFilter={setGlobalFilter}
                />
              </div>
              <table className="table-dark mt-2 " {...getTableProps()}>
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
        </>
      ) : (
        <>
          <NavBarAdmin />
          <SinAccesso />
        </>
      )}
    </>
  );
}

export default PosiblesUsuarios;
