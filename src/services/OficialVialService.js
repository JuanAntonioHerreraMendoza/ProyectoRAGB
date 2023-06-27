import axios from "axios";

const baseUrl = "http://localhost:8080/oficial";

export async function getOficialesViales() {
    let res = undefined;

    await axios.get(baseUrl + "/all").then(
        response => {
            res = response.data;
        }
    ).catch(
        error => {
            console.log(error);
            res = "errorGetPersonal";
        }
    );
    return res;
};


export async function createOficial(oficial) {
    let res = undefined;

    await axios.post(baseUrl + "/guardar", oficial).then(
        response => {
            res = response;
        }
    ).catch(
        error => {
            console.log(error);
            res = "createErrorConexion";
        }
    );

    return res;
};

export async function updateOficial(oficial) {
    let res = undefined;

    await axios.put(baseUrl + "/actualizar", oficial).then(
        response => {
            res = response;
        }
    ).catch(
        error => {
            console.log(error);
            res = "updateErrorConexion";
        }
    );

    return res;
};

export async function bloquearOficial(placa) {
    let res = undefined;

    await axios.post(baseUrl + "/eliminar?placa=" + placa).then(
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

export async function createPersonaOficial(oficial) {
    let res = undefined;

    await axios.post(baseUrl + "/crearPersona", oficial).then(
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

export async function searchOficialByPlaca(placa) {
    let res = undefined;

    await axios.get(baseUrl + "/" + placa).then(
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



export async function suspenderOficial(placa, fecha) {
    let res = undefined;

    await axios.post(baseUrl + "/suspenderOficial?placa=" + placa + "&fecha=" + fecha).then(
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