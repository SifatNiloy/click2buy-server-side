import app from "./app";
import { connectDB } from "./config/db";

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed starting server", err);
    process.exit(1);
  }
};

start();
