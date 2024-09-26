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
  date.setDate(date.getDate() - 10);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day}T00:00:00.000Z`;
};

const sendDynamoDbRequest = async (content, customerData, planData, token) => {
  const dateToProcess = content.date || getProcessDate(planData);
  const expiresAt = content.expiresAt ||
  new Date(new Date(dateToProcess).setDate(new Date(dateToProcess).getDate() + 10)).toISOString();
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
        email: { S: `${customerData.email}` },
        customerId: { S: `${customerData.token}` },
        name: { S: `${customerData.name}` },
        lastName: { S: `${customerData.lastName}` },
        zipCode: { S: `${customerData.address.zipCode}` },
        streetName: { S: `${customerData.address.streetName}` },
        streetNumber: { S: `${customerData.address.streetNumber}` },
        subscriptionId: { S: `${content.subscriptionId}` },
        async: { S: `${content.async}` },
        createdAt: { S: `${new Date().toISOString()}` },
        dateToProcess: { S: `${dateToProcess}` },
        expiresAt: { S: `${expiresAt}` },
        planId: { S: `${content.planId}` },
        paymentMethod: { S: `${content.paymentMethod}` },
        document: { S: customerData.document },
      },
    })
    .promise();
};

export { sendDynamoDbRequest, getProcessDate };
