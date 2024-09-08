import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Endpoint Not found' })
}

