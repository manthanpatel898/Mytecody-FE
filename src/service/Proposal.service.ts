import { makeRequest } from "../api-config/api-config";
import { Proposal } from "../utils/api-list";

export async function getProposalAPI(pageNumber: number) {
  try {
    const response = await makeRequest('get', Proposal.GET_PROPOSAL + pageNumber);
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



export async function getConversation(proposal_id: string) {
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

export async function getProjectVision(proposal_id: string) {
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

export async function generateConversationAPI(payload: any) {
  try {
    const response = await makeRequest('post', Proposal.GENERATE_CONVERSATION, payload);
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

export async function saveConversationAPI(proposal_id: string) {
  try {
    const response = await makeRequest('post', Proposal.CONVERSATION_SAVE + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function saveVisionAPI(payload: any) {
  try {
    const response = await makeRequest('post', Proposal.VISION_SAVE, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function getBusinessVerticalAPI(proposal_id: any) {
  try {
    const response = await makeRequest('get', Proposal.GET_BUSINESS_VERTICAL + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function saveBusinessVerticalAPI(payload: any) {
  try {
    const response = await makeRequest('post', Proposal.UPDATE_BUSINESS_VERTICAL, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}


export async function getStackholderAPI(proposal_id: any) {
  try {
    const response = await makeRequest('get', Proposal.GET_STACKHOLDER + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function saveStackholderAPI(payload: any) {
  try {
    const response = await makeRequest('post', Proposal.UPDATE_STACKHOLDER, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function generateEpicsAPI(proposal_id: any) {
  try {
    const response = await makeRequest('post', Proposal.GENERATE_EPICS + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function getAllEpicsApi(proposal_id: any) {
  try {
    const response = await makeRequest('get', Proposal.GET_ALL_EPICS + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function getEpicsFromStackholderAPI(proposal_id: any, stackholder: string) {
  try {
    const response = await makeRequest('get', Proposal.GET_EPICS_BASED_STACKHOLDER + proposal_id + '/' + stackholder);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function addEpicAPI(payload:any) {
  try {
    const response = await makeRequest('post', Proposal.ADD_EPICS , payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function updateEpicAPI(payload:any) {
  try {
    const response = await makeRequest('put', Proposal.UPDATE_EPICS , payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteEpicAPI(payload:any) {
  console.log('payload',payload)
  try {
    const response = await makeRequest('delete', Proposal.DELETE_EPICS , payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function generateStoriesAPI(proposal_id: any) {
  try {
    const response = await makeRequest('post', Proposal.GENERATE_STORIES + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}


export async function addStorieAPI(payload:any) {
  try {
    const response = await makeRequest('post', Proposal.ADD_STORIE , payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function updateStorieAPI(payload:any) {
  try {
    const response = await makeRequest('put', Proposal.UPDATE_STORIE , payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}