// success: true => message, data
// success: false => errorMessage, error
import { IResponse } from '../interfaces/response.interface';

export class ResponseError implements IResponse{
  constructor (infoMessage:string, data?: any) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
  };
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
}

export class ResponseSuccess implements IResponse{
  constructor (infoMessage:string, data?: any) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
  };
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
}