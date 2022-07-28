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

  //ログ用(TZは環境変数順守)
  const current_timestamp = Number(Date.now());
  const date = new Date(current_timestamp);
  const current_date = `${date.getFullYear()}/${toDoubleDigits(
    date.getMonth() + 1
  )}/${toDoubleDigits(date.getDate())}`;
  const current_time = `${toDoubleDigits(date.getHours())}:${toDoubleDigits(
    date.getMinutes()
  )}:${toDoubleDigits(date.getSeconds())}`;
  const operator_val =
    event.requestContext.authorizer.claims["cognito:username"];

  if (body.target === undefined) {
    body = JSON.parse(body);
  }
  //timestampだけNumber型
  const target_name_val = body.target_name;
  const target_val = body.target;
  const birthdayVal = body.birthday.replace(/-/g, "/");
  const memo_val = body.memo;
  const gender_val = body.gender;
  const telephone_val = body.telephone;

  //重複チェック
  const query_parames = {
    TableName: table_name,
    IndexName: "target-index",
    KeyConditionExpression:
      "#partitionKey = :partitionVal and #sortKey = :sortVal",
    ExpressionAttributeNames: {
      "#partitionKey": "role",
      "#sortKey": "target",
    },
    ExpressionAttributeValues: {
      ":partitionVal": "customer",
      ":sortVal": target_val,
    },
  };

  //顧客追加
  const create_parames = {
    TableName: table_name,
    Item: {
      role: "customer",
      time_stamp: current_timestamp,
      date: current_date,
      time: current_time,
      operator: operator_val,
      target: target_val,
      memo: memo_val,
      target_name: target_name_val,
      birthday: birthdayVal,
      gender: gender_val,
      telephone: telephone_val,
      info: "在籍中",
    },
  };

  //ログ
  const log_parames = {
    TableName: table_name,
    Item: {
      role: "log",
      time_stamp: current_timestamp,
      date: current_date,
      time: current_time,
      operator: operator_val,
      target: target_val,
      crud: "create",
      memo: memo_val,
      target_name: target_name_val,
      birthday: birthdayVal,
      gender: gender_val,
      telephone: telephone_val,
      info: "在籍中",
    },
  };

  //ここから実際の処理
  try {
    let result = await dynamo.query(query_parames).promise();
    if (result.Count === 0) {
      await dynamo.put(create_parames).promise();
      await dynamo.put(log_parames).promise();
      code = "200";
      message = "登録に成功しました。";
    } else {
      code = "201";
      message = "すでに存在している会員です。";
    }
  } catch (error) {
    console.log(error);
    code = 400;
    message = "不明なエラーです。管理者にお問い合わせください";
  }

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({ message: message, code: code }),
  };
};

//関数類
//０埋め関数
const toDoubleDigits = (num) => {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
  return num;
};
