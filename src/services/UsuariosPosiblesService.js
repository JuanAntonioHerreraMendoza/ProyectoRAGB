import axios from "axios";
export const Apiurl = "http://localhost:8080/";

export const getUsuariosPosibles = async () => {
  let res = [];
  await axios.get(Apiurl + "posibleUsuario").then((response) => {
    res = response.data;
  });
  return res;
};

export const getUsuarioPosible = async (id) => {
  let res = {};
  await axios
    .get(Apiurl + "posibleUsuario/getPorId?id=" + id)
    .then((response) => {
      res = response.data;
    });
  return res;
};

export const deleteUsuarioPosible = async (id) => {
  let res = {};
  await axios.delete(Apiurl + "posibleUsuario?id=" + id).then((response) => {
    res = response.data;
  });
  return res;
};

export const aceptarUsuarioPosible = async (user) => {
  let res = 0;
  await axios.post(Apiurl + "usuarios/usuarioR", user).then((response) => {
    res = response.data;
  });
  return res;
};
