declare module '@modelcontextprotocol/sdk' {
  interface MCPToolDefinition {
    name: string;
    description: string;
    parameters: any;
    execute: (params: any) => Promise<any>;
  }

  export class MCPServer {
    constructor(options?: { port?: number; host?: string });
    start(): Promise<void>;
    registerTool(tool: MCPToolDefinition): void;
  }
}