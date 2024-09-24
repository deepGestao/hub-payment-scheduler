import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const sendDynamoDbRequestStatus = async (content, customerData, planData, token) => {
  await dynamodb
    .putItem({
      TableName: `hub-payment-scheduler-status-${process.env.AWS_ENV}`,
      Item: {
        token: { S: `${token}` },
        status: { S: 'pending' },
        frequency: { S: `${planData.frequency}` },
        frequencyType: { S: `${planData.frequencyType}` },
        reason: { S: `${planData.reason}` },
        amount: { S: `${planData.amount}` },
        originId: { S: `${content.origin}|${content.id}` },
        contact: { S: `${customerData.contact}` },
        zipCode: { S: `${customerData.zipCode}` },
        streetName: { S: `${content.streetName}` },
        streetNumber: { S: `${content.streetNumber}` },
        subscriptionId: { S: `${content.subscriptionId}` },
        async: { S: `${content.async}` },
        attempts: { S: '0' },
        createdAt: { S: `${new Date().toISOString()}` },
      },
    })
    .promise();
};

export { sendDynamoDbRequestStatus };
