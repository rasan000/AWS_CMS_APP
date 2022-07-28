"use strict";

const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

const client_id = "5h3tpq2rjhlo99chsejc8ed82c";
const responseHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Content-Type": "application/json;charset=utf=8",
};

exports.handler = async (event) => {
  let body = event.body;

  if (body.id === undefined) {
    body = JSON.parse(body);
  }

  const id = body.id;
  const password = body.password;
  let code;
  let message;
  let IdToken = "";

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: client_id,
    AuthParameters: {
      USERNAME: id, //cognito設定によりメールアドレス、ID共に使用可
      PASSWORD: password, //必須
    },
  };

  await cognito
    .initiateAuth(params)
    .promise()
    .then((result) => {
      code = 200;
      message = "ログインに成功しました";
      IdToken = result.AuthenticationResult.AccessToken;
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case "NotAuthorizedException":
          code = 201;
          message = "IDもしくはパスワードが異なります";
          break;
        case "UserNotConfirmedException":
          code = 202;
          message = "認証が完了していないユーザーです";
          break;
        default:
          code = 400;
          message = "不明なエラーです。管理者にお問い合わせください";
          break;
      }
    });

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({ message: message, IdToken: IdToken, code: code }),
  };
};
