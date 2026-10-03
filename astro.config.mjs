import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import lottie from "astro-integration-lottie";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import vercel from "@astrojs/vercel";

/**
 * Vite plugin to handle Windows system file locks (EBUSY / DumpStack.log.tmp)
 * and prevent unhandled 'error' events on the file watcher from crashing the dev server.
 */
function windowsWatcherFixPlugin() {
  return {
    name: "windows-watcher-fix",
    configureServer(server) {
      server.watcher.on("error", (error) => {
        if (
          error &&
          (error.code === "EBUSY" ||
            error.code === "EPERM" ||
            error.code === "EACCES" ||
            (typeof error.path === "string" &&
              /DumpStack|pagefile|swapfile|hiberfil/i.test(error.path)))
        ) {
          // Silently suppress locked Windows system file errors
          return;
        }
        console.error("[vite watcher error]", error);
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://fluxfuse.net",
  redirects: {
    "/features": "/products",
    "/pricing": "/services",
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  integrations: [icon(), sitemap(), lottie(), react(), markdoc()],
  vite: {
    plugins: [tailwindcss(), windowsWatcherFixPlugin()],
    server: {
      fs: {
        strict: true,
        allow: ["."],
      },
      watch: {
        ignored: [
          "**/DumpStack.log.tmp",
          "**/*.log.tmp",
          "**/hiberfil.sys",
          "**/pagefile.sys",
          "**/swapfile.sys",
          "C:/*.tmp",
          "C:/*.sys",
          (path) =>
            typeof path === "string" &&
            /DumpStack|pagefile\.sys|swapfile\.sys|hiberfil\.sys/i.test(path),
        ],
      },
    },
  },
  adapter: vercel(),
});
