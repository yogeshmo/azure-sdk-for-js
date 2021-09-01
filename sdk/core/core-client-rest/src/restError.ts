// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PathUncheckedResponse } from "./getClient";
import { RestError, PipelineResponse, createHttpHeaders } from "@azure/core-rest-pipeline";
import { toCoreRawHeaders } from "./headersHelper";

/**
 * Creates a rest error from a PathUnchecked response
 */
export function createRestError(message: string, response: PathUncheckedResponse): RestError {
  return new RestError(message, {
    statusCode: statusCodeToNumber(response.status),
    request: response.request,
    response: toPipelineResponse(response),
  });
}

function toPipelineResponse(response: PathUncheckedResponse): PipelineResponse {
  const headers = toCoreRawHeaders(response.headers);
  return {
    headers: createHttpHeaders(headers),
    request: response.request,
    status: statusCodeToNumber(response.status) ?? -1,
  };
}

function statusCodeToNumber(statusCode: string): number | undefined {
  const status = Number.parseInt(statusCode);

  return Number.isNaN(status) ? undefined : status;
}