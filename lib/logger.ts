const getTimestamp = () => new Date().toISOString();

const formatLog = (level: string, message: string, context?: any) => {
  const timestamp = getTimestamp();
  const functionInfo = context?.functionName
    ? ` [${context.functionName}]`
    : '';
  const contextInfo =
    context && Object.keys(context).length > 0
      ? ` | ${JSON.stringify(context)}`
      : '';
  return `[${timestamp}] ${level}${functionInfo}: ${message}${contextInfo}`;
};

export const log = {
  info: (message: string, context?: any) => {
    console.log(formatLog('INFO', message, context));
  },

  error: (message: string, context?: any) => {
    console.error(formatLog('ERROR', message, context));
  },
};

export default log;
