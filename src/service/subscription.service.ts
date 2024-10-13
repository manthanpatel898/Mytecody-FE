import { makeRequest } from "../api-config/api-config";
import { IndividualProfile, Login, Proposal, Setting, Subscription, Wallet } from "../utils/api-list";


export async function fetchStripeProductsAPI() {
  try {
    const response = await makeRequest('get', Subscription.GET_SUBSCRIPTION_PRODUCT);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}


export async function createCheckoutSessionAPI() {
  try {
    const response = await makeRequest('get', Subscription.CHECKOUT_SESSION);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}


export async function createBillingSessionAPI() {
  try {
    const response = await makeRequest('get', Subscription.CREATE_BILLING_SESSION);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function getCustomerIntentAPI() {
  try {
    const response = await makeRequest('get', Subscription.CREATE_PAYMENT_INTENT);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

export async function verifySubscriptionAPI() {
  try {
    const response = await makeRequest('get', Subscription.VERIFY_SUBSCRIPTION);
    if (response && response.status === "success") {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    throw e;
  }
}

