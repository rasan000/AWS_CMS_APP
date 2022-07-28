"use strict";

const client_id = "5h3tpq2rjhlo99chsejc8ed82c";
const responseHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Content-Type": "application/json; charset=UTF-8",
};
const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  let body = event.body;

  if (body.id === undefined) {
    body = JSON.parse(body);
  }

  const id = body.id;
  const password = body.password;
  const name = body.name;
  const mail = body.mail;
  let code;
  let message;

  const params = {
    ClientId: client_id,
    Username: id,
    Password: password,
    UserAttributes: [
      //任意属性
      { Name: "name", Value: name },
      { Name: "email", Value: mail },
    ],
  };

  if (mail.match(/^.+@artifacture.co.jp$/)) {
    await cognito
      .signUp(params)
      .promise()
      .then(() => {
        code = 200;
        message = "仮登録に成功しました";
      })
      .catch((error) => {
        switch (error.code) {
          case "UsernameExistsException":
            code = 201;
            message = "ユーザー固有IDが重複しています";
            break;
          case "InvalidPasswordException":
            code = 202;
            message = "パスワードの強度が条件を満たしていません";
            break;
          case "InvalidParameterException":
            code = 203;
            message = "必須項目が入力されておりません";
            break;
          default:
            code = 400;
            message = "不明なエラーです。管理者にお問い合わせください";
            break;
        }
      });
  } else {
    code = 204;
    message = "メールアドレスが指定された形式ではありません";
  }

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({ message: message, code: code }),
  };
};
