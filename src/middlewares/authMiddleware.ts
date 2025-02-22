import { NextFunction, Request, Response } from "express";
import { jwtService } from "../features/application";
import { usersQueryRepository } from "../query_repositories";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (!req.headers.authorization) {
    res.status(401).json({
      errorMessages: {
        message: "Auth credentials is incorrect",
      },
    });
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  const userId = await jwtService.getUserIdByToken(token);

  if (!userId) {
    res.status(401).json({
      errorMessages: {
        message: "Auth credentials is incorrect",
      },
    });
    return;
  }

  const foundUser = await usersQueryRepository.getByIdUser(userId);
  if (!foundUser) {
    res.sendStatus(401);
    return;
  }

  req.user = foundUser;
  next();
};
