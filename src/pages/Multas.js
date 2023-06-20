import React, { useEffect, useMemo, useState } from "react";
import NavBarSupervisor from "../components/NavBarSupervisor";
import NavBarAdmin from "../components/NavBarAdmin";
import SinAcceso from "../components/SinAcceso";
import FiltroGlobal from "../components/FiltroGlobal";
import { useGlobalFilter, usePagination, useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import { getMultas } from "../services/MultaService";

function Multas() {
  let tipoUsuario = sessionStorage.getItem("idtipousuario");
  const navigate = useNavigate();
  const [multas, setMultas] = useState([]);
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "idmulta", // accessor is the "key" in the data
      },
      {
        Header: "Infraccion",
        accessor: "infraccion", // accessor is the "key" in the data
      },
      {
        Header: "Razon",
        accessor: "razon",
      },
      {
        Header: "Monto",
        accessor: "monto",
      },
      {
        Header: "Estatus",
        accessor: (d) => {
          return d.estatus ? "Pagada" : "Sin pago";
        },
      },
      //   {
      //     Header: "Reportador",
      //     accessor: "idreportadorfk.nombres",
      //   },
      {
        Header: "Acciones",
        Cell: ({ cell }) => (
          <button
            className="btn btn-primary"
            title="Revisar"
            onClick={() => {
              navigate("/revisionMulta?id=" + cell.row.values.idmulta);
            }}
          >
            <ion-icon name="pencil"></ion-icon>
          </button>
        ),
      },
    ],
    []
  );
  const tableInstance = useTable(
    { columns, data: multas },
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

  const obtenerMultas = async () => {
    return await getMultas();
  };

  useEffect(() => {
    obtenerMultas().then((data) => setMultas(data));
    //setPageSize(10);
  }, []);

  return (
    <>
      {tipoUsuario === "1" ? (
        <>
          <NavBarSupervisor />
          <div className="reports text-center">
            <div className="container-fluid table-responsive">
              <h1>Multas</h1>
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
                      setGlobalFilter("Pagada");
                    } else {
                      setGlobalFilter("");
                    }
                  }}
                />
                <label className="btn btn-dark" htmlFor="btncheck1">
                  Multas pagadas
                </label>

                <input
                  type="checkbox"
                  className="btn-check"
                  id="btncheck2"
                  autoComplete="off"
                  onClick={(e) => {
                    if (e.target.checked === true) {
                      setGlobalFilter("Sin pago");
                    } else {
                      setGlobalFilter("");
                    }
                  }}
                />
                <label className="btn btn-dark" htmlFor="btncheck2">
                  Multa sin pago
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

export default Multas;
