import { DynamoDB } from 'aws-sdk';
import { getProcessDate } from '../sendDynamoDbRequest/sendDynamoDbRequest';

const dynamodb = new DynamoDB();

const sendDynamoDbRequestStatus = async (content, customerData, planData, token) => {
  const dateToProcess = getProcessDate(planData);
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
        expiresAt: { S: `${new Date(new Date(dateToProcess).setDate(new Date(dateToProcess).getDate() + 10)).toISOString()}` },
        attempts: { S: '0' },
        createdAt: { S: `${new Date().toISOString()}` },
      },
    })
    .promise();
};

export { sendDynamoDbRequestStatus };
