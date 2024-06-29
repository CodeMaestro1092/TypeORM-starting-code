import jwt from "jsonwebtoken";
import config from "config";
import crypto from "crypto";
import { RefreshToken } from "../entity/refreshToken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

type refreshTokenT = {
  id: number;
  token: string;
  user: userT;
  userId: string;
};

type jwtTokensT = {
  accessToken: string;
  refreshToken: string;
};

type userT = {
  id: string;
  name: string;
  email: string;
  password: string;
  refreshTokens: refreshTokenT[];
};

type generateTokenT = (user: userT) => Promise<jwtTokensT>;

const generateToken: generateTokenT = async (
  user: userT
): Promise<jwtTokensT> => {
  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
  };

  const jwtTokens: jwtTokensT = {
    accessToken: jwt.sign(payload, config.get("jwtSecret") as string, {
      expiresIn: "1h",
    }),
    refreshToken: crypto.randomBytes(64).toString("hex"),
  };

  const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
  const refreshToken = new RefreshToken();
  refreshToken.token = jwtTokens.refreshToken;
  refreshToken.user = user;

  await refreshTokenRepository.save(refreshToken);

  return jwtTokens;
};

const verifyToken = async (token: string): Promise<userT | null> => {
  try {
    const decoded = jwt.verify(
      token,
      config.get("jwtSecret") as string
    ) as jwt.JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.userId } });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (e: any) {
    console.error("Error in verifyToken -", e.message);
    return null;
  }
};

const generateNewAccessToken = async (
  refreshToken: string
): Promise<string | undefined> => {
  try {
    const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    const existingRefreshToken = await refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ["user"],
    });

    if (!existingRefreshToken || !existingRefreshToken.user) {
      throw new Error("Invalid refresh token");
    }

    const user = existingRefreshToken.user;
    const newJwt = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      config.get("jwtSecret") as string,
      { expiresIn: "1h" }
    );

    return newJwt;
  } catch (e: any) {
    console.error("Error in generateNewAccessToken -", e.message);
  }
};

export { verifyToken, generateToken, generateNewAccessToken };