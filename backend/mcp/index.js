#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load credentials from backend .env
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');
let MASTER_KEY, APP_ID;

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const env = Object.fromEntries(
    envContent.split('\n')
      .filter(line => line.trim() && !line.startsWith('#') && line.includes('='))
      .map(line => {
        const [key, ...rest] = line.split('=');
        return [key.trim(), rest.join('=').trim()];
      })
  );
  MASTER_KEY = env.MASTER_KEY;
  APP_ID = env.APP_ID;
} catch {
  MASTER_KEY = process.env.PARSE_MASTER_KEY;
  APP_ID = process.env.PARSE_APP_ID || 'elimu-smart-production';
}

const PARSE_URL = 'https://elimu-smart.co.ke/parse';
const headers = {
  'X-Parse-Application-Id': APP_ID,
  'X-Parse-Master-Key': MASTER_KEY,
  'Content-Type': 'application/json',
};

const server = new Server(
  { name: 'elimu-parse', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'parse_health',
      description: 'Check Parse Server health status',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'parse_call',
      description: 'Call a Parse Cloud Function by name with optional params',
      inputSchema: {
        type: 'object',
        properties: {
          function: { type: 'string', description: 'Cloud function name (e.g. getAdminSystemMetrics)' },
          params: { type: 'object', description: 'Parameters to pass to the function' },
        },
        required: ['function'],
      },
    },
    {
      name: 'parse_query',
      description: 'Query any Parse class with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          className: { type: 'string', description: 'Parse class name (e.g. _User, Career, RiasecAssessment)' },
          where: { type: 'object', description: 'Filter conditions (e.g. {"role": "student"})' },
          limit: { type: 'number', description: 'Max results (default 10, max 100)' },
          order: { type: 'string', description: 'Sort field, prefix - for descending (e.g. -createdAt)' },
          keys: { type: 'string', description: 'Comma-separated fields to return' },
        },
        required: ['className'],
      },
    },
    {
      name: 'parse_count',
      description: 'Count records in a Parse class with optional filter',
      inputSchema: {
        type: 'object',
        properties: {
          className: { type: 'string' },
          where: { type: 'object' },
        },
        required: ['className'],
      },
    },
    {
      name: 'parse_get',
      description: 'Get a specific Parse object by class and objectId',
      inputSchema: {
        type: 'object',
        properties: {
          className: { type: 'string' },
          objectId: { type: 'string' },
        },
        required: ['className', 'objectId'],
      },
    },
    {
      name: 'parse_classes',
      description: 'List all Parse classes (schema overview)',
      inputSchema: { type: 'object', properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'parse_health') {
      const res = await fetch(`${PARSE_URL}/health`);
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'parse_call') {
      const res = await fetch(`${PARSE_URL}/functions/${args.function}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(args.params || {}),
      });
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'parse_query') {
      const params = new URLSearchParams();
      if (args.where) params.set('where', JSON.stringify(args.where));
      params.set('limit', String(Math.min(args.limit || 10, 100)));
      if (args.order) params.set('order', args.order);
      if (args.keys) params.set('keys', args.keys);
      params.set('count', '1');

      const res = await fetch(`${PARSE_URL}/classes/${args.className}?${params}`, { headers });
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'parse_count') {
      const params = new URLSearchParams({ count: '1', limit: '0' });
      if (args.where) params.set('where', JSON.stringify(args.where));

      const res = await fetch(`${PARSE_URL}/classes/${args.className}?${params}`, { headers });
      const data = await res.json();
      return { content: [{ type: 'text', text: `${args.className} count: ${data.count}` }] };
    }

    if (name === 'parse_get') {
      const res = await fetch(`${PARSE_URL}/classes/${args.className}/${args.objectId}`, { headers });
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    if (name === 'parse_classes') {
      const res = await fetch(`${PARSE_URL}/schemas`, { headers });
      const data = await res.json();
      const classes = (data.results || []).map(s => s.className).join('\n');
      return { content: [{ type: 'text', text: classes } ] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
