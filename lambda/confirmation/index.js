"use strict";

const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

const client_id = "5h3tpq2rjhlo99chsejc8ed82c";
const responseHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Content-Type": "application/json;charset=UTF-8",
};

exports.handler = async (event) => {
  let body = event.body;

  if (body.id === undefined) {
    body = JSON.parse(body);
  }

  const id = body.id;
  const confirmation_code = body.code;
  let message;
  let code;

  const params = {
    ClientId: client_id,
    Username: id,
    ConfirmationCode: confirmation_code,
  };

  result = await cognito
    .confirmSignUp(params)
    .promise()
    .then(() => {
      code = 200;
      message = "登録に成功しました";
    })
    .catch((error) => {
      switch (error.code) {
        case "CodeMismatchException":
          code = 201;
          message = "要求されたコードと異なります";
          break;
        case "ExpiredCodeException":
          code = 202;
          message = "コードの有効期限が切れています";
          break;
        case "TooManyFailedAttemptsException":
          code = 203;
          message =
            "アカウントロックがかかりました。しばらく時間をおいてから認証をしてください";
          break;
        case "UserNotFoundException":
          code = 204;
          message = "そのユーザーは存在していません";
          break;
        case "AliasExistsException":
          code = 205;
          message = "Emailが既に他のユーザーに使われています";
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
    body: JSON.stringify({ message: message, code: code }),
  };
};
