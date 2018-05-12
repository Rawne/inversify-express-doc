import { interfaces } from 'inversify-express-utils';
import { Endpoint, ControllerDefinition, Param} from './interfaces';

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

export default function processMetadata(metadata: Metadata[]) {
  return metadata.reduce((result, controller) => {
    const endpoints = controller.methodMetadata.reduce((endpointResult, endpoint) => {
      const paramData = controller.parameterMetadata[endpoint.key];
      const params = paramData.map((data): Param => {
        return { name: data.parameterName, inputType: PARAMETER_TYPE[data.type], index: data.index};
      });
      const endpointData: Endpoint = { key: endpoint.key, method: endpoint.method, path: endpoint.path, params: params};
      endpointResult[endpoint.key] = endpointData;
      return endpointResult;
    }, {});
    const data: ControllerDefinition = { basePath: controller.controllerMetadata.path, methods: endpoints};
    result[controller.controllerMetadata.path] = data;
    return result;
  }, {});
}