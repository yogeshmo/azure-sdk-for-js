// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getHexaDigit } from "../../common/helper";
import { RequestContext } from "../../request";
import { ResponseStatistics, StoreResponseStatistics } from "./StoreResponse";
import { StoreResults } from "./StoreResult";

/**
 * @hidden
 */
export interface RequestStatisticsProperties {
  MaxSupplementalRequestStr: number = 10;
  requestStartTime: Date;
  requestEndTime: Date;
  responseStatisticsList: ResponseStatistics;
  supplementalResponseStatisticsList: ResponseStatistics;
  addressResolutionStatistics: ResponseStatistics;
  contactedReplicas: [string];
  failedReplicas: [string];
  regionsContacted: [string];
  responseTime: Date;
}

  export async function recordResponse(request: RequestContext,
     storeResult: StoreResults,
     RequestStatisticsProperties) {
    const responseTime = new Date().toLocaleString();

    const storeResponseStatistics = StoreResponseStatistics(
      responseTime,
      storeResult,
      request.resourceType,
      request.operationType
    );

    const locationEndPoint = new URL(request.endpoint);

    if (this.responseTime > this.requestEndTime) {
      this.requestEndTime = this.responseTime;
    }

    if (!locationEndPoint) {
      this.regionsContacted.push(locationEndPoint.toString());
    }

    if (
      storeResponseStatistics["requestOperationType"] == "" ||
      storeResponseStatistics["requestOperationType"] == ""
    ) {
      this.supplementalResponseStatisticsList.push(storeResponseStatistics);
    } else {
      this.responseStatisticsList.push(storeResponseStatistics);
    }
  }

  export async function recordAddressResolutionStart(targetEndpoint: string) {
    const identifier = getHexaDigit();

    const addressResolutionStatistics: ResponseStatistics = {};
    addressResolutionStatistics["startTime"] = Date.now().toLocaleString();
    //  Very far in the future
    addressResolutionStatistics["endTime"] = null;
    addressResolutionStatistics["targetEndpoint"] =
      targetEndpoint == null ? "<NULL>" : targetEndpoint.toString();

    this.addressResolutionStatistics.push(identifier, addressResolutionStatistics);

    return identifier;
  }

  export async function recordAddressResolutionEnd(identifier: string, errorMessage: string) {
    if (identifier == undefined) {
      return;
    }

    if (this.addressResolutionStatistics["identifier"] != undefined) {
      throw new Error(
        "Identifier " + identifier + " does not exist. Please call start before calling end"
      );
    }

    if (this.responseTime > this.requestEndTime) {
      this.requestEndTime = this.responseTime;
    }

    const resolutionStatistics = this.addressResolutionStatistics.get(identifier);
    resolutionStatistics["endTime"].endTime = this.responseTime.toLocaleString();
    resolutionStatistics["errorMessage"].errorMessage = errorMessage;
    resolutionStatistics["inflightRequest"].inflightRequest = false;
  }

  export async function requestStatisticsToString() {
        //  need to lock in case of concurrent operations. this should be extremely rare since toString()
        //  should only be called at the end of request.
 
            //  first trace request start time, as well as total non-head/headfeed requests made.'
            const requestStatistics: ResponseStatistics = {};
            const requestStatistics: ResponseStatistics = {};
  requestStatistics["RequestStartTime"] = "\"" + this.requestStartTime.toLocaleString() + "\",";
  requestStatistics["RequestEndTime"] = "\"" + this.requestEndTime.toLocaleString() + "\",";
  requestStatistics["Duration"] = `${this.requestStartTime.getTime() - this.requestEndTime.getTime()} ms, ${+"Number of regions attempted: "}`
  requestStatistics["Duration"] = `${+this.regionsContacted.length} /n${this.responseStatisticsList.toString()} /n` ;

            //  take all responses here - this should be limited in number and each one contains relevant information.
            const storeResponseStatistics: ResponseStatistics = {};
            storeResponseStatistics.push(requestStatistics);

            //  take all responses here - this should be limited in number and each one is important.

            const storeResponseStatistics: ResponseStatistics = {};
            storeResponseStatistics.push(requestStatistics);
            for (AddressResolutionStatistics value : this.addressResolutionStatistics.values()) {
                stringBuilder.append(value.toString()).append(System.lineSeparator());
            }

            //  only take last 10 responses from this list - this has potential of having large number of entries.
            //  since this is for establishing consistency, we can make do with the last responses to paint a meaningful picture.
            int supplementalResponseStatisticsListCount = this.supplementalResponseStatisticsList.size();
            int initialIndex = Math.max(supplementalResponseStatisticsListCount - MAX_SUPPLEMENTAL_REQUESTS_FOR_TO_STRING, 0);
            if (initialIndex != 0) {
                stringBuilder.append("  -- Displaying only the last ")
                        .append(MAX_SUPPLEMENTAL_REQUESTS_FOR_TO_STRING)
                        .append(" head/headfeed requests. Total head/headfeed requests: ")
                        .append(supplementalResponseStatisticsListCount);
            }
            for (int i = initialIndex; i < supplementalResponseStatisticsListCount; i++) {
                stringBuilder.append(this.supplementalResponseStatisticsList.get(i).toString()).append(System.lineSeparator());
            }
            return "{}"
          }
  export async function getRequestLatencyInMs() {
    return this.requestStartTime.getTime() - this.requestEndTime.getTime();
  }

  export async function isCPUOverloaded(): Promise<boolean> {
    //  NOTE: CPUMonitor and CPULoadHistory is not implemented in async SDK yet.
    return false;
  }
