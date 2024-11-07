import { createIdResolver } from "$lib/id-resolver";
import { createIngester } from "$lib/ingester.js";
import dotenv from "dotenv";

dotenv.config();
const baseIdResolver = createIdResolver();
const ingester = createIngester(baseIdResolver);
ingester.start();
