import Ajv from 'ajv';
import { schema } from './parseRequest.schema';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const parseRequest = (content) => {
  const result = validate(content);
  return result;
};

export { parseRequest };
