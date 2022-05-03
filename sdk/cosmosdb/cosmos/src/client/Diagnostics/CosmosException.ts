// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @hidden
 */
export interface CosmosException<T> {
  headers: [key: string];
  result?: T;
  code?: number;
  substatus?: number;
  diagnostics?: string;
}
