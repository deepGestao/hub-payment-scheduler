import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const getProcessDate = (planData) => {
  const now = new Date();
  const date = new Date();
  if (planData.frequencyType === 'months') {
    date.setMonth(now.getMonth() + planData.frequency);
  } else if (planData.frequencyType === 'days') {
    date.setDate(now.getDate() + planData.frequency);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day}T00:00:00.000Z`;
};

const sendDynamoDbRequest = async (content, customerData, planData, token) => {
  await dynamodb
    .putItem({
      TableName: `hub-payment-scheduler-queue-${process.env.AWS_ENV}`,
      Item: {
        token: { S: 'pending' },
        when: { S: `${token}|${new Date().toISOString()}` },
        frequency: { S: `${planData.frequency}` },
        frequencyType: { S: `${planData.frequencyType}` },
        reason: { S: `${planData.reason}` },
        amount: { S: `${planData.amount}` },
        originId: { S: `${content.origin}|${content.id}` },
        contact: { S: `${customerData.contact}` },
        // zipCode: { S: `${customerData.zipCode}` },
        // streetName: { S: `${content.streetName}` },
        // streetNumber: { S: `${content.streetNumber}` },
        subscriptionId: { S: `${content.subscriptionId}` },
        async: { S: `${content.async}` },
        createdAt: { S: `${new Date().toISOString()}` },
        dateToProcess: { S: `${getProcessDate(planData)}` },
      },
    })
    .promise();
};

export { sendDynamoDbRequest };
