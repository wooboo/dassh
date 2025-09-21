'use client';

import { useState } from 'react';
import { Button } from '@dassh/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@dassh/ui/components/card';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { orpcClient } from '@/lib/orpc-client';

// Simple Badge component since it might not exist
const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-input bg-background text-foreground',
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface HelloResponse {
  message: string;
  timestamp: string;
  environment: string;
}

interface DbTestResponse {
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: string;
  dbInfo: {
    connected: boolean;
    url: string;
  };
}

interface SystemHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      latency?: number;
    };
    auth: {
      status: 'configured' | 'not_configured';
      provider: string;
    };
  };
  timestamp: string;
  uptime: number;
}

export default function HealthTestPage() {
  const [helloResponse, setHelloResponse] = useState<HelloResponse | null>(null);
  const [dbResponse, setDbResponse] = useState<DbTestResponse | null>(null);
  const [systemResponse, setSystemResponse] = useState<SystemHealthResponse | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callHelloEndpoint = async (name: string = 'Dashboard') => {
    setLoading('hello');
    setError(null);
    
    try {
      const response = await orpcClient.health.hello({ name });
      setHelloResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(null);
    }
  };

  const callDbTestEndpoint = async () => {
    setLoading('db');
    setError(null);
    
    try {
      const response = await orpcClient.health.dbTest({});
      setDbResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(null);
    }
  };

  const callSystemHealthEndpoint = async () => {
    setLoading('system');
    setError(null);
    
    try {
      const response = await orpcClient.health.systemHealth({});
      setSystemResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(null);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
      case 'configured':
        return <Badge variant="default" className="bg-green-500">Configured</Badge>;
      case 'degraded':
        return <Badge variant="secondary">Degraded</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
      case 'not_configured':
        return <Badge variant="outline">Not Configured</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">oRPC Health Test</h1>
        <p className="text-muted-foreground">
          Test the oRPC health endpoints to verify database connection and system status.
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Hello Endpoint */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Hello Test
              {helloResponse && <CheckCircle className="h-5 w-5 text-green-500" />}
            </CardTitle>
            <CardDescription>
              Test basic oRPC connectivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => callHelloEndpoint('Dashboard')}
              disabled={loading === 'hello'}
              className="w-full mb-4"
            >
              {loading === 'hello' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Test Hello
            </Button>
            
            {helloResponse && (
              <div className="space-y-2 text-sm">
                <p><strong>Message:</strong> {helloResponse.message}</p>
                <p><strong>Environment:</strong> {helloResponse.environment}</p>
                <p><strong>Timestamp:</strong> {new Date(helloResponse.timestamp).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Test Endpoint */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Database Test
              {dbResponse && getStatusIcon(dbResponse.status)}
            </CardTitle>
            <CardDescription>
              Test database connectivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => callDbTestEndpoint()}
              disabled={loading === 'db'}
              className="w-full mb-4"
            >
              {loading === 'db' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Test Database
            </Button>
            
            {dbResponse && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <strong>Status:</strong>
                  {getStatusBadge(dbResponse.status)}
                </div>
                <p><strong>Message:</strong> {dbResponse.message}</p>
                {dbResponse.dbInfo && (
                  <>
                    <p><strong>Connected:</strong> {dbResponse.dbInfo.connected ? 'Yes' : 'No'}</p>
                    <p><strong>Database:</strong> {dbResponse.dbInfo.url}</p>
                  </>
                )}
                <p><strong>Timestamp:</strong> {new Date(dbResponse.timestamp).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health Endpoint */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              System Health
              {systemResponse && getStatusIcon(systemResponse.status)}
            </CardTitle>
            <CardDescription>
              Complete system health check
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => callSystemHealthEndpoint()}
              disabled={loading === 'system'}
              className="w-full mb-4"
            >
              {loading === 'system' && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Check System
            </Button>
            
            {systemResponse && (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <strong>Overall Status:</strong>
                  {getStatusBadge(systemResponse.status)}
                </div>
                
                {systemResponse.services && (
                  <div className="space-y-2">
                    <strong>Services:</strong>
                    <div className="ml-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Database:</span>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(systemResponse.services.database.status)}
                          {systemResponse.services.database.latency && (
                            <span className="text-xs text-muted-foreground">
                              {systemResponse.services.database.latency}ms
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Auth ({systemResponse.services.auth.provider}):</span>
                        {getStatusBadge(systemResponse.services.auth.status)}
                      </div>
                    </div>
                  </div>
                )}
                
                <p><strong>Timestamp:</strong> {new Date(systemResponse.timestamp).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test All Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={() => {
              callHelloEndpoint('Dashboard');
              setTimeout(() => callDbTestEndpoint(), 100);
              setTimeout(() => callSystemHealthEndpoint(), 200);
            }}
            disabled={!!loading}
            size="lg"
            className="w-full"
          >
            {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            Test All Endpoints
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}