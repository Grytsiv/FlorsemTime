export interface IError {
  code: string;
  detail: string;
  id: string;
  source: {};
  status: string;
  title: string;
}
export class Error implements IError {
  code: string;
  detail: string;
  id: string;
  source: {};
  status: string;
  title: string;

  constructor(code: string = '', detail: string = '', id: string = '', source: {}, status: string = '', title: string = '' ) {
    this.code = code;
    this.detail = detail;
    this.id = id;
    this.source = source;
    this.status = status;
    this.title = title;
  }
}
export interface IErrors {
  status: number;
  errors: IError[];
  message: string[];
}
export class Errors implements IErrors {
  status: number;
  errors: IError[];
  message: string[];

  constructor(status: number = 0, errors: IError[] = [], message: string[] = []) {
    this.status = status;
    this.errors = errors;
    this.message = message;
  }
}
