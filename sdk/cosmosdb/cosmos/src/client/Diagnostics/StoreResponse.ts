// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureLogger, createClientLogger } from "@azure/logger";
import { Readable } from "stream";
import { OperationType, ResourceType } from "../../common/constants";
import { ClientSideRequestStatistics } from "./ClientSideRequestStatistics";
import { StoreResults } from "./StoreResult";

/**
 * @hidden
 */
export class StoreResponse extends Readable {
  logger: AzureLogger = createClientLogger("StoreResp");
  clientSideRequestStatistics: ClientSideRequestStatistics;
  status: number;
  responseHeaderNames: [string];
  responseHeaderValues: [string];
  httpEntityStream: ReadableStream;
  content: string;
}

export interface ResponseStatistics {
  [key: string]: any;
}

export function StoreResponseStatistics(
  requestResponseTime: string,
  storeResult: StoreResults,
  requestResourceType: ResourceType,
  requestOperationType: OperationType
): ResponseStatistics {
  const storeResponseStatistics: ResponseStatistics = {};
  storeResponseStatistics["requestResponseTime"] = requestResponseTime;
  storeResponseStatistics["storeResult"] = storeResult;
  storeResponseStatistics["requestResourceType"] = requestResourceType;
  storeResponseStatistics["requestOperationType"] = requestOperationType;
  return storeResponseStatistics;
  // `StoreResponseStatistics: {requestResponseTime="${requestResponseTime}", storeResult=${storeResult}, requestResourceType=${requestResourceType}, requestOperationType=${requestOperationType}}
}

export function AddressResolutionStatistics(
  startTime: Date,
  endTime: Date,
  targetEndpoint: string,
  errorMessage: string,
  // If one replica return error we start address call in parallel,
  // on other replica  valid response, we end the current user request,
  // indicating background addressResolution is still inflight
  inflightRequest: boolean
) {
  return (
    "AddressResolutionStatistics{" +
    'startTime="' +
    startTime.toUTCString() +
    '"' +
    ', endTime="' +
    endTime.toUTCString() +
    '"' +
    ", inflightRequest='" +
    inflightRequest +
    "'" +
    ", targetEndpoint='" +
    targetEndpoint +
    "'" +
    ", errorMessage='" +
    errorMessage +
    "'" +
    "}"
  );
}
