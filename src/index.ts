import { config } from "dotenv";
import { FClient } from "./structures/Client";
config();

export const client = new FClient();

client.start();
