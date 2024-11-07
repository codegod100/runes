import { createIdResolver } from "$lib/id-resolver";
import { createIngester } from "$lib/ingester.js";

const baseIdResolver = createIdResolver();
const ingester = createIngester(baseIdResolver);
ingester.start();
