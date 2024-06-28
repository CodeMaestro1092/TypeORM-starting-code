import bcrypt from "bcrypt";

type hashedPasswordT = (password: string) => Promise<string>;
type comparePasswordT = (
  password: string,
  passwordHash: string
) => Promise<boolean>;

const hashPassword: hashedPasswordT = async (
  password: string
): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const comparePassword: comparePasswordT = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  const isCorrectPassword = await bcrypt.compare(password, passwordHash);

  return isCorrectPassword;
};

export { comparePassword, hashPassword };
