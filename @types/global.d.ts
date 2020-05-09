/// <reference types="node" />

// Extend the NodeJS namespace with variables in next.config.js
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VERSION: string;
    readonly DESCRIPTION: string;
    readonly REPO: string;
    readonly FATHOM_SUBDOMAIN: string;
    readonly FATHOM_SITEID: string;
  }
}
