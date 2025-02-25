import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
    path: path.join(process.cwd(), `/apps/service-user/.env`),
});

export default () => ({});
