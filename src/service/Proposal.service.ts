import { makeRequest } from "../api-config/api-config";
import { Proposal } from "../utils/api-list";


export async function getConversation(proposal_id:string) {
  try {
    const response = await makeRequest('get', Proposal.GET_CONVERSATION + proposal_id);
    debugger
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function getProjectVision(proposal_id:string) {
    try {
      const response = await makeRequest('get', Proposal.GET_PROJECT_VISION + proposal_id);
      debugger
      if (response && response.status === "success") {
        return response;
      } else {
        throw response;
      }
    } catch (e) {
      throw e;
    }
  }