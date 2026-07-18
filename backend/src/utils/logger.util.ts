type LogMeta = Record<string, unknown>;

const formatMessage = (level: string, message: string, meta?: LogMeta): string => {
  const timestamp = new Date().toISOString();
  const metaString = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';

  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
};

export const logger = {
  info(message: string, meta?: LogMeta): void {
    console.log(formatMessage('info', message, meta));
  },

  warn(message: string, meta?: LogMeta): void {
    console.warn(formatMessage('warn', message, meta));
  },

  error(message: string, meta?: LogMeta): void {
    console.error(formatMessage('error', message, meta));
  },

  debug(message: string, meta?: LogMeta): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};
