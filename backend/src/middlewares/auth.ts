import { NextFunction } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
    // const isAuth = checkAuth(req);
    const isAuth = true;
    if (!isAuth) {
        next(new Error('У вас нет прав'));
        return;
    }
    next();
}; 