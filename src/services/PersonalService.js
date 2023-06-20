import axios from "axios";

const baseUrl = "http://localhost:8080/personal";

export async function getPersonal() {
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


export async function createPersonal(personal) {
    let res = undefined;

    await axios.post(baseUrl + "/guardar", personal).then(
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

export async function updatePersonal(personal) {
    let res = undefined;

    await axios.put(baseUrl + "/actualizar", personal).then(
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

export async function bloquearPersonal(id) {
    let res = undefined;

    await axios.post(baseUrl + "/eliminar?id=" + id).then(
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

export async function createPersonaPersonal(persona) {
    let res = undefined;

    await axios.post(baseUrl + "/crearPersona", persona).then(
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

export async function searchPersonalById(id) {
    let res = undefined;

    await axios.get(baseUrl + "/" + id).then(
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



export async function suspenderPersonal(id, fecha) {
    let res = undefined;

    await axios.post(baseUrl + "/suspenderPersonal?id=" + id + "&fecha=" + fecha).then(
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