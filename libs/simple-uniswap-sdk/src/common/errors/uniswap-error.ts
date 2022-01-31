import { ErrorCodes } from '../..';

export class UniswapError extends Error {
  public override name = 'UniswapError';
  public code: ErrorCodes;
  public override message: string;
  constructor(message: string, code: ErrorCodes) {
    super(message);
    this.message = message;
    this.code = code;
  }
}
