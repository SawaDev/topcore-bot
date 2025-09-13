import {NextFunction, Request, Response} from "express"
import {expressLogger} from "telegram/config/logger.config"

export default {
    // Логирование ошибок
    logErrors: (err: Error, req: Request, res: Response, next: NextFunction) => {
        expressLogger.error(err.stack)
        next(err)
    },
    // Вывод ошибки для клиента
    clientErrorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.xhr) {
            res.status(500).send({error: "Something failed!"})
        } else {
            next(err)
        }
    },
    // Вывод ошибки
    errorHandler: (err: Error, req: Request, res: Response, next) => {
        res.status(500).send({error: err.message})
        next()
    }
}
