import { makeRequest } from "../api-config/api-config";
import { Login, Proposal, Wallet } from "../utils/api-list";


export async function getWalletInfo() {
  try {
    const response = await makeRequest('get', Wallet.WALLET_INFO);
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
