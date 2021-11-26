const express = require('express')
const AWS = require("aws-sdk");
const { DynamoDB } = require('aws-sdk');
const router = express.Router()

const awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": "AKIA45YIOSIC52UJAU6S", "secretAccessKey": "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"
};

AWS.config.update(awsConfig);

const dynamoDBTableName = 'users'
const docClient = new AWS.DynamoDB.DocumentClient();

//Get All
router.get('/', async(req, res) =>{
    const params = {
        TableName: dynamoDBTableName,
        Key: {
            "email_id": req.query.email_id
        }
    };
    try{
        const allEmails = await scanDynamoRecords(params, [])
        const body = {
            emails: allEmails
        }
        res.json(body)
    }catch(error){
        console.error('Error:', error)
        res.status(500).send(error)
    }

})

//Get by id
router.get('/:email_id', async(req, res)=>{
    res.send({type:'GET'})
    const params = {
        TableName: dynamoDBTableName,
        Key: {
            "email_id": req.query.email_id
        }
    };
    await docClient.get(params).promise().then(response => {
        res.json(response.Item)
    }, error => {
        console.error('Error:', error)
        res.status(500).send(error)
    
    })
})


router.post('/', async (req, res) => {
    const params = {
      TableName: dynamodbTableName,
      Item: req.body
    }
    await dynamodb.put(params).promise().then(() => {
      const body = {
        Operation: 'SAVE',
        Message: 'SUCCESS',
        Item: req.body
      }
      res.json(body);
    }, error => {
      console.error('Error', error);
      res.status(500).send(error);
    })
  })

router.patch('/', async (req, res) => {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'email_id': req.body.email_id
      },
      UpdateExpression: `set ${req.body.updateKey} = :value`,
      ExpressionAttributeValues: {
        ':value': req.body.updateValue
      },
      ReturnValues: 'UPDATED_NEW'
    }
    await dynamodb.update(params).promise().then(response => {
      const body = {
        Operation: 'UPDATE',
        Message: 'SUCCESS',
        UpdatedAttributes: response
      }
      res.json(body);
    }, error => {
      console.error('Error', error);
      res.status(500).send(error);
    })
  })


router.delete('/', async (req, res) => {
    const params = {
      TableName: dynamodbTableName,
      Key: {
        'email_id': req.body.email_id
      },
      ReturnValues: 'ALL_OLD'
    }
    await dynamodb.delete(params).promise().then(response => {
      const body = {
        Operation: 'DELETE',
        Message: 'SUCCESS',
        Item: response
      }
      res.json(body);
    }, error => {
      console.error('Error', error);
      res.status(500).send(error);
    })
  })

async function scanDynamoRecords(scanParams, itemArray) {
    try {
      const dynamoData = await docClient.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartKey = dynamoData.LastEvaluatedKey;
        return await scanDynamoRecords(scanParams, itemArray);
      }
      return itemArray;
    } catch(error) {
      throw new Error(error);
    }
  }

module.exports = router
