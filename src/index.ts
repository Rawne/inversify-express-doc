import {DocumentingMiddleware} from './documenting_middleware';
import DocController from './doc_controller';
import { 
  Get,
  Post,
  Put,
  Delete,
  Head,
  Patch,
  Controller,
  getDocs,
  Method,
  anyMiddleware
} from './inversify-express-docs'

export { 
  DocumentingMiddleware,
  Get,
  Post,
  Put,
  Delete,
  Head,
  Patch,
  Controller,
  getDocs,
  Method,
  anyMiddleware,
  DocController
}