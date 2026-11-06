/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string | undefined>> {
  readonly VITE_PUBLIC_WEBSITE_URL: string;
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
