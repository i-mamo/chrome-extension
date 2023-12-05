import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx, defineManifest } from "@crxjs/vite-plugin"



const manifest = defineManifest({
  manifest_version: 3,
  name: "chrome-extension",
  version: "1.0.0",
  icons: {
    128: "icon-128-active.png"
  },
  action: {
    default_popup: "index.html"
  },
  side_panel: {
    default_path: "index.html",
  },
  permissions: [
    'sidePanel',
    'tabs',
    'activeTab',
    'storage',
    'scripting'
  ],
  host_permissions: ["<all_urls>"],
  background: {
    service_worker: "src/background/background.ts"
  }
})

export default defineConfig((comand) => {
  return {
    server: {
      port: 5173,
      strictPort: true,
      hmr: {
        port: 5173
      },
    },
    build: {
      rollupOptions: {
        input: {

        },
        output: {

        },
      },
      watch: {

      }
    },
    plugins: [react(), crx({ manifest })],
  }
})
