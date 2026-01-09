import axios from "axios";
let url = "https://tmes-backend-personal.onrender.com/api";

axios.defaults.baseURL = url;
axios.defaults.headers.post["Content-Type"] = "application/json";
