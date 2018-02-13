import 'reflect-metadata';
import {Container} from 'inversify';
import { interfaces as utilsInterfaces, TYPE } from 'inversify-express-utils';
import DocController from '../doc_controller';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as request from 'supertest';
import * as Chai from 'chai';
import * as express from 'express';

const expect = Chai.expect;
let kernel: Container;
let server: InversifyExpressServer;
let instance: any;
describe('APIDoc Controller', () => {
  let app: express.Application;
  before(() => {// start the server
    kernel = new Container();
    const test = new DocController();
    kernel.bind<utilsInterfaces.Controller>(TYPE.Controller).toConstantValue(test)
        .whenTargetNamed('DocController');
    
    server = new InversifyExpressServer(kernel);
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
  });
  after(() => {
    instance.close();
  });
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
