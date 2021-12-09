
export default (dirnames: string[]) => {
    return (req: any, res: any, next: any) => {
        const noPass: boolean = dirnames.some((dirname: string) => req.url.startsWith(dirname));
        if (noPass) {
            res.send('<h1>404</h1>');
            return;
        }
        if (req.path === '/api' || req.path === '/api/') {
            res.send('<h1>404</h1>');
            return;
        }
        next();
    };
};