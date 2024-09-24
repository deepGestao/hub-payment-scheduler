import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const sendDynamoDbRequestStatus = async (content, customerData, planData, token) => {
  await dynamodb
    .putItem({
      TableName: `hub-payment-scheduler-status-${process.env.AWS_ENV}`,
      Item: {
        token: { S: `${token}` },
        status: { S: 'pending' },
        amount: { S: `${planData.amount}` },
        originId: { S: `${content.origin}|${content.id}` },
        customerId: { S: `${customerData.email}` },
        planId: { S: `${planData.token}` },
        subscriptionId: { S: `${content.subscriptionId}` },
        async: { S: `${content.async}` },
        attempts: { S: '0' },
        createdAt: { S: `${new Date().toISOString()}` },
      },
    })
    .promise();
};

export { sendDynamoDbRequestStatus };
