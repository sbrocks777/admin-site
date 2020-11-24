import { LogMessage } from './log.model';

export const normalizeLogMessage = (msg: LogMessage): LogMessage => ({
  ...msg,
  type: msg.type ? msg.type : 'LOG',
  timestamp: msg.timestamp ? msg.timestamp : new Date().toLocaleString(),
});
