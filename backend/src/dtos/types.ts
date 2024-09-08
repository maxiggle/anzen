import { NextFunction, Request, Response } from "express";

export type Handler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any

export enum RegisterRole {
    Contractor = 'contractor',
    Employer = 'company',
}