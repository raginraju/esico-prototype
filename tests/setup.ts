// tests/setup.ts
import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { TextDecoder, TextEncoder } from 'node:util';
import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

Object.assign(globalThis, { TextDecoder, TextEncoder });

expect.extend(matchers);