/* eslint-disable max-statements */
import uuid4 from 'uuid4';
import { parseRequest } from './parseRequest/parseRequest';
import { sendDynamoDbRequest } from './sendDynamoDbRequest/sendDynamoDbRequest';
import { requestDynamoDbCustomer } from './requestDynamoDbCustomer/requestDynamoDbCustomer';
import { requestDynamoDbPlan } from './requestDynamoDbPlan/requestDynamoDbPlan';
import { sendDynamoDbRequestStatus } from './sendDynamoDbRequestStatus/sendDynamoDbRequestStatus';
import { verifyIfOrderIsProcessed } from './verifyIfOrderIsProcessed/verifyIfOrderIsProcessed';

const processItem = async (content) => {
  const token = content.token || uuid4();
  const isSuccess = await verifyIfOrderIsProcessed(token);
  if (!isSuccess) {
    const isToUpdateStatus = !content.token;
    const customerData = await requestDynamoDbCustomer(content.customerId);
    const planData = await requestDynamoDbPlan(content.planId);
    await sendDynamoDbRequest(content, customerData, planData, token);
    if (isToUpdateStatus) {
      await sendDynamoDbRequestStatus(content, customerData, planData, token);
    }
  }
  return token;
};

const handler = async (event, context) => {
  console.log(event, context);
  try {
    const content = JSON.parse(event.body).detail;
    console.log(content);
    const validate = parseRequest(content);
    if (validate) {
      const token = await processItem(content);
      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    }
    return {
      statusCode: 400,
      body: '{}',
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'internal server error' }),
    };
  }
};

export { handler };
