/* eslint-disable @typescript-eslint/no-explicit-any */
/* -------------------------------------------------------
   Serverless entry for API Gateway v2 + Lambda (Node 18)
   ----------------------------------------------------- */
import serverless from 'serverless-http';
import { expressApp } from './App';
import database from './db';

// Enable more verbose console output
const DEBUG = true;

// Safer console logging function that won't crash on circular references
function safeLog(message: string, data?: any): void {
  if (!DEBUG) return;
  
  console.log(`[LAMBDA] ${message}`);
  if (data !== undefined) {
    try {
      // Handle circular references by limiting JSON stringify
      if (typeof data === 'object' && data !== null) {
        const seen = new WeakSet();
        const safeStringify = (obj: any): string => {
          return JSON.stringify(obj, (_, value) => {
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) {
                return '[Circular]';
              }
              seen.add(value);
            }
            return value;
          }, 2);
        };
        console.log(safeStringify(data));
      }
    } catch (err) {
      console.log('Error logging data:', err);
    }
  }
}

// ---------- Cold‑start bootstrap ---------- //
let isDbReady = false;
async function initDbOnce() {
    try {
        if (isDbReady) {
            safeLog('Database already initialized');
            return;
        }
        
        safeLog('Initializing database connection...');
        await database.connect();
        isDbReady = true;
        safeLog('✓ DB connected & models initialized');
    } catch (error) {
        safeLog('Database initialization error:', error);
        // Re-throw to prevent handler from proceeding with uninitialized DB
        throw error;
    }
}

// ---------- Build (and cache) the Express wrapper ---------- //
const cachedHandlerPromise = (async () => {
    safeLog('Building serverless handler...');
    await initDbOnce();
    // serverless() returns an AWS‑aware handler; we only build it once
    const handler = serverless(expressApp);
    safeLog('Serverless handler built successfully');
    return handler;
})();

/* ------------- Lambda handler ------------- */
export const handler = async (
    event: any,
    context: any,
) => {
    safeLog('Lambda handler invoked');
    safeLog('Event type:', typeof event);
    
    // Log key event properties without potentially crashing on circular refs
    if (event.path) safeLog(`Path: ${event.path}`);
    if (event.httpMethod) safeLog(`Method: ${event.httpMethod}`);
    
    try {
        const handler = await cachedHandlerPromise;
        safeLog('Invoking express app...');
        const result = await handler(event, context);
        safeLog('Handler execution completed');
        return result;
    } catch (error) {
        safeLog('Error in lambda handler:', error);
        // Format error as proper API Gateway response
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Internal Server Error',
                errorId: context.awsRequestId
            })
        };
    }
};
