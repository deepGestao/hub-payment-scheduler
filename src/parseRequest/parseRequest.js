import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { schema } from './parseRequest.schema';

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(schema);

const parseRequest = (content) => {
  const result = validate(content);
  return result;
};

export { parseRequest };
