import { NextFunction, Request, Response } from "express";
import { generateNewAccessToken, verifyToken } from "../helpers/jwt";

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token: string = authHeader.split(" ")[1];
  try {
    const decodedUser = await verifyToken(token);
    if (!decodedUser) {
      const newJwt = await generateNewAccessToken(token);
      if (!newJwt) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.setHeader("Authorization", `Bearer ${newJwt}`);
      return res.status(200).json({ accessToken: newJwt });
    }

    (req as any).user = decodedUser;
    next();
  } catch (e: any) {
    console.error("Error in protectedRoute -", e.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};