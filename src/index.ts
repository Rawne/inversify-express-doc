import {DocumentingMiddleware} from './documenting_middleware';
import DocController from './doc_controller';
export { 
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  httpHead,
  httpPatch,
  controller,
  request,
  response,
  requestParam,
  queryParam,
  requestBody,
  requestHeaders,
  cookies,
  next,
  getDocs,
  httpMethod,
  anyMiddleware,
  Doc
} from './inversify-express-docs'

export { 
  DocumentingMiddleware,
  DocController
}