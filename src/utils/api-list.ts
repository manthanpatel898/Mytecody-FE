export const Login ={
    USER_LOGIN:'auth/signin',
    USER_SIGNUP:'auth/signup'
}

export const Proposal = {
    GET_CONVERSATION:'proposal/get/conversation/',
    GET_PROJECT_VISION:'proposal/get/projectVision/',
    GENERATE_CONVERSATION:'proposal/generate/conversation',
    GET_PROPOSAL:'proposal/get/proposals/page/',
    CONVERSATION_SAVE:'proposal/conversation/save/',
    VISION_SAVE:'proposal/save/vision',
    GET_BUSINESS_VERTICAL:'proposal/get/businessVertical/',
    UPDATE_BUSINESS_VERTICAL:'proposal/update/businessVertical',
    GET_STACKHOLDER:'proposal/get/stakeholders/',
    UPDATE_STACKHOLDER:'proposal/update/stakeholders',
    GENERATE_EPICS:'proposal/generate/epics/',
    ADD_EPICS:'proposal/addEpic',
    UPDATE_EPICS:'proposal/updateEpic',
    DELETE_EPICS:'proposal/deleteEpic',
    GET_ALL_EPICS:'proposal/epics/',
    GET_EPICS_BASED_STACKHOLDER:'proposal/epics/',
    GENERATE_STORIES:'proposal/generate/storie/',
    ADD_STORIE:'proposal/add/story',
    ADD_TASK:'proposal/add/task',
    UPDATE_STORIE:'proposal/update/story',
    UPDATE_TASK:'proposal/update/task',
    GENERATE_TASKS:'proposal/generate/tasks/',
    SEND_PROPOSAL:'proposal/generate/detail/report/',
    GENERATE_PROPOSAL:'proposal/generate/proposal/',
    DELETE_PROPOSAL:'proposal/delete/proposal/'
}

export const Wallet = {
    WALLET_INFO:'wallet/info',
    RECHARGE_WALLET:'wallet/recharge',
    GET_PAYMENT_METHOD:'wallet/payment-methods',
    ADD_PAYMENT_METHOD:'wallet/attach-payment-method'
}

export const IndividualProfile = {
    CREATE_PROFILE:'individual/user/profile',
    FEATCH_PROFILE:'individual/user/profile',
    UPDATE_PROFILE:'individual/user/profile',
    DELETE_PROFILE:'individual/user/profile/',
}

export const Setting = {
    FEATCH_SETTING:'user/settings',
    UPDATE_SETTING:'user/settings/update'
}

export const Subscription = {
    GET_SUBSCRIPTION_PRODUCT: 'subscription/products',
    CHECKOUT_SESSION: 'subscription/get-customer-intent',
    CREATE_BILLING_SESSION: 'subscription/create-billing-session',
    CREATE_PAYMENT_INTENT: 'subscription/create-payment-intent',
    VERIFY_SUBSCRIPTION: 'subscription/verify-subscription'
}