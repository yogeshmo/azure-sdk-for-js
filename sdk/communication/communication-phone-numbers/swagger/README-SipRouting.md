# Azure Communication Services SMS Protocol Layer

> see https://aka.ms/autorest

## Configuration

```yaml
package-name: azure-communication-sip
description: Azure Communication SIP Configuration Service
generate-metadata: false
openapi-type: data-plane
namespace: azure.communication.sip
license-header: MICROSOFT_MIT_NO_VERSION
output-folder: ../src/generated
source-code-folder-path: src/siprouting
tag: package-phonenumber-siprouting-2021-05-01-preview
input-file: https://raw.githubusercontent.com/Azure/azure-rest-api-specs/15d66311cc2b64f04692fdf021d1b235b538e1bc/specification/communication/data-plane/SipRouting/preview/2021-05-01-preview/communicationservicessiprouting.json
payload-flattening-threshold: 0
use-extension:
  "@autorest/typescript": "6.0.0-dev.20200623.2"
clear-output-folder: false
typescript: true
v3: true
add-credentials: false
azure-arm: false
title: Sip Routing Client
```

### Directive renaming "Trunk" model to "SipTrunk"
```yaml
directive:
    - from: swagger-document
      where: "$.definitions.Trunk" 
      transform: >
          $["x-ms-client-name"] = "SipTrunk";
```

### Directive renaming "TrunkRoute" model to "SipTrunkRoute"
```yaml
directive:
    - from: swagger-document
      where: "$.definitions.TrunkRoute" 
      transform: >
          $["x-ms-client-name"] = "SipTrunkRoute";
```
