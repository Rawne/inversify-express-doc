import { interfaces } from 'inversify-express-utils';
import { controller, httpGet, httpPost, httpPut, httpDelete, getDocumentationData, requestParam, request, response } from './inversify-express-docs';
import { injectable, inject } from 'inversify';
import { Response } from 'express';
import 'reflect-metadata';
import * as pug from 'pug';

@controller('/doc')
export default class DocController implements  interfaces.Controller {
  private basePath = 'node_modules/inversify-express-doc/dist/';
  private localPath = 'src/';
  private pugFile = 'header.pug';

  @httpGet('/')
  public getDocumentation(@request() request: { user: any}, @response() res: Response) {
    res.type('text/html');
    const compiledFunction = this.getCompileFunction(this.pugFile);
    res.send(compiledFunction({ controllers: getDocumentationData(), body: 'api'}));
  }

  @httpGet('/:controller/:endpoint')
  public getEndpointDocumentation(@requestParam('controller') controller: string, @requestParam('endpoint') endpoint: string, @response() res: Response) {
    res.type('text/html');
    const compiledFunction = this.getCompileFunction(this.pugFile);
    const controllerData: { methods: any[], basePath: string } = getDocumentationData()[controller];
    if(this.testForExists(controllerData, res)){
      return;
    }
    const endpointData = controllerData.methods[endpoint];
    if(this.testForExists(endpointData, res)) {
      return;
    }
    endpointData.basePath = controllerData.basePath;
    endpointData.body = 'endpoint';
    res.send(compiledFunction(endpointData));
  }

  private getCompileFunction(fileName: string) {
    let compiledFunction;
    try {
      compiledFunction = pug.compileFile(this.basePath + fileName);
    } catch(err) {      
      compiledFunction = pug.compileFile(this.localPath + fileName);
    }
    return compiledFunction;
  }

  private testForExists(data: any, res: any) {
    if (!data) {
      return res.status(404).send('Not Found');
    }
  }
}