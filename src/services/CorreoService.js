import axios from "axios";
export const Apiurl = "http://localhost:8080/";


export const enviarCorreoReporte = async (usuario, resultado) => {
    let res = "";
    await axios
      .post(
        Apiurl +
          "correo/correoReporte?correo=" +
          usuario +
          "&resultado=" +
          resultado
      )
      .then((response) => {
        res = response.status;
      });
    console.log(res);
  };
  
  export const enviarCorreoMulta = async (usuario) => {
    let res = "";
    await axios
      .post(Apiurl + "correo/correoMulta?correo=" + usuario)
      .then((response) => {
        res = response.status;
      });
    console.log(res);
  };
  
  export const enviarCorreoUsuarioPosible = async (usuario, resultado) => {
    let res = "";
    await axios
      .post(
        Apiurl +
          "correo/correoUsuario?correo=" +
          usuario +
          "&resultado=" +
          resultado
      )
      .then((response) => {
        res = response.status;
      });
    return res;
  };

  export const enviarCodigo = async (correo) => {
    let res = "";
    await axios.post(Apiurl + "correo?correo=" + correo).then((response) => {
      res = response.status;
    });
    return res;
  };
  
  export const enviarCodigoSesionUsuario = async (correo) => {
    let res = "";
    await axios
      .post(Apiurl + "correo/sesionUsuario?correo=" + correo)
      .then((response) => {
        res = response.status;
      });
    return res;
  };