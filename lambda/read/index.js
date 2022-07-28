"use strict";

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const table_name = "iino-cms-table"; //テーブル

//CORS対策
const responseHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
  "Content-Type": "application/json; charset=utf-8",
};

//dynamoDBのqueryはよく予約語に引っかかるので、プレースホルダーで実行すること
exports.handler = async (event) => {
  let query_parameter = event.queryStringParameters;
  const partition_value = query_parameter.role;
  let sort_key;
  let sort_value;
  let index_name;
  let params;

  //指定がなければ全件取得
  if (Object.keys(query_parameter).length <= 1) {
    params = {
      TableName: table_name,
      KeyConditionExpression: "#partition_key = :partition_value",
      ScanIndexForward: false, //falseで降順ソート
      ExpressionAttributeNames: {
        "#partition_key": "role",
      },
      ExpressionAttributeValues: {
        ":partition_value": partition_value,
      },
    };
    //条件でソート
  } else {
    if (query_parameter.target != null) {
      sort_key = "target";
      if (query_parameter.target == "") {
        sort_value = "入力無し";
      } else {
        sort_value = query_parameter.target;
        index_name = "target-index";
      }
    } else if (query_parameter.operator != null) {
      sort_key = "operator";
      if (query_parameter.operator == "") {
        sort_value = "入力無し";
      } else {
        sort_value = query_parameter.operator;
        index_name = "operator-index";
      }
    } else if (query_parameter.target_name != null) {
      sort_key = "target_name";
      if (query_parameter.target_name == "") {
        sort_value = "入力無し";
      } else {
        sort_value = query_parameter.target_name;
        index_name = "target_name-index";
      }
    } else if (query_parameter.telephone != null) {
      sort_key = "telephone";
      if (query_parameter.telephone == "") {
        sort_value = "入力無し";
      } else {
        sort_value = query_parameter.telephone;
        index_name = "telephone-index";
      }
    } else if (query_parameter.date != null) {
      sort_key = "date";
      if (query_parameter["date"] == "") {
        sort_value = "入力無し";
      } else {
        sort_value = query_parameter["date"].replace(/-/g, "/");
        index_name = "date-index";
      }
    }
    params = {
      TableName: table_name,
      IndexName: index_name,
      //falseで降順（デフォルトtrue）
      ScanIndexForward: false,
      KeyConditionExpression:
        "#partition_key = :partition_value and #sort_key = :sort_value",
      ExpressionAttributeNames: {
        "#partition_key": "role",
        "#sort_key": sort_key,
      },
      ExpressionAttributeValues: {
        ":partition_value": partition_value,
        ":sort_value": sort_value,
      },
    };
  }

  const result = await dynamo
    .query(params)
    .promise()
    .catch((error) => {
      console.log(error);
      return {
        code: 400,
        message: "不明なエラーです。管理者にお問い合わせください",
      };
    });

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: JSON.stringify(result),
  };
};
