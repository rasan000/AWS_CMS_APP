"use strict";

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const table_name = "iino-cms-table";

//CORS対策
const responseHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Content-Type": "application/json; charset=utf-8",
};

exports.handler = async (event) => {
  let body = event.body;
  let message;
  let code;

  //ログ用(TZは環境変数参照)
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
  const target_name_value = body.target_name;
  const target_value = body.target;
  const birthday_value = body.birthday;
  const memo_value = body.memo;
  const gender_value = body.gender;
  const telephone_value = body.telephone;
  const info_value = body.info;

  //更新内容
  const update_parames = {
    TableName: table_name,
    Key: {
      role: "customer",
      time_stamp: time_stamp_value,
    },
    //予約語が多いのでプレースホルダーで
    UpdateExpression:
      "set #memo_key=:memo_value,#birthday_key=:birthday_value,#gender_key=:gender_value,#target_name_key=:target_name_value,#telephone_key=:telephone_value,#info_key=:info_value",

    ExpressionAttributeNames: {
      "#memo_key": "memo",
      "#birthday_key": "birthday",
      "#gender_key": "gender",
      "#target_name_key": "target_name",
      "#telephone_key": "telephone",
      "#info_key": "info",
    },
    ExpressionAttributeValues: {
      ":memo_value": memo_value,
      ":target_name_value": target_name_value,
      ":birthday_value": birthday_value,
      ":gender_value": gender_value,
      ":telephone_value": telephone_value,
      ":info_value": info_value,
    },
    Return_valueues: "UPDATED_NEW",
  };

  //ログ更新用
  const log_parames = {
    TableName: table_name,
    Item: {
      role: "log",
      time_stamp: current_time_stamp,
      date: current_date,
      time: current_time,
      operator: operator_value,
      target: target_value,
      crud: "update",
      memo: memo_value,
      target_name: target_name_value,
      birthday: birthday_value,
      gender: gender_value,
      telephone: telephone_value,
      info: info_value,
    },
  };

  try {
    await dynamo.update(update_parames).promise();
    await dynamo.put(log_parames).promise();
    message = "更新に成功しました";
    code = 200;
  } catch (error) {
    message = "不明なエラーです。管理者にお問い合わせください";
    code = 400;
  }

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify({
      message: message,
      code: code,
    }),
  };
};

//ログ用０埋め関数
const toDoubleDigits = (num) => {
  num += "";
  if (num.length === 1) {
    num = "0" + num;
  }
  return num;
};
