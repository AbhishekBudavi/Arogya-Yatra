declare module '@modelcontextprotocol/sdk' {
  export class MCPServer {
    constructor(options?: { port?: number; host?: string });
    registerTool(tool: {
      name: string;
      description: string;
      parameters: any;
      execute: (params: any) => Promise<any>;
    }): void;
    start(): Promise<void>;
  }
}