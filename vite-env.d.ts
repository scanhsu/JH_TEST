/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** X (Twitter) API v2 Bearer Token；未設定時 X 來源使用示範資料 */
  readonly VITE_X_BEARER_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
