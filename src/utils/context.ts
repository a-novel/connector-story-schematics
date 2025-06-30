export interface InternalContextData {
  baseURL: string;
}

export interface InternalContext {
  agoraConnectorStorySchematics: InternalContextData;
}

/** Get the global object for the current JavaScript runtime */
export const Context = globalThis as unknown as InternalContext;

export const getContextValue = <T extends keyof InternalContextData>(
  key: T,
  optional?: boolean
): InternalContextData[T] => {
  if (!Context.agoraConnectorStorySchematics?.[key] && !optional) {
    throw new Error(
      `story schematics api context value for key "${key}" is not set. Call init() before using this function.`
    );
  }
  return Context.agoraConnectorStorySchematics[key];
};
