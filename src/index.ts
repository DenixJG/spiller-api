import app from "./app";


function main() {
    app.listen(app.get('port'))
        .on('listening', () => {
            console.log(`[LOG]: Servidor iniciado - localhost:${app.get('port')}`);
        }).on('error', () => {
            console.log('[LOG]: Error en el servidor');
        }).on('close', () => {
            console.log('[LOG]: Servidor cerrado');
        });
}

main();