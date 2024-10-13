import { makeRequest } from "../api-config/api-config";
import { Login, Proposal, Wallet } from "../utils/api-list";


export async function getWalletInfoAPI() {
  try {
    const response = await makeRequest('get', Wallet.WALLET_INFO);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function rechargeWalletAPI(payload:any) {
  try {
    const response = await makeRequest('post', Wallet.RECHARGE_WALLET,payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function getPaymentMethodAPI() {
  try {
    const response = await makeRequest('get', Wallet.GET_PAYMENT_METHOD);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}


export async function addPaymentMethodAPI(payload:any) {
  try {
    const response = await makeRequest('post', Wallet.ADD_PAYMENT_METHOD,payload);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}