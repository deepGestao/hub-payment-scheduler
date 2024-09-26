import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const verifyIfOrderIsProcessed = async (token) => {
  let result = false;
  const response = await dynamodb.getItem({
    TableName: `hub-payment-scheduler-status-${process.env.AWS_ENV}`,
    Key: {
      token: { S: token },
    },
  }).promise();
  if (response.Item) {
    const data = DynamoDB.Converter.unmarshall(response.Item);
    result = data.status === 'processed';
  }
  return result;
};

export { verifyIfOrderIsProcessed };
