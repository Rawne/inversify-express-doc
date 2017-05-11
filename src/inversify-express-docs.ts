import { Controller as invController, Method as invMethod, interfaces } from 'inversify-express-utils';
import { DocumentingMiddleware } from './documenting_middleware';

export type anyMiddleware = ( interfaces.Middleware | DocumentingMiddleware);

let controllers = {};

interface APIDefinition {
  basePath: string;
  methods: Endpoint[];
}

interface Endpoint {
  key: string;
  value: string;
  method: string;
  path: string;
}

export function Controller(path: string, ...middleware: interfaces.Middleware[]) {
  const invControllerFunction = invController(path, ...middleware);
  return function (constructor: any) {
    controllers[constructor.name].basePath = path;
    // console.log(util.inspect(controllers, true, 5, true));
    invControllerFunction(constructor);
  };
}

export function getDocs() {
  return controllers;
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
  const actualMiddleware: interfaces.Middleware[] = new Array();
  const additionalDocumentation = retrieveAdditionalDocumentation(middleware, actualMiddleware);
  const invExpress = invMethod(method, path, ...actualMiddleware);
  const extended = function (target: any, key: string, value: any) {
    if (!controllers[target.constructor.name]) {
      controllers[target.constructor.name] = { methods: new Array<Endpoint>(), path: '/' };
    }
    controllers[target.constructor.name].methods.push(
      { key: key,
        value: value,
        method: method,
        path: path,
        more: additionalDocumentation });
    invExpress(target, key, value);
  };
  return extended;
}

function retrieveAdditionalDocumentation(middleware: anyMiddleware[], actualMiddleware: interfaces.Middleware[]) {
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
