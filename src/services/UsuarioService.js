import axios from "axios";

export const baseUrl = "https://842f-187-221-239-17.ngrok-free.app/usuarios";
axios.defaults.headers.common['ngrok-skip-browser-warning'] = "any value";

export async function login(usuario) {
    let res = undefined;

    await axios.post(baseUrl + "/login", usuario).then(
        response => {
            if (response.data.usuario !== null) {
                res = response;
            } else {
                res = "UYCI";
            }

        }
    ).catch(
        error => {
            res = "errorConexion";
        }
    );

    return res;
};

export async function createUsuario(user) {
    let res = 0;
    await axios.post(baseUrl + "/guardar", user).then(response => {
        res = response;
    }).catch(error =>{
        console.log(error);
    });
    return res;
};


export async function findUsuario(correo) {
    let res = undefined;

    await axios.get(baseUrl + "/findUsuario?correo=" + correo).then(
        response => {
            res = response;
        }
    ).catch(
        error => {
            console.log(error);
        }
    );

    return res;
};

export async function updateUsuario(usuario) {
    let res = undefined;

    await axios.post(baseUrl + "/updateUsuario", usuario).then(
        response => {
            res = response;
        }
    ).catch(
        error => {
            console.log(error);
        }
    );

    return res;
};

export const getUsuario = async (id) => {
    let res = {};
    await axios.get(baseUrl + "/getUsuario?id=" + id).then((response) => {
      res = response.data;
    });
    return res;
  };

  export const getUsuarios = async () => {
    let res = [];
    await axios.get(baseUrl + "/usuarioslist").then((response) => {
      res = response.data;
    });
    return res;
  };
    
  export const editarUsuario = async (user) => {
    let res = {};
    await axios.put(baseUrl + "/editarUsuario", user).then((response) => {
      res = response.data;
    });
    return res;
  };

  export const suspenderUsuario = async (usuario, fecha) => {
    let res = "";
    await axios
      .post(baseUrl + "/suspender?usuario=" + usuario + "&fecha=" + fecha)
      .then((response) => {
        res = response.status;
      });
    return res;
  };
  
  export const eliminarUsuario = async (usuario) => {
    let res = "";
    await axios.put(baseUrl + "/eliminar", usuario).then((response) => {
      res = response.status;
    });
    return res;
  };

  export const existeUsuario = async (correo) => {
    let res = {};
    await axios
      .get(baseUrl + "/existeUsuario?correo=" + correo)
      .then((response) => {
        res = response.data;
      });
    return res;
  };

  export const cambiarContraseña = async (codigo, contraseña) => {
    let res = "";
    await axios
      .put(baseUrl + "/editarContraseña?pass=" + contraseña, {
        codigo: codigo,
      })
      .then((response) => {
        res = response.data;
      });
    return res;
  };