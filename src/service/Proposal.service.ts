import { makeRequest } from "../api-config/api-config";
import { Proposal } from "../utils/api-list";

export async function getProposalAPI(pageNumber: number) {
  try {
    const response = await makeRequest('get', Proposal.GET_PROPOSAL + pageNumber);
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
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function generateProjectVisionAPI(proposal_id: string) {
  try {
    const response = await makeRequest('post', Proposal.GENERATE_PROJECT_VISION + proposal_id);
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

export async function addEpicAPI(payload: any) {
  try {
    const response = await makeRequest('post', Proposal.ADD_EPICS, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function updateEpicAPI(payload: any) {
  try {
    const response = await makeRequest('put', Proposal.UPDATE_EPICS, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteEpicAPI(payload: any) {
  console.log('payload', payload)
  try {
    const response = await makeRequest('delete', Proposal.DELETE_EPICS, payload);
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

export async function generateTasksAPI(proposal_id: any) {
  try {
    const response = await makeRequest('post', Proposal.GENERATE_TASKS + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function addStorieAPI(payload: any) {
  try {
    const response = await makeRequest('post', Proposal.ADD_STORIE, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function updateStorieAPI(payload: any) {
  try {
    const response = await makeRequest('put', Proposal.UPDATE_STORIE, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function addTaskAPI(payload: any) {
  try {
    const response = await makeRequest('post', Proposal.ADD_TASK, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function updateTaskAPI(payload: any) {
  try {
    const response = await makeRequest('put', Proposal.UPDATE_TASK, payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function sendProposalAPI(proposal_id: any) {
  try {
    const response = await makeRequest('get', Proposal.SEND_PROPOSAL + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function generateProposalAPI(proposal_id: any) {
  try {
    const response = await makeRequest('get', Proposal.GENERATE_PROPOSAL + proposal_id);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteProposalAPI(proposalId: string) {
  try {
    const response = await makeRequest('delete', Proposal.DELETE_PROPOSAL + proposalId);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteEpicApi(proposalId: string,stackholder:string,epicId:string) {
  try {
    const response = await makeRequest('delete', Proposal.DELETE_EPIC + proposalId + '/' + stackholder + '/' + epicId);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteStorieApi(proposalId: string,stackholder:string,epicId:string, storieId: string) {
  try {
    const response = await makeRequest('delete', Proposal.DELETE_STORIE + proposalId + '/' + stackholder + '/' + epicId + '/' + storieId);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteTaskApi(proposalId: string,stackholder:string,epicId:string, storieId: string, taskId:string) {
  try {
    const response = await makeRequest('delete', Proposal.DELETE_TASK + proposalId + '/' + stackholder + '/' + epicId + '/' + storieId + '/' + taskId);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}