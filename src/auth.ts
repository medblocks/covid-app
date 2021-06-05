import { token } from "./stores";
import { navigate } from "svelte-routing";
import { fhir, openehr } from "./services";
export const logout = (wrongLogin = false) => {
  localStorage.clear();
  token.set(localStorage.getItem("token"));
  if (wrongLogin) {
    navigate("/signin/invalid", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
};
export const login = (username, password) => {
  localStorage.setItem("token", `${username},${password}`);
  const localToken = localStorage.getItem("token");
  token.set(localToken);
  registerAxios(localToken);
  navigate("/", { replace: true });
};

export const registerAxios = (token: string) => {
  if (!token) {
    return;
  }
  const [username, password] = token.split(",");
  [fhir, openehr].forEach((service) => {
    service.defaults.auth = {
      username,
      password,
    };
    service.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const status = error?.response?.status;
        if (status === 401 || status == null) {
          logout(true);
        }
        return Promise.reject(error);
      }
    );
  });
};
