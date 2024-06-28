import jwt from "jsonwebtoken";
import config from "config";
import crypto from "crypto";
import { RefreshToken } from "../entity/refreshToken";
import { AppDataSource } from "../data-source";

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
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: refreshTokenT[];
};

type generateTokenT = (user: userT) => Promise<jwtTokensT>;

const generateToken: generateTokenT = async (
  user: userT
): Promise<jwtTokensT> => {
  const payload: { userId: string } = {
    userId: user.id,
  };

  const jwtTokens: jwtTokensT = {
    accessToken: jwt.sign(payload, config.get("jwtSecret") as string, {
      expiresIn: "10d",
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

const verifyToken = (token: string): string | null => {
  try {
    const decoded: string = jwt.verify(
      token,
      config.get("jwtSecret")!
    ) as string;
    return decoded;
  } catch (e: any) {
    console.error("error in verifyToken - ", e.message);
    return null;
  }
};

const generateNewAccessToken = async (refreshToken: string): Promise<string | undefined>=> {
  try {
    const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
    const existingRefreshToken = await refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if(!existingRefreshToken){
        throw new Error('refreshToken doesnt exists');
    }

    const user = existingRefreshToken.user;
    if(!user){
        throw new Error('user doenst exists')
    }

    const newJwt = jwt.sign({userid: user.id}, config.get('jwtSecret') as string, {expiresIn: '1h'})

    return newJwt ;
  } catch (e: any) {
    console.error("Error in generateNewAccessToken - ", e.message);
  }
};

export { verifyToken, generateToken, generateNewAccessToken };
