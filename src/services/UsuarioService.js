import axios from "axios";

const baseUrl = "http://localhost:8080/";

export async function login(usuario) {
    let res = undefined;

    await axios.post(baseUrl + "usuarios/login", usuario).then(
        response => {
            if (response.data.usuario !== null){
                res = response;
            }else {
                res = "UYCI";
            }
            
        }
    ).catch(
        error => {
            console.log(error);
            res = "errorConexion";
        }
    );

    return res;
}

