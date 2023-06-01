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

export const getUsuario = async (id) => {
  let res = {};
  await axios.get(Apiurl + "usuarios/getUsuario?id=" + id).then((response) => {
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
  await axios.put(Apiurl + "usuarios/editarUsuario", user).then((response) => {
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

export const suspenderUsuario = async (usuario, fecha) => {
  let res = "";
  await axios
    .post(Apiurl + "usuarios/suspender?usuario=" + usuario + "&fecha=" + fecha)
    .then((response) => {
      res = response.status;
    });
  return res;
};

export const eliminarUsuario = async (usuario) => {
  let res = "";
  await axios
    .put(Apiurl + "usuarios/eliminar",usuario)
    .then((response) => {
      res = response.status;
    });
  return res;
};

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
  console.log(res);
};

export const enviarNotificacion = async (token, estatus) => {
  let res = "";
  let notificacion = {
    token: token,
    titulo: "Revision de reporte",
    mensaje: estatus
      ? "Tienes un reporte aceptado"
      : "Tienes un reporte rechazado",
    data: {},
  };
  await axios.post(Apiurl + "notificacion", notificacion).then((response) => {
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

export const cambiarContraseña = async (codigo, contraseña) => {
  let res = "";
  await axios
    .put(Apiurl + "usuarios/editarContraseña?pass=" + contraseña, {
      codigo: codigo,
    })
    .then((response) => {
      res = response.data;
    });
  return res;
};

export const getMultas = async () => {
  let res = {};
  await axios.get(Apiurl + "multas").then((response) => {
    res = response.data;
  });
  return res;
};

export const getMulta = async (id) => {
  let res = {};
  await axios.get(Apiurl + "multas/multaPorId?id=" + id).then((response) => {
    res = response.data;
  });
  return res;
};

export const pagarMulta = async (multa) => {
  let res = {};
  await axios.put(Apiurl + "multas", multa).then((response) => {
    res = response.data;
  });
  return res;
};
