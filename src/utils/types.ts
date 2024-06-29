import { Query } from 'express-serve-static-core';
import { Request } from 'express';
export interface TypedRequest<T extends Query, U> extends Express.Request {
    body: U,
    query: T,
    user: any
}
