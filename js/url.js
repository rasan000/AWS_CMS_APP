"use strict";

//cognito
const pool_name = "iino-cms-pool";
const cognito_application_id = "5h3tpq2rjhlo99chsejc8ed82c";

//api_gateway
const API_URL = {
  login:
    "https://854f3ajouc.execute-api.ap-northeast-1.amazonaws.com/prod/login",
  signup:
    "https://854f3ajouc.execute-api.ap-northeast-1.amazonaws.com/prod/signup",
  confirmation:
    "https://854f3ajouc.execute-api.ap-northeast-1.amazonaws.com/prod/confirmation",
  read: "https://adxtd5t1t2.execute-api.ap-northeast-1.amazonaws.com/prod/read",
  delete:
    "https://adxtd5t1t2.execute-api.ap-northeast-1.amazonaws.com/prod/delete",
  create:
    "https://adxtd5t1t2.execute-api.ap-northeast-1.amazonaws.com/prod/create",
  update:
    "https://adxtd5t1t2.execute-api.ap-northeast-1.amazonaws.com/prod/update",
};
