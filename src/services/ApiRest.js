import axios from "axios";
export const Apiurl = "http://localhost:8080/";

export const getReportes = async () => {
  let res = [];
  await axios.get(Apiurl + "reportes").then((response) => {
    res = response.data;
  });
  return res;
};

export const getUsuarios = async () => {
  let res = [];
  await axios.get(Apiurl + "usuarios/usuarioslist").then((response) => {
    res = response.data;
  });
  return res;
};

export const getUsuariosPosibles = async () => {
  let res = [];
  await axios.get(Apiurl + "posibleUsuario").then((response) => {
    res = response.data;
  });
  return res;
};

export const getUsuario = async (id) => {
  let res = {};
  await axios.get(Apiurl + "usuarios/getUsuario?id="+id).then((response) => {
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

export const editarUsuario = async (user) => {
  let res = {};
  await axios
    .put(Apiurl + "usuarios/editarUsuario",user)
    .then((response) => {
      res = response.data;
    });
  return res;
};

export const nuevaMulta = async (multa) => {
  let res = {};
  await axios.post(Apiurl + "multas/nuevaMulta", multa).then((response) => {
    res = response.data;
  });
  return res;
};

export const getConductorInfo = async (licencia, circulacion, placas) => {
  let res = {};
  await axios.get(Apiurl +"conductores/buscarValor?placas="+placas+"&licencia="+licencia +"&circulacion="+circulacion).then((response) => {
    res = response.data;
  });
  return res;
};

export const suspenderUsuario = async (usuario,fecha) => {
  let res = "";
  await axios.post(Apiurl +"usuarios/suspender?usuario="+usuario+"&fecha="+fecha).then((response) => {
    res = response.status;
  });
  console.log(res);
};

export const enviarCorreo = async (usuario) => {
  let res = "";
  await axios.post(Apiurl +"correo/correoReporte").then((response) => {
    res = response.status;
  });
  console.log(res);
};

