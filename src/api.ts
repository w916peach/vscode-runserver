import { Application } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export default (publicPath: string, app: Application) => {
    const dirs: string[] = fs.readdirSync(publicPath);
    if (dirs.indexOf('api') === -1) {
        return;
    }
    const apiDirs: string[] = fs.readdirSync(path.join(publicPath, 'api'));
    const APIS: ObjectPathInfo[] = apiDirs.map((item: string) => {
        return {
            name: item,
            abs: path.join(path.join(publicPath, 'api'), item)
        };
    });
    APIS.forEach((item: ObjectPathInfo) => {
        const listener: any = require(item.abs);
        const index: number = item.name.lastIndexOf('.');
        const pathname: string = `/api/${item.name.slice(0, index)}`;
        app.get(pathname, listener);
        app.post(pathname, listener);
    });
};