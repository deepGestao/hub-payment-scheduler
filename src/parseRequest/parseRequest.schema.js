const schema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'id',
    'origin',
    'planId',
    'paymentMethod',
    'customerId',
    'subscriptionId',
    'async',
  ],
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 255 },
    origin: { type: 'string', minLength: 1, maxLength: 255 },
    customerId: { type: 'string', minLength: 1, maxLength: 255 },
    subscriptionId: { type: 'string', minLength: 1, maxLength: 255 },
    planId: { type: 'string', minLength: 1, maxLength: 255 },
    date: {
      type: 'string', minLength: 1, maxLength: 255, format: 'date-time',
    },
    token: { type: 'string', minLength: 1, maxLength: 255 },
    async: { type: 'boolean' },
    paymentMethod: { type: 'string', enum: ['pix', 'boleto'] },
  },
};

export { schema };
