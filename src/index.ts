import { postgres } from "./postgres";
import { create } from "./webserver";
import * as dotenv from "dotenv";
import { emailManager } from "./emailManager";
import { audioDB } from "./audioDB";
import { cacheManager } from "./cacheManager";

dotenv.config()
new emailManager()
new cacheManager()
new audioDB();
new postgres().connect();
create();

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
