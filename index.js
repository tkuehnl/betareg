const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'product-inventory';
const healthPath = '/health';
const developerPath = '/developer';
const developersPath = '/developers';

exports.handler = async function(event) {
  console.log('Request event: ', event);
  let response;
  switch(true) {
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === 'GET' && event.path === developerPath:
      response = await getDeveloper(event.queryStringParameters.developerId);
      break;
    case event.httpMethod === 'GET' && event.path === developersPath:
      response = await getDevelopers();
      break;
    case event.httpMethod === 'POST' && event.path === developerPath:
      response = await saveDeveloper(JSON.parse(event.body));
      break;
    case event.httpMethod === 'PATCH' && event.path === developerPath:
      const requestBody = JSON.parse(event.body);
      response = await modifyDeveloper(requestBody.developerId, requestBody.updateKey, requestBody.updateValue);
      break;
    case event.httpMethod === 'DELETE' && event.path === developerPath:
      response = await deleteDeveloper(JSON.parse(event.body).developerId);
      break;
    default:
      response = buildResponse(404, '404 Not Found');
  }
  return response;
}

async function getDeveloper(developerId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': developerId
    }
  }
  return await dynamodb.get(params).promise().then((response) => {
    return buildResponse(200, response.Item);
  }, (error) => {
    console.error('getDeveloper error: ', error);
  });
}

async function getDevelopers() {
  const params = {
    TableName: dynamodbTableName
  }
  const allDevelopers = await scanDynamoRecords(params, []);
  const body = {
    developers: allDevelopers
  }
  return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    console.error('scanDynamoRecords Error: ', error);
  }
}

async function saveDeveloper(requestBody) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: requestBody
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('saveDeveloper Error: ', error);
  })
}

async function modifyDeveloper(developerId, updateKey, updateValue) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': developerId
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': updateValue
    },
    ReturnValues: 'UPDATED_NEW'
  }
  return await dynamodb.update(params).promise().then((response) => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS',
      UpdatedAttributes: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('modifyDeveloper Error: ', error);
  })
}

async function deleteDeveloper(developerId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': developerId
    },
    ReturnValues: 'ALL_OLD'
  }
  return await dynamodb.delete(params).promise().then((response) => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
      Item: response
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('deleteDeveloper Error: ', error);
  })
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}