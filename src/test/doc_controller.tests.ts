import 'reflect-metadata';
import {Container} from 'inversify';
import { interfaces as utilsInterfaces, TYPE, requestParam } from 'inversify-express-utils';
import DocController from '../doc_controller';
import { InversifyExpressServer, getRawMetadata } from 'inversify-express-utils';
import * as request from 'supertest';
import * as Chai from 'chai';
import * as express from 'express';
import { getDocumentationData, load } from '../inversify-express-docs';
import { generatedMetadata, endpointHtmlResponsePart } from './fixtures';

const expect = Chai.expect;
let kernel: Container;
let server: InversifyExpressServer;
let instance: any;
describe('inversify-express-doc', () => {let app: express.Application;
  before(() => {// start the server
    kernel = new Container();
    const test = new DocController();    
    const server = new InversifyExpressServer(kernel);
    server.setConfig((app: any) => {
      app.use(function(req: any, res: any, next: any) {
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
      });
    });
    const port = process.env['PORT'] || 8080;
    
    app = server.build();
    instance = app.listen(port);
    load(kernel);
  });
  after(() => {
    instance.close();
  });
  
  describe('getDocumentationData()', () => {
    it('should return correct data', () => {
      expect(JSON.stringify(getDocumentationData())).to.equal(generatedMetadata);
    });
  });
  describe('APIDoc Controller', () => {
    describe('getDocumentation()', () => {
      it('should return an HTML document', (done: any) => {
        request(app)
        .get('/doc')
        .set('Accept', 'text/html; charset=utf-8')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200)
        .end(done);
      });
    });
    describe('getEndpointDocumentation()', () => {
      it('should return an HTML document', (done: any) => {
        request(app)
        .get('/doc/DocController/getEndpointDocumentation')
        .set('Accept', 'text/html; charset=utf-8')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200)
        .expect((res: request.Response) => res.text.indexOf(endpointHtmlResponsePart) !== -1)
        .end(done);
      });
      it('should return 404 Not Found for nonexistant controller', (done: any) => {
        request(app)
        .get('/doc/ghnfhjmjhv/getEndpointDocumentation')
        .set('Accept', 'text/html; charset=utf-8')
        .expect(404)
        .end(done);
      });
      it('should return 404 Not Found for nonexistant endpoint', (done: any) => {      
        request(app)
        .get('/doc/DocController/gfhgdhmnfhjm')
        .set('Accept', 'text/html; charset=utf-8')
        .expect(404)
        .end(done);
      });
    });
  });
});
