
export interface ControllerDefinition {
  basePath: string;
  methods: {};
}

export interface Endpoint {
  key: string;
  method: string;
  path: string;
  params?: Param[];
  more?: {};
}

export interface Param {
  name: string;
  type?: string;
  inputType: string;
  index?: number;
}
