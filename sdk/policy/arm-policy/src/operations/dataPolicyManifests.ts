/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import "@azure/core-paging";
import { PagedAsyncIterableIterator } from "@azure/core-paging";
import { DataPolicyManifests } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { PolicyClientContext } from "../policyClientContext";
import {
  DataPolicyManifest,
  DataPolicyManifestsListNextOptionalParams,
  DataPolicyManifestsListOptionalParams,
  DataPolicyManifestsListNextNextOptionalParams,
  DataPolicyManifestsGetByPolicyModeOptionalParams,
  DataPolicyManifestsGetByPolicyModeResponse,
  DataPolicyManifestsListResponse,
  DataPolicyManifestsListNextResponse,
  DataPolicyManifestsListNextNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class representing a DataPolicyManifests. */
export class DataPolicyManifestsImpl implements DataPolicyManifests {
  private readonly client: PolicyClientContext;

  /**
   * Initialize a new instance of the class DataPolicyManifests class.
   * @param client Reference to the service client
   */
  constructor(client: PolicyClientContext) {
    this.client = client;
  }

  /**
   * This operation retrieves a list of all the data policy manifests that match the optional given
   * $filter. Valid values for $filter are: "$filter=namespace eq '{0}'". If $filter is not provided, the
   * unfiltered list includes all data policy manifests for data resource types. If $filter=namespace is
   * provided, the returned list only includes all data policy manifests that have a namespace matching
   * the provided value.
   * @param options The options parameters.
   */
  public list(
    options?: DataPolicyManifestsListOptionalParams
  ): PagedAsyncIterableIterator<DataPolicyManifest> {
    const iter = this.listPagingAll(options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: () => {
        return this.listPagingPage(options);
      }
    };
  }

  private async *listPagingPage(
    options?: DataPolicyManifestsListOptionalParams
  ): AsyncIterableIterator<DataPolicyManifest[]> {
    let result = await this._list(options);
    yield result.value || [];
    let continuationToken = result.nextLink;
    while (continuationToken) {
      result = await this._listNext(continuationToken, options);
      continuationToken = result.nextLink;
      yield result.value || [];
    }
  }

  private async *listPagingAll(
    options?: DataPolicyManifestsListOptionalParams
  ): AsyncIterableIterator<DataPolicyManifest> {
    for await (const page of this.listPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * ListNext
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  public listNext(
    nextLink: string,
    options?: DataPolicyManifestsListNextOptionalParams
  ): PagedAsyncIterableIterator<DataPolicyManifest> {
    const iter = this.listNextPagingAll(nextLink, options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: () => {
        return this.listNextPagingPage(nextLink, options);
      }
    };
  }

  private async *listNextPagingPage(
    nextLink: string,
    options?: DataPolicyManifestsListNextOptionalParams
  ): AsyncIterableIterator<DataPolicyManifest[]> {
    let result = await this._listNext(nextLink, options);
    yield result.value || [];
    let continuationToken = result.nextLink;
    while (continuationToken) {
      result = await this._listNextNext(continuationToken, options);
      continuationToken = result.nextLink;
      yield result.value || [];
    }
  }

  private async *listNextPagingAll(
    nextLink: string,
    options?: DataPolicyManifestsListNextOptionalParams
  ): AsyncIterableIterator<DataPolicyManifest> {
    for await (const page of this.listNextPagingPage(nextLink, options)) {
      yield* page;
    }
  }

  /**
   * This operation retrieves the data policy manifest with the given policy mode.
   * @param policyMode The policy mode of the data policy manifest to get.
   * @param options The options parameters.
   */
  getByPolicyMode(
    policyMode: string,
    options?: DataPolicyManifestsGetByPolicyModeOptionalParams
  ): Promise<DataPolicyManifestsGetByPolicyModeResponse> {
    return this.client.sendOperationRequest(
      { policyMode, options },
      getByPolicyModeOperationSpec
    );
  }

  /**
   * This operation retrieves a list of all the data policy manifests that match the optional given
   * $filter. Valid values for $filter are: "$filter=namespace eq '{0}'". If $filter is not provided, the
   * unfiltered list includes all data policy manifests for data resource types. If $filter=namespace is
   * provided, the returned list only includes all data policy manifests that have a namespace matching
   * the provided value.
   * @param options The options parameters.
   */
  private _list(
    options?: DataPolicyManifestsListOptionalParams
  ): Promise<DataPolicyManifestsListResponse> {
    return this.client.sendOperationRequest({ options }, listOperationSpec);
  }

  /**
   * ListNext
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    nextLink: string,
    options?: DataPolicyManifestsListNextOptionalParams
  ): Promise<DataPolicyManifestsListNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listNextOperationSpec
    );
  }

  /**
   * ListNextNext
   * @param nextLink The nextLink from the previous successful call to the ListNext method.
   * @param options The options parameters.
   */
  private _listNextNext(
    nextLink: string,
    options?: DataPolicyManifestsListNextNextOptionalParams
  ): Promise<DataPolicyManifestsListNextNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listNextNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getByPolicyModeOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.Authorization/dataPolicyManifests/{policyMode}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.DataPolicyManifest
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.policyMode],
  headerParameters: [Parameters.accept],
  serializer
};
const listOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.Authorization/dataPolicyManifests",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.DataPolicyManifestListResult
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  queryParameters: [Parameters.apiVersion, Parameters.filter],
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.DataPolicyManifestListResult
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  queryParameters: [Parameters.apiVersion, Parameters.filter],
  urlParameters: [Parameters.$host, Parameters.nextLink],
  headerParameters: [Parameters.accept],
  serializer
};
const listNextNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.DataPolicyManifestListResult
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  queryParameters: [Parameters.apiVersion, Parameters.filter],
  urlParameters: [Parameters.$host, Parameters.nextLink],
  headerParameters: [Parameters.accept],
  serializer
};