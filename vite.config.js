import { resolve } from "path";

const rewriteToDashboard = () => {
    return {
        name: "rewrite-to-dashboard",
        apply: "serve",
        enforce: "post",
        configureServer(server) {
            server.middlewares.use("/", (req, _, next) => {
                if (
                    (req.url.startsWith("/dashboard/") && !req.url.includes(".")) ||
                    req.url === "/dashboard"
                ) {
                    req.url = "/dashboard/index.html";
                }
                next();
            });
        },
    };
};

export default {
    appType: "spa",
    minify: "esbuild",
    build: {
        rollupOptions: {
            input: {
                dashboard: resolve(__dirname, "webapp", "index.html"),
            },
        },
        outDir: "../src/main/resources/static/",
    },
    root: "webapp",
 // Uitsluiten van Unity bestanden van Vite's parsing
    assetsInclude: [
        '**/*.br',
        '**/*.data',
        '**/*.wasm',
    ],

    publicDir: 'js/pages/TestBuild',

    plugins: [rewriteToDashboard()],
    server: {
        proxy: {
            "/api": "http://localhost:8080",
        },
    },
};