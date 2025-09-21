import { z } from 'zod';
import { publicProcedure } from '../orpc';
import { checkDatabaseHealth } from '../../database';

/**
 * Health and testing procedures
 */
export const healthProcedures = {
  /**
   * Simple hello endpoint to test oRPC setup
   */
  hello: publicProcedure
    .input(z.object({
      name: z.string().optional().default('World'),
    }))
    .output(z.object({
      message: z.string(),
      timestamp: z.string(),
      environment: z.string(),
    }))
    .handler(async ({ input }) => {
      return {
        message: `Hello, ${input.name}!`,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
      };
    }),

  /**
   * Database connection test endpoint
   */
  dbTest: publicProcedure
    .input(z.object({}))
    .output(z.object({
      status: z.enum(['healthy', 'unhealthy']),
      message: z.string(),
      timestamp: z.string(),
      dbInfo: z.object({
        connected: z.boolean(),
        url: z.string(),
      }),
    }))
    .handler(async ({ context }) => {
      const isHealthy = await checkDatabaseHealth();
      
      // Test a simple query to the database
      let queryResult = null;
      try {
        queryResult = await context.db.execute('SELECT NOW() as current_time, version() as db_version');
      } catch (error) {
        console.error('Database query failed:', error);
      }

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy 
          ? 'Database connection is healthy' 
          : 'Database connection failed',
        timestamp: new Date().toISOString(),
        dbInfo: {
          connected: isHealthy,
          url: process.env.DATABASE_URL?.replace(/\/\/.*:.*@/, '//***:***@') || 'not configured',
        },
      };
    }),

  /**
   * Complete system health check
   */
  systemHealth: publicProcedure
    .input(z.object({}))
    .output(z.object({
      status: z.enum(['healthy', 'degraded', 'unhealthy']),
      services: z.object({
        database: z.object({
          status: z.enum(['healthy', 'unhealthy']),
          latency: z.number().optional(),
        }),
        auth: z.object({
          status: z.enum(['configured', 'not_configured']),
          provider: z.string(),
        }),
      }),
      timestamp: z.string(),
      uptime: z.number(),
    }))
    .handler(async ({ context }) => {
      const startTime = Date.now();
      
      // Test database
      const dbHealthy = await checkDatabaseHealth();
      const dbLatency = Date.now() - startTime;
      
      // Check auth configuration
      const authConfigured = !!(process.env.KINDE_CLIENT_ID && process.env.KINDE_CLIENT_SECRET);
      
      const services = {
        database: {
          status: dbHealthy ? 'healthy' as const : 'unhealthy' as const,
          latency: dbLatency,
        },
        auth: {
          status: authConfigured ? 'configured' as const : 'not_configured' as const,
          provider: 'kinde',
        },
      };
      
      // Determine overall status
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      if (!dbHealthy) {
        status = 'unhealthy';
      } else if (!authConfigured) {
        status = 'degraded';
      }
      
      return {
        status,
        services,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }),
};