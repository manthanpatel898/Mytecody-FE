import { makeRequest } from "../api-config/api-config";
import { IndividualProfile } from "../utils/api-list";


export async function getIndividualProfileAPI() {
  try {
    const response = await makeRequest('get', IndividualProfile.FEATCH_PROFILE);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function createIndividualProfileAPI(payload:any) {
  try {
    const response = await makeRequest('post', IndividualProfile.CREATE_PROFILE,payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function updateIndividualProfileAPI(payload:any) {
  try {
    const response = await makeRequest('put', IndividualProfile.UPDATE_PROFILE,payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteIndividualProfileAPI(userId:any) {
  try {
    const response = await makeRequest('delete', IndividualProfile.DELETE_PROFILE + userId);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}