import axios from "axios";
export const Apiurl = "http://localhost:8080/";

export const nuevaMulta = async (multa) => {
    let res = {};
    await axios.post(Apiurl + "multas/nuevaMulta", multa).then((response) => {
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