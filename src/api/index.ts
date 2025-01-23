import axios from "axios"

let baseURL = import.meta.env.VITE_API_BASE_URL;

const isDevelopment = import.meta.env.MODE === "development"
if (!isDevelopment) {
  // Update this later when you have a working backend server
}

export const api = axios.create({
  baseURL
})

// use this to handle errors gracefully
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 500) {
//       throw new Error(error.response.data)
//     }
//   }
// )

//export default api
