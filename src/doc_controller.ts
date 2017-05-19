import { interfaces } from 'inversify-express-utils';
import { Controller, Get, Post, Put, Delete, getDocs, RequestParam, Request as invRequest, Response as InvResponse  } from './inversify-express-docs';
import { injectable, inject } from 'inversify';
import { Response } from 'express';
import 'reflect-metadata';
import * as pug from 'pug';

@injectable()
@Controller('/doc')
export default class DocController implements  interfaces.Controller {
  private basePath = 'node_modules/inversify-express-doc/dist/';
  private localPath = 'src/';
  private pugFile = 'header.pug';

  @Get('/')
  public getDocumentation(@invRequest() request: { user: any}, @InvResponse() res: Response) {
    res.type('text/html');
    const compiledFunction = this.getCompileFunction(this.pugFile);
    res.send(compiledFunction({ controllers: getDocs(), body: 'api'}));
  }

  @Get('/:controller/:endpoint')
  public getEndpointDocumentation(@RequestParam('controller') controller: string, @RequestParam('endpoint') endpoint: string, @InvResponse() res: Response) {
    res.type('text/html');
    const compiledFunction = this.getCompileFunction(this.pugFile);
    const controllerData: { methods: any[], basePath: string } = getDocs()[controller];
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