import { AppDataSource } from "../data-source";

const connectToDatabase = async (app: any, PORT: number): Promise<void> => {
  await AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((e) => {
      console.error("Error during Data Source initialization - ", e);
    });

  app.listen(PORT, () => {
    console.log("server running on port:", PORT);
  });
};

export default connectToDatabase;
