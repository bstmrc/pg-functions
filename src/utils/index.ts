import { ILogger } from "../interfaces/ILogger";
import { ConsoleLogger } from "./logger";

let globalLogger: ILogger = new ConsoleLogger()

export const setLogger = (customLogger: ILogger) => {
  globalLogger = customLogger;
};

export const getLogger = (): ILogger => {
  return globalLogger;
};