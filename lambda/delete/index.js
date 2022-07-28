"use strict";

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const table_name = "iino-cms-table"; //テーブル

//CORS対策
const responseHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  let body = event.body;
  let code;
  let message;

  //ログ用データ(TZは環境変数)
  const current_time_stamp = Number(Date.now());
  const date = new Date(current_time_stamp);
  const current_date = `${date.getFullYear()}/${toDoubleDigits(
    date.getMonth() + 1
  )}/${toDoubleDigits(date.getDate())}`;
  const current_time = `${toDoubleDigits(date.getHours())}:${toDoubleDigits(
    date.getMinutes()
  )}:${toDoubleDigits(date.getSeconds())}`;
  const operator_value =
    event.requestContext.authorizer.claims["cognito:username"];

  if (body.time_stamp === undefined) {
    body = JSON.parse(body);
  }
  //timestampだけNumber型
  const time_stamp_value = Number(body.time_stamp);
  const target_value = body.target;

  //削除用パラメーター
  const delete_parames = {
    TableName: table_name,
    Key: {
      role: "customer",
      time_stamp: time_stamp_value,
    },
  };

  //ログ用パラメータ
  const log_parames = {
    TableName: table_name,
    Item: {
      role: "log",
      time_stamp: current_time_stamp,
      date: current_date,
      time: current_time,
      operator: operator_value,
      target: target_value,
      crud: "delete",
      info: "顧客情報削除済み",
    },
  };

  try {
    await dynamo.delete(delete_parames).promise();
    await dynamo.put(log_parames).promise();
    code = 200;
    message = "削除に成功しました。";
  } catch (error) {
    code = 201;
    message = "不明なエラーです。管理者にお問い合わせください";
    console.log(error);
  }

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({ message: message, code: code }),
  };
};

//日付用０埋め関数
const toDoubleDigits = (num) => {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
  return num;
};
