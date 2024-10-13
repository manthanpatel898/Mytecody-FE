import { makeRequest } from "../api-config/api-config";
import { Login } from "../utils/api-list";


export async function login(payload:any) {
  try {
    const response = await makeRequest('post', Login.USER_LOGIN,payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function signup(payload:any) {
  try {
    const response = await makeRequest('post', Login.USER_SIGNUP,payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}
