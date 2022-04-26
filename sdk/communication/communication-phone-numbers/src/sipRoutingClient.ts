// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/// <reference lib="esnext.asynciterable" />

import {
  parseClientArguments,
  isKeyCredential,
  createCommunicationAuthPolicy
} from "@azure/communication-common";
import { KeyCredential, TokenCredential } from "@azure/core-auth";
import {
  PipelineOptions,
  OperationOptions,
  InternalPipelineOptions,
  createPipelineFromOptions,
  operationOptionsToRequestOptionsBase
} from "@azure/core-http";
import { SpanStatusCode } from "@azure/core-tracing";
import { SDK_VERSION } from "./utils/constants";
import { createSpan } from "./utils/tracing";
import { logger } from "./utils/logger";
import { extractOperationOptions } from "./utils/extractOperationOptions";
import { SipRoutingClient as SipRoutingGeneratedClient } from "./generated/src/siprouting/sipRoutingClient";
import {
  SipTrunkRoute,
  SipTrunk,
} from "./models";
import { SipConfigurationPatch } from "./generated/src/siprouting/models";
import { mapTrunks, mapTrunksToRestModel } from "./mappers";


export * from "./models";

/**
 * Checks whether the type of a value is SipClientOptions or not.
 *
 * @param options - The value being checked.
 */
const isSipClientOptions = (options: any): options is PipelineOptions =>
  !!options && !isKeyCredential(options);

export class SipRoutingClient {
  private readonly api: SipRoutingGeneratedClient;

  /**
   * Initializes a new instance of the SipClient class.
   * @param connectionString - Connection string to connect to an Azure Communication Service resource.
   *                         Example: "endpoint=https://contoso.eastus.communications.azure.net/;accesskey=secret";
   * @param options - Optional. Options to configure the HTTP pipeline.
   */
  constructor(connectionString: string, options?: PipelineOptions);

  /**
   * Initializes a new instance of the SipClient class using an Azure KeyCredential.
   * @param endpoint - The endpoint of the service (ex: https://contoso.eastus.communications.azure.net).
   * @param credential - An object that is used to authenticate requests to the service. Use the Azure KeyCredential or `@azure/identity` to create a credential.
   * @param options - Optional. Options to configure the HTTP pipeline.
   */
  constructor(endpoint: string, credential: KeyCredential, options?: PipelineOptions);

  /**
   * Initializes a new instance of the SipClient class using a TokenCredential.
   * @param endpoint - The endpoint of the service (ex: https://contoso.eastus.communications.azure.net).
   * @param credential - TokenCredential that is used to authenticate requests to the service.
   * @param options - Optional. Options to configure the HTTP pipeline.
   */
  constructor(endpoint: string, credential: TokenCredential, options?: PipelineOptions);

  constructor(
    connectionStringOrUrl: string,
    credentialOrOptions?: KeyCredential | TokenCredential | PipelineOptions,
    maybeOptions: PipelineOptions = {}
  ) {
    const { url, credential } = parseClientArguments(connectionStringOrUrl, credentialOrOptions);
    const options = isSipClientOptions(credentialOrOptions) ? credentialOrOptions : maybeOptions;
    const libInfo = `azsdk-js-communication-sip/${SDK_VERSION}`;

    if (!options.userAgentOptions) {
      options.userAgentOptions = {};
    }

    if (options.userAgentOptions.userAgentPrefix) {
      options.userAgentOptions.userAgentPrefix = `${options.userAgentOptions.userAgentPrefix} ${libInfo}`;
    } else {
      options.userAgentOptions.userAgentPrefix = libInfo;
    }

    const internalPipelineOptions: InternalPipelineOptions = {
      ...options,
      ...{
        loggingOptions: {
          logger: logger.info
        }
      }
    };

    const authPolicy = createCommunicationAuthPolicy(credential);
    const pipeline = createPipelineFromOptions(internalPipelineOptions, authPolicy);
    this.api = new SipRoutingGeneratedClient(url, pipeline);
  }

  /**
   * Gets the the SIP trunks.
   * @param options The options parameters.
   */
  public async getTrunks(
    options: OperationOptions = {}
  ): Promise<SipTrunk[]> {
    const { operationOptions } = extractOperationOptions(options);
    const { span, updatedOptions } = createSpan("SipRoutingClient-GetTrunks", operationOptions);

    try {
      const reqOptions = operationOptionsToRequestOptionsBase(updatedOptions);
      return this.api.getSipConfiguration(reqOptions)
        .then(config => mapTrunks(config.trunks));
    } catch (e: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Gets the the SIP trunk routes.
   * @param options The options parameters.
   */
  public async getRoutes(
    options: OperationOptions = {}
  ): Promise<SipTrunkRoute[]> {
    const { operationOptions } = extractOperationOptions(options);
    const { span, updatedOptions } = createSpan("SipRoutingClient-GetRoutes", operationOptions);

    try {
      const reqOptions = operationOptionsToRequestOptionsBase(updatedOptions);
      return this.api.getSipConfiguration(reqOptions)
        .then(config => config.routes || []);
    } catch (e: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Sets the the SIP trunks.
   * @param trunks The SIP trunks to be set.
   * @param options The options parameters.
   */
  public async setTrunks(
    trunks: SipTrunk[],
    options: OperationOptions = {}
  ): Promise<SipTrunk[]> {
    const { operationOptions } = extractOperationOptions(options);
    const { span, updatedOptions } = createSpan("SipRoutingClient-SetTrunks", operationOptions);

    try {
      const reqOptions = operationOptionsToRequestOptionsBase(updatedOptions);
      const patch: SipConfigurationPatch = { trunks: mapTrunksToRestModel(trunks) };
      const setFqdns = trunks.map(trunk => trunk.fqdn);
      const storedFqdns = await this.api.getSipConfiguration(reqOptions)
        .then(config => mapTrunks(config.trunks))
        .then(value => value.map(trunk => trunk.fqdn));
      storedFqdns.forEach(storedFqdn => {
        if (!setFqdns.find(value => value === storedFqdn)) {
          patch.trunks![storedFqdn] = null;
        }
      });

      const payload = {
        ...reqOptions,
        body: patch
      };
      return this.api.patchSipConfiguration(payload)
        .then(config => mapTrunks(config.trunks));
    } catch (e: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Sets the the SIP trunk.
   * @param trunk The SIP trunk to be set.
   * @param options The options parameters.
   */
  public async setTrunk(
    trunk: SipTrunk,
    options: OperationOptions = {}
  ): Promise<SipTrunk> {
    const { operationOptions } = extractOperationOptions(options);
    const { span, updatedOptions } = createSpan("SipRoutingClient-SetTrunk", operationOptions);

    try {
      const patch: SipConfigurationPatch = {
        trunks: mapTrunksToRestModel([trunk])
      };
      const reqOptions = operationOptionsToRequestOptionsBase(updatedOptions);    
      const payload = {
        ...reqOptions,
        body: patch
      };
      return this.api.patchSipConfiguration(payload)
        .then(config => {
          return mapTrunks(config.trunks)
            .find((value: SipTrunk) => value.fqdn === trunk.fqdn) || trunk
        });
    } catch (e: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Sets the the SIP trunk routes.
   * @param routes The SIP trunk routes to be set.
   * @param options The options parameters.
   */
  public async setRoutes(
    routes: SipTrunkRoute[],
    options: OperationOptions = {}
  ): Promise<SipTrunkRoute[]> {
    const { operationOptions } = extractOperationOptions(options);
    const { span, updatedOptions } = createSpan("SipRoutingClient-SetRoutes", operationOptions);

    try {
      const patch: SipConfigurationPatch = {
        routes: routes
      };
      const reqOptions = operationOptionsToRequestOptionsBase(updatedOptions);    
      const payload = {
        ...reqOptions,
        body: patch
      };
      return this.api.patchSipConfiguration(payload)
        .then(config => config.routes || []);
    } catch (e: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }

  /**
   * Deletes the the SIP trunk.
   * @param fqdn The trunk's FQDN.
   * @param options The options parameters.
   */
  public async deleteTrunk(
    fqdn: string,
    options: OperationOptions = {}
  ): Promise<void> {
    const { operationOptions } = extractOperationOptions(options);
    const { span, updatedOptions } = createSpan("SipRoutingClient-DeleteTrunk", operationOptions);

    try {
      const patch: SipConfigurationPatch = {
        trunks: {}
      };
      patch.trunks && (patch.trunks[fqdn] = null);
      const reqOptions = operationOptionsToRequestOptionsBase(updatedOptions);    
      const payload = {
        ...reqOptions,
        body: patch
      };
      return this.api.patchSipConfiguration(payload).then();
    } catch (e: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: e.message
      });
      throw e;
    } finally {
      span.end();
    }
  }
}
