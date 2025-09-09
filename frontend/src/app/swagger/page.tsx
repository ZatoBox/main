'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const spec = {
  openapi: '3.0.0',
  info: {
    title: 'ZatoBox API',
    version: '1.0.0',
  },
  servers: [
    {
      url: typeof window !== 'undefined' ? window.location.origin : '',
    },
  ],
  paths: {
    '/api/subscriptions/products': {
      get: {
        summary: 'Get subscription products',
        responses: {
          200: {
            description: 'List of products',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/subscriptions/checkout': {
      post: {
        summary: 'Create checkout session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  plan: { type: 'string' },
                  cycle: { type: 'string' },
                },
                required: ['userId', 'plan', 'cycle'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Checkout URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    checkoutUrl: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default function SwaggerPage() {
  return <SwaggerUI spec={spec} />;
}
