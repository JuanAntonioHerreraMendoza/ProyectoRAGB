import axios from "axios";
export const Apiurl = "http://localhost:8080/";

export const getReportes = async () => {
  let res = [];
  await axios.get(Apiurl + "reportes").then((response) => {
    res = response.data;
  });
  return res;
};

export const getReporte = async (id) => {
  let res = {};
  await axios.get(Apiurl + "reportes/rep?id=" + id).then((response) => {
    res = response.data;
  });
  return res;
};

export const cambiarEstatus = async (id, estatus) => {
  let res = {};
  await axios
    .post(Apiurl + "reportes/changeEstatus?id=" + id + "&estatus=" + estatus)
    .then((response) => {
      res = response.data;
    });
  return res;
};
