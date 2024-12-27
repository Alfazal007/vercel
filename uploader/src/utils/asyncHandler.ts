import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandlerFunction<T> = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<T> | T;

const asyncHandler = <T>(
	requestHandler: AsyncHandlerFunction<T>
): RequestHandler => {
	return (req, res, next) => {
		const result = requestHandler(req, res, next);

		const promiseResult =
			result instanceof Promise ? result : Promise.resolve(result);

		promiseResult.catch((err) => next(err));
	};
};

export { asyncHandler };
