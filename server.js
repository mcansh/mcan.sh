import { createRequestHandler } from '@remix-run/vercel';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as build from '@remix-run/dev/server-build';

export default createRequestHandler({ build, mode: process.env.NODE_ENV });
