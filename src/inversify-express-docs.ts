import * as invExpress from 'inversify-express-utils';
import { DocumentingMiddleware } from './documenting_middleware';

export type anyMiddleware = (invExpress.interfaces.Middleware | DocumentingMiddleware);

let controllers = {};

interface APIDefinition {
  basePath: string;
  methods: {};
}

interface Endpoint {
  key: string;
  value: string;
  method: string;
  path: string;
}

export function Controller(path: string, ...middleware: invExpress.interfaces.Middleware[]) {
  const invControllerFunction = invExpress.Controller(path, ...middleware);
  return function (constructor: any) {
    controllers[constructor.name].basePath = path;
    // console.log(util.inspect(controllers, true, 5, true));
    invControllerFunction(constructor);
  };
}

export function getDocs() {
  return controllers;
}

export function Doc(description: String) {  
  const extended = function (target: any, key: string, value: any) {
    initInfoObjects(target.constructor.name, key);
    const infoObject = controllers[target.constructor.name].methods[key];
    infoObject.doc = description;
  };
  return extended;
}

export function All(path: string, ...rawMiddleware: anyMiddleware[]) {
  return Method("all", path, ...rawMiddleware);
}

export function Get(path: string, ...rawMiddleware: anyMiddleware[]) {
  return Method('get', path, ...rawMiddleware);
}

export function Post(path: string, ...rawMiddleware: anyMiddleware[]) {
  return Method('post', path, ...rawMiddleware);
}

export function Delete(path: string, ...rawMiddleware: anyMiddleware[]) {
  return Method('delete', path, ...rawMiddleware);
}

export function Put(path: string, ...rawMiddleware: anyMiddleware[]) {
  return Method('put', path, ...rawMiddleware);
}

export function Patch(path: string, ...rawMiddleware: anyMiddleware[]) {
  return Method('patch', path, ...rawMiddleware);
}

export function Head(path: string, ...rawMiddleware: anyMiddleware[]) {
  return Method('head', path, ...rawMiddleware);
}

export function Method(method: string, path: string, ...middleware: anyMiddleware[]) {
  const actualMiddleware: invExpress.interfaces.Middleware[] = new Array();
  const additionalDocumentation = retrieveAdditionalDocumentation(middleware, actualMiddleware);
  const invExpressMethod = invExpress.Method(method, path, ...actualMiddleware);
  const extended = function (target: any, key: string, value: any) {
    initInfoObjects(target.constructor.name, key);
    const infoObject = controllers[target.constructor.name].methods[key];
    infoObject.key = key;
    infoObject.value = value;
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


export const Request = invExpress.Request;
export const Response = invExpress.Response;
export const RequestParam = paramDecoratorFactory('RequestParam', invExpress.RequestParam);
export const QueryParam = paramDecoratorFactory('QueryParam', invExpress.QueryParam);
export const RequestBody = paramDecoratorFactory('RequestBody', invExpress.RequestBody);
export const RequestHeaders = paramDecoratorFactory('RequestHeaders', invExpress.RequestHeaders);
export const Cookies = paramDecoratorFactory('Cookies', invExpress.Cookies);
export const Next = invExpress.Next;

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
