import * as express from "express"
declare global {
    namespace Express {
        interface Request {
            user? : Record<string,any>
            rawBody : any
        }
    }
}