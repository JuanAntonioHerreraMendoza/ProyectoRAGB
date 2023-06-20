import axios from "axios";
export const Apiurl = "http://localhost:8080/";


export const enviarNotificacionMulta = async (correo) => {
  let res = "";
  await axios
    .get(Apiurl + "tokens/tokenporCorreo?correo=" + correo)
    .then((response) => {
      response.data.map(async (token) => {
        let notificacion = {
          token: token.token,
          titulo: "Revision de multa",
          mensaje: "Una multa fue pagada",
          data: {},
        };
        await axios
          .post(Apiurl + "notificacion", notificacion)
          .then((response) => {
            res = response.status;
          });
      });
    });
  return res;
};

export const enviarNotificacionR = async (correo, estatus) => {
  let res = "";
  await axios
    .get(Apiurl + "tokens/tokenporCorreo?correo=" + correo)
    .then((response) => {
      response.data.map(async (token) => {
        let notificacion = {
          token: token,
          titulo: "Revision de reporte",
          mensaje: estatus
            ? "Tienes un reporte aceptado"
            : "Tienes un reporte rechazado",
          data: {},
        };
        await axios
          .post(Apiurl + "notificacion", notificacion)
          .then((response) => {
            res = response.status;
          });
      });
    });
  return res;
};


export const existeCodigo = async (codigo) => {
  let res = false;
  await axios.post(Apiurl + "codigo", { codigo: codigo }).then((response) => {
    res = response.data;
  });
  return res;
};

