import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { verifyToken } from "../auth/middleware";

export interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface WidgetUpdate {
  widgetId: string;
  data: any;
  source?: string;
}

export interface DashboardEvent {
  type: "widget-update" | "layout-change" | "widget-added" | "widget-removed";
  payload: any;
  userId: string;
}

// WebSocket connection manager
export class WebSocketManager {
  private connections = new Map<string, Set<AuthenticatedWebSocket>>();
  private pingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startHeartbeat();
  }

  // Authenticate WebSocket connection
  async authenticate(ws: AuthenticatedWebSocket, request: IncomingMessage): Promise<boolean> {
    try {
      const url = new URL(request.url || "", `http://${request.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close(1008, "No authentication token provided");
        return false;
      }

      const payload = await verifyToken(token);
      if (!payload || !payload.sub) {
        ws.close(1008, "Invalid authentication token");
        return false;
      }

      ws.userId = payload.sub;
      ws.isAlive = true;

      // Add to user connections
      if (!this.connections.has(payload.sub)) {
        this.connections.set(payload.sub, new Set());
      }
      this.connections.get(payload.sub)!.add(ws);

      console.log(`WebSocket authenticated for user: ${payload.sub}`);
      return true;
    } catch (error) {
      console.error("WebSocket authentication failed:", error);
      ws.close(1008, "Authentication failed");
      return false;
    }
  }

  // Remove connection
  removeConnection(ws: AuthenticatedWebSocket) {
    if (ws.userId) {
      const userConnections = this.connections.get(ws.userId);
      if (userConnections) {
        userConnections.delete(ws);
        if (userConnections.size === 0) {
          this.connections.delete(ws.userId);
        }
      }
      console.log(`WebSocket disconnected for user: ${ws.userId}`);
    }
  }

  // Send message to specific user
  sendToUser(userId: string, message: WebSocketMessage) {
    const userConnections = this.connections.get(userId);
    if (userConnections) {
      const messageStr = JSON.stringify(message);
      userConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(messageStr);
        }
      });
    }
  }

  // Broadcast widget update to user
  broadcastWidgetUpdate(userId: string, update: WidgetUpdate) {
    const message: WebSocketMessage = {
      type: "widget-update",
      payload: update,
      timestamp: Date.now(),
    };
    this.sendToUser(userId, message);
  }

  // Broadcast dashboard event to user
  broadcastDashboardEvent(event: DashboardEvent) {
    const message: WebSocketMessage = {
      type: event.type,
      payload: event.payload,
      timestamp: Date.now(),
    };
    this.sendToUser(event.userId, message);
  }

  // Get active connections count for user
  getUserConnectionCount(userId: string): number {
    return this.connections.get(userId)?.size || 0;
  }

  // Get total active connections
  getTotalConnections(): number {
    let total = 0;
    this.connections.forEach((userConnections) => {
      total += userConnections.size;
    });
    return total;
  }

  // Heartbeat/ping mechanism
  private startHeartbeat() {
    this.pingInterval = setInterval(() => {
      this.connections.forEach((userConnections) => {
        userConnections.forEach((ws) => {
          if (!ws.isAlive) {
            this.removeConnection(ws);
            ws.terminate();
            return;
          }

          ws.isAlive = false;
          if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
          }
        });
      });
    }, 30000); // 30 second heartbeat
  }

  // Handle pong response
  handlePong(ws: AuthenticatedWebSocket) {
    ws.isAlive = true;
  }

  // Cleanup
  destroy() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.connections.forEach((userConnections) => {
      userConnections.forEach((ws) => {
        ws.close(1001, "Server shutting down");
      });
    });
    
    this.connections.clear();
  }
}

// Singleton instance
export const wsManager = new WebSocketManager();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down WebSocket manager...");
  wsManager.destroy();
});