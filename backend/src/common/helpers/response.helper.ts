import { HttpStatus } from '@nestjs/common';

export class ResponseHelper {
  static success(
    message: string,
    data: any = null,
    status: HttpStatus = HttpStatus.OK,
  ) {
    return {
      status,
      success: true,
      message,
      data,
    };
  }

  static error(
    message: string,
    errors: any[] = [],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    return {
      status,
      success: false,
      message,
      errors,
    };
  }
}
