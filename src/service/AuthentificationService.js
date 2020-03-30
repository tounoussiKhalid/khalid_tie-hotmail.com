import axios from "axios";

const API_URL = "http://localhost:8080/api";

class AuthenticationService {
  async login(username, password) {
    console.log(username, ":", password);
    return axios.post(
      `${API_URL}/login`,
      { email: username, password },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}

export default new AuthenticationService();
