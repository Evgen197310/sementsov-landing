const ts = () => new Date().toISOString();

export function logRequest(route: string, method: string, extra?: Record<string, unknown>) {
  console.log(`[${ts()}] → ${method} ${route}`, extra ? JSON.stringify(extra) : "");
}

export function logResponse(route: string, method: string, status: number, extra?: Record<string, unknown>) {
  console.log(`[${ts()}] ← ${method} ${route} ${status}`, extra ? JSON.stringify(extra) : "");
}

export function logError(route: string, method: string, error: unknown) {
  console.error(`[${ts()}] ✖ ${method} ${route} ERROR:`, error);
}
