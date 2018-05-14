import * as invExpress from 'inversify-express-utils';
import { DocumentingMiddleware } from './documenting_middleware';
import { ControllerDefinition, Endpoint } from './interfaces';
import { Container } from 'inversify/dts/container/container';
import processMetadata from './process-inversify-metadata';

export type anyMiddleware = (invExpress.interfaces.Middleware | DocumentingMiddleware);

let controllers = {};
let loadedMetadata;

export function controller(path: string, ...middleware: invExpress.interfaces.Middleware[]) {
  const invControllerFunction = invExpress.controller(path, ...middleware);
  return function (constructor: any) {
    controllers[constructor.name].basePath = path;
    // console.log(util.inspect(controllers, true, 5, true));
    invControllerFunction(constructor);
  };
}

/**
 * @deprecated Use getDocumentation instead. 
 * This function will only get documentation from explicit doc decorators
 */
export function getDocs() {
  return controllers;
}

export function getDocumentationData() {
  if (Object.keys(controllers).length > 0) {
    return controllers;
  } else if(loadedMetadata) {
    return getDocumentationFromMetadata();
  }
  console.warn('No metadata found. Make sure to call load(inversifyContainer) on inversify-express-doc.')
}

export function getDocumentationFromMetadata() {
  return processMetadata(loadedMetadata);
}

export function load(container: Container) {
  loadedMetadata = invExpress.getRawMetadata(container);
}

export function Doc(description: string) {  
  const extended = function (target: any, key: string, value: any) {
    initInfoObjects(target.constructor.name, key);
    const infoObject = controllers[target.constructor.name].methods[key];
    infoObject.doc = description;
  };
  return extended;
}

export function all(path: string, ...rawMiddleware: anyMiddleware[]) {
  return httpMethod("all", path, ...rawMiddleware);
}

export function httpGet(path: string, ...rawMiddleware: anyMiddleware[]) {
  return httpMethod('get', path, ...rawMiddleware);
}

export function httpPost(path: string, ...rawMiddleware: anyMiddleware[]) {
  return httpMethod('post', path, ...rawMiddleware);
}

export function httpDelete(path: string, ...rawMiddleware: anyMiddleware[]) {
  return httpMethod('delete', path, ...rawMiddleware);
}

export function httpPut(path: string, ...rawMiddleware: anyMiddleware[]) {
  return httpMethod('put', path, ...rawMiddleware);
}

export function httpPatch(path: string, ...rawMiddleware: anyMiddleware[]) {
  return httpMethod('patch', path, ...rawMiddleware);
}

export function httpHead(path: string, ...rawMiddleware: anyMiddleware[]) {
  return httpMethod('head', path, ...rawMiddleware);
}

export function httpMethod(method: string, path: string, ...middleware: anyMiddleware[]) {
  const actualMiddleware: invExpress.interfaces.Middleware[] = new Array();
  const additionalDocumentation = retrieveAdditionalDocumentation(middleware, actualMiddleware);
  const invExpressMethod = invExpress.httpMethod(method, path, ...actualMiddleware);
  const extended = function (target: any, key: string, value: any) {
    initInfoObjects(target.constructor.name, key);
    const infoObject: Endpoint = controllers[target.constructor.name].methods[key];
    infoObject.key = key;
    infoObject.method = method;
    infoObject.path = path;
    infoObject.more = additionalDocumentation;
    invExpressMethod(target, key, value);
  };
  return extended;
}

function retrieveAdditionalDocumentation(middleware: anyMiddleware[], actualMiddleware: invExpress.interfaces.Middleware[]) {
  const additionalDoc = {};
  middleware.forEach((el: any) => {
    if (el.name && el.value) {
      additionalDoc[el.name] = el.value;
      actualMiddleware.push(el.middleware);
    } else {
      actualMiddleware.push(el);
    }
  });
  return additionalDoc;
}


export const request = invExpress.request;
export const response = invExpress.response;
export const requestParam = paramDecoratorFactory('RequestParam', invExpress.requestParam);
export const queryParam = paramDecoratorFactory('QueryParam', invExpress.queryParam);
export const requestBody = paramDecoratorFactory('RequestBody', invExpress.requestBody);
export const requestHeaders = paramDecoratorFactory('RequestHeaders', invExpress.requestHeaders);
export const cookies = paramDecoratorFactory('Cookies', invExpress.cookies);
export const next = invExpress.next;

function paramDecoratorFactory(inputType: string, parameterType: (name?: string) => ParameterDecorator): (name?: string) => ParameterDecorator {
  return function (name?: string): ParameterDecorator {
    const decorator = parameterType(name);
    return function (target: Object, methodName: string, index: number) {
      initInfoObjects(target.constructor.name, methodName);
      const infoObject = controllers[target.constructor.name].methods[methodName];
      var paramType = Reflect.getMetadata('design:paramtypes', target, methodName)[index].name;
      infoObject.params.push({name: name, type: paramType, inputType: inputType});
      return decorator(target, methodName, index);
    };
  };
}

function initInfoObjects(controllerName: string, functionName: string) {
  if (!controllers[controllerName]) {
    controllers[controllerName] = { methods: {}, path: '/' };
  }
  if (functionName && !controllers[controllerName].methods[functionName]) {
    controllers[controllerName].methods[functionName] = { params: new Array()}
  };
}
