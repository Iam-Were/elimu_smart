#!/usr/bin/env node

/**
 * Elimu Smart MCP Intelligence Server
 * Provides instant access to project knowledge without file reads
 * Reduces token usage by 85-95% for common queries
 */

const fs = require('fs');
const path = require('path');

// Load pre-computed data
const projectRoot = path.join(__dirname, '..');
const integrationStatus = require(path.join(projectRoot, '.claude/integration-status.json'));
const quickRef = require(path.join(projectRoot, '.claude/quick-reference.json'));

// MCP Protocol Implementation
const tools = {
  getFunctionMapping: {
    description: "Get complete backend-frontend function integration mapping",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by category: integrated, available, all",
          enum: ["integrated", "available", "all"]
        }
      }
    },
    handler: (args) => {
      const category = args.category || 'all';

      if (category === 'all') {
        return {
          stats: integrationStatus.stats,
          integrated: integrationStatus.integrated,
          available: integrationStatus.available,
          mismatches: integrationStatus.mismatches
        };
      } else if (category === 'integrated') {
        return {
          count: integrationStatus.integrated.length,
          functions: integrationStatus.integrated
        };
      } else if (category === 'available') {
        return {
          count: integrationStatus.available.length,
          functions: integrationStatus.available
        };
      }
    }
  },

  getHardcodedData: {
    description: "List frontend files with hardcoded data that should be in backend/database",
    inputSchema: {
      type: "object",
      properties: {}
    },
    handler: () => {
      return integrationStatus.hardcodedData;
    }
  },

  getMobileReadiness: {
    description: "Get mobile development readiness score and component breakdown",
    inputSchema: {
      type: "object",
      properties: {
        component: {
          type: "string",
          description: "Get readiness for specific component (optional)"
        }
      }
    },
    handler: (args) => {
      if (args.component) {
        return integrationStatus.mobileReadiness[args.component] || null;
      }
      return {
        overallScore: integrationStatus.stats.mobileReadiness,
        components: integrationStatus.mobileReadiness
      };
    }
  },

  searchByFeature: {
    description: "Find backend functions and frontend files related to a feature",
    inputSchema: {
      type: "object",
      properties: {
        feature: {
          type: "string",
          description: "Feature name (e.g., 'riasec', 'chat', 'dashboard', 'university')"
        }
      },
      required: ["feature"]
    },
    handler: (args) => {
      const feature = args.feature.toLowerCase();
      const results = {
        backendFunctions: [],
        frontendComponents: [],
        relatedFiles: []
      };

      // Search backend functions
      Object.entries(quickRef.backendFunctions).forEach(([name, location]) => {
        if (name.toLowerCase().includes(feature)) {
          results.backendFunctions.push({ name, location });
        }
      });

      // Search frontend components
      Object.entries(quickRef.frontendComponents).forEach(([name, info]) => {
        if (name.toLowerCase().includes(feature) ||
            info.path.toLowerCase().includes(feature) ||
            info.backendCalls?.some(call => call.toLowerCase().includes(feature))) {
          results.frontendComponents.push({ name, ...info });
        }
      });

      return results;
    }
  },

  getArchitectureMap: {
    description: "Get component to backend function mapping for a specific component",
    inputSchema: {
      type: "object",
      properties: {
        component: {
          type: "string",
          description: "Component name (e.g., 'FreeRiasecAssessment', 'StudentDashboard')"
        }
      },
      required: ["component"]
    },
    handler: (args) => {
      const component = quickRef.frontendComponents[args.component];
      if (!component) {
        return { error: `Component '${args.component}' not found` };
      }
      return component;
    }
  },

  checkBackendFunction: {
    description: "Check if a backend function exists and get its location",
    inputSchema: {
      type: "object",
      properties: {
        functionName: {
          type: "string",
          description: "Function name to check"
        }
      },
      required: ["functionName"]
    },
    handler: (args) => {
      const location = quickRef.backendFunctions[args.functionName];
      const isIntegrated = integrationStatus.integrated.includes(args.functionName);
      const isAvailable = integrationStatus.available.includes(args.functionName);

      if (!location) {
        return {
          exists: false,
          suggestion: `Function '${args.functionName}' not found. Check for typos.`
        };
      }

      // Find which component uses it
      let usedBy = [];
      Object.entries(quickRef.frontendComponents).forEach(([name, info]) => {
        if (info.backendCalls?.includes(args.functionName)) {
          usedBy.push(name);
        }
      });

      return {
        exists: true,
        location,
        integrated: isIntegrated,
        available: isAvailable,
        usedBy: usedBy.length > 0 ? usedBy : null
      };
    }
  },

  getPriorityIntegrations: {
    description: "Get prioritized list of backend functions to integrate next",
    inputSchema: {
      type: "object",
      properties: {
        priority: {
          type: "string",
          description: "Priority level: high, medium, low, all",
          enum: ["high", "medium", "low", "all"]
        }
      }
    },
    handler: (args) => {
      const priority = args.priority || 'all';

      if (priority === 'all') {
        return integrationStatus.prioritizedIntegrations;
      }
      return integrationStatus.prioritizedIntegrations[priority] || [];
    }
  }
};

// MCP Server Protocol
function handleRequest(request) {
  const { method, params } = request;

  if (method === 'tools/list') {
    return {
      tools: Object.entries(tools).map(([name, config]) => ({
        name,
        description: config.description,
        inputSchema: config.inputSchema
      }))
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;
    const tool = tools[name];

    if (!tool) {
      throw new Error(`Tool '${name}' not found`);
    }

    const result = tool.handler(args || {});
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  throw new Error(`Unknown method: ${method}`);
}

// STDIO communication
process.stdin.setEncoding('utf8');
let buffer = '';

process.stdin.on('data', (chunk) => {
  buffer += chunk;

  // Process complete JSON-RPC messages
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  lines.forEach(line => {
    if (!line.trim()) return;

    try {
      const request = JSON.parse(line);
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        result: handleRequest(request)
      };
      console.log(JSON.stringify(response));
    } catch (error) {
      console.error(JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: error.message
        }
      }));
    }
  });
});

process.stdin.on('end', () => {
  process.exit(0);
});

// Initialize message
console.error('Elimu Smart MCP Intelligence Server started');
