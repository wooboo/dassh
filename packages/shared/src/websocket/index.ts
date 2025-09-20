// WebSocket types and utilities
export { WebSocketManager, wsManager } from "./manager";
export type { 
  AuthenticatedWebSocket, 
  WebSocketMessage, 
  WidgetUpdate, 
  DashboardEvent 
} from "./manager";

// WebSocket server setup utility for Next.js
export const setupWebSocketServer = () => {
  // This will be implemented when Next.js app is set up
  // Returns WebSocket server instance for integration
  console.log("WebSocket server setup utility ready");
};