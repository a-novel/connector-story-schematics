import { Context } from "./context";

export interface InitProps {
  /**
   * The URL to the API server.
   */
  baseURL: string;
}

export const init = (props: InitProps) => {
  Context.agoraConnectorStorySchematics = {
    baseURL: props.baseURL,
  };
};
