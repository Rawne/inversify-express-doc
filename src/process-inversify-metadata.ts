import { interfaces } from 'inversify-express-utils';
import { Endpoint, ControllerDefinition, Param } from './interfaces';

export interface Metadata {
  controllerMetadata: interfaces.ControllerMetadata;
  methodMetadata: interfaces.ControllerMethodMetadata[];
  parameterMetadata: interfaces.ControllerParameterMetadata;
}

enum PARAMETER_TYPE {
  REQUEST = 0,
  RESPONSE = 1,
  PARAMS = 2,
  QUERY = 3,
  BODY = 4,
  HEADERS = 5,
  COOKIES = 6,
  NEXT = 7,
}

export default function processMetadata(metadata: Metadata[], decoratorData: {}) {
  return metadata.reduce((result, controller) => {
    const controllerName = controller.controllerMetadata.target.name;
    const endpoints = controller.methodMetadata.reduce((endpointResult, endpoint) => {
      const paramData = controller.parameterMetadata ? controller.parameterMetadata[endpoint.key] : [];

      const params = paramData.filter(p => p.type > 1).map((data): Param => {
        return { name: data.parameterName, inputType: PARAMETER_TYPE[data.type], index: data.index };
      });
      const doc = getDocForEndpoint(decoratorData, controllerName, endpoint.key);
      const endpointData: Endpoint = { key: endpoint.key, method: endpoint.method, path: endpoint.path, params: params, more: {}, doc: doc };
      endpointResult[endpoint.key] = endpointData;

      return endpointResult;
    }, {});
    const data: ControllerDefinition = { basePath: controller.controllerMetadata.path, methods: endpoints };
    result[controllerName] = data;
    return result;
  }, {});
}

function getDocForEndpoint(decoratorData: {}, controllerName: string, endpointName: string): string {
  if (decoratorData[controllerName] && decoratorData[controllerName].methods[endpointName]) {
    return decoratorData[controllerName].methods[endpointName].doc;
  }
}