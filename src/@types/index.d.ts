
declare interface Window {
  webui?: {
    /** Is `true` if the app is in debug mode. */
    inDebugMode?: boolean;
    /** Is `true` if the app is in development mode. */
    inDevelMode?: boolean;
  }
  [property: string]: unknown;
}
