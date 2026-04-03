import { type NextFunction, type Request, type Response } from 'express';
import 'dotenv';
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.middleware.d.ts.map