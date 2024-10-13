import { makeRequest } from "../api-config/api-config";
import { IndividualProfile, Login, Proposal, Setting, Wallet } from "../utils/api-list";


export async function getSettingAPI() {
  try {
    const response = await makeRequest('get', Setting.FEATCH_SETTING);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function updateSettingAPI(payload:any) {
  try {
    const response = await makeRequest('put', Setting.UPDATE_SETTING,payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}
