const { default: axios } = require("axios");

// export const BASE_URL = "https://linkedin-clone-ctia.onrender.com"
 export const BASE_URL = "http://localhost:9000"
export const clientServer = axios.create({
  baseURL: BASE_URL,

});
