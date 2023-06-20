import axios from "axios";
export const Apiurl = "http://localhost:8080/";

export const getConductor = async (persona) => {
  let res = {};
  await axios
    .get(Apiurl + "conductores/getConductor", persona)
    .then((response) => {
      res = response.data;
    });
  return res;
};

export const getConductorInfo = async (licencia, circulacion, placas) => {
  let res = {};
  await axios
    .get(
      Apiurl +
        "conductores/buscarValor?placas=" +
        placas +
        "&licencia=" +
        licencia +
        "&circulacion=" +
        circulacion
    )
    .then((response) => {
      res = response.data;
    });
  return res;
};

export const vincularConductorPersona = async (conductor, id) => {
  let res = {};
  await axios
    .put(Apiurl + "conductores?id=" + id, conductor)
    .then((response) => (res = response.data));
  return res;
};
