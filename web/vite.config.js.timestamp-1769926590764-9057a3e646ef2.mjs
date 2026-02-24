// vite.config.js
import react from "file:///D:/gocode/new-api/web/node_modules/@vitejs/plugin-react/dist/index.js";
import { defineConfig, transformWithEsbuild } from "file:///D:/gocode/new-api/web/node_modules/vite/dist/node/index.js";
import pkg from "file:///D:/gocode/new-api/web/node_modules/@douyinfe/vite-plugin-semi/lib/index.js";
import path from "path";
import { codeInspectorPlugin } from "file:///D:/gocode/new-api/web/node_modules/code-inspector-plugin/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\gocode\\new-api\\web";
var { vitePluginSemi } = pkg;
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@douyinfe/semi-ui/dist/css/semi.css": path.resolve(
        __vite_injected_original_dirname,
        "./node_modules/@douyinfe/semi-ui/dist/css/semi.css"
      )
    }
  },
  plugins: [
    codeInspectorPlugin({
      bundler: "vite"
    }),
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!/src\/.*\.js$/.test(id)) {
          return null;
        }
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic"
        });
      }
    },
    react(),
    vitePluginSemi({
      cssLayer: true
    })
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".json": "json"
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-core": ["react", "react-dom", "react-router-dom"],
          "semi-ui": ["@douyinfe/semi-icons", "@douyinfe/semi-ui"],
          tools: ["axios", "history", "marked"],
          "react-components": [
            "react-dropzone",
            "react-fireworks",
            "react-telegram-login",
            "react-toastify",
            "react-turnstile"
          ],
          i18n: [
            "i18next",
            "react-i18next",
            "i18next-browser-languagedetector"
          ]
        }
      }
    }
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      "/mj": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      "/pg": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxnb2NvZGVcXFxcbmV3LWFwaVxcXFx3ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGdvY29kZVxcXFxuZXctYXBpXFxcXHdlYlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovZ29jb2RlL25ldy1hcGkvd2ViL3ZpdGUuY29uZmlnLmpzXCI7LypcbkNvcHlyaWdodCAoQykgMjAyNSBRdWFudHVtTm91c1xuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbnB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZVxuTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlXG5HTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuRm9yIGNvbW1lcmNpYWwgbGljZW5zaW5nLCBwbGVhc2UgY29udGFjdCBzdXBwb3J0QHF1YW50dW1ub3VzLmNvbVxuKi9cblxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgdHJhbnNmb3JtV2l0aEVzYnVpbGQgfSBmcm9tICd2aXRlJztcbmltcG9ydCBwa2cgZnJvbSAnQGRvdXlpbmZlL3ZpdGUtcGx1Z2luLXNlbWknO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBjb2RlSW5zcGVjdG9yUGx1Z2luIH0gZnJvbSAnY29kZS1pbnNwZWN0b3ItcGx1Z2luJztcbmNvbnN0IHsgdml0ZVBsdWdpblNlbWkgfSA9IHBrZztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICdAZG91eWluZmUvc2VtaS11aS9kaXN0L2Nzcy9zZW1pLmNzcyc6IHBhdGgucmVzb2x2ZShcbiAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAnLi9ub2RlX21vZHVsZXMvQGRvdXlpbmZlL3NlbWktdWkvZGlzdC9jc3Mvc2VtaS5jc3MnLFxuICAgICAgKSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgY29kZUluc3BlY3RvclBsdWdpbih7XG4gICAgICBidW5kbGVyOiAndml0ZScsXG4gICAgfSksXG4gICAge1xuICAgICAgbmFtZTogJ3RyZWF0LWpzLWZpbGVzLWFzLWpzeCcsXG4gICAgICBhc3luYyB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgICAgaWYgKCEvc3JjXFwvLipcXC5qcyQvLnRlc3QoaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2UgdGhlIGV4cG9zZWQgdHJhbnNmb3JtIGZyb20gdml0ZSwgaW5zdGVhZCBvZiBkaXJlY3RseVxuICAgICAgICAvLyB0cmFuc2Zvcm1pbmcgd2l0aCBlc2J1aWxkXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1XaXRoRXNidWlsZChjb2RlLCBpZCwge1xuICAgICAgICAgIGxvYWRlcjogJ2pzeCcsXG4gICAgICAgICAganN4OiAnYXV0b21hdGljJyxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVhY3QoKSxcbiAgICB2aXRlUGx1Z2luU2VtaSh7XG4gICAgICBjc3NMYXllcjogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZm9yY2U6IHRydWUsXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIGxvYWRlcjoge1xuICAgICAgICAnLmpzJzogJ2pzeCcsXG4gICAgICAgICcuanNvbic6ICdqc29uJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgJ3JlYWN0LWNvcmUnOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgJ3NlbWktdWknOiBbJ0Bkb3V5aW5mZS9zZW1pLWljb25zJywgJ0Bkb3V5aW5mZS9zZW1pLXVpJ10sXG4gICAgICAgICAgdG9vbHM6IFsnYXhpb3MnLCAnaGlzdG9yeScsICdtYXJrZWQnXSxcbiAgICAgICAgICAncmVhY3QtY29tcG9uZW50cyc6IFtcbiAgICAgICAgICAgICdyZWFjdC1kcm9wem9uZScsXG4gICAgICAgICAgICAncmVhY3QtZmlyZXdvcmtzJyxcbiAgICAgICAgICAgICdyZWFjdC10ZWxlZ3JhbS1sb2dpbicsXG4gICAgICAgICAgICAncmVhY3QtdG9hc3RpZnknLFxuICAgICAgICAgICAgJ3JlYWN0LXR1cm5zdGlsZScsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBpMThuOiBbXG4gICAgICAgICAgICAnaTE4bmV4dCcsXG4gICAgICAgICAgICAncmVhY3QtaTE4bmV4dCcsXG4gICAgICAgICAgICAnaTE4bmV4dC1icm93c2VyLWxhbmd1YWdlZGV0ZWN0b3InLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICAnL21qJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICB9LFxuICAgICAgJy9wZyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBbUJBLE9BQU8sV0FBVztBQUNsQixTQUFTLGNBQWMsNEJBQTRCO0FBQ25ELE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsU0FBUywyQkFBMkI7QUF2QnBDLElBQU0sbUNBQW1DO0FBd0J6QyxJQUFNLEVBQUUsZUFBZSxJQUFJO0FBRzNCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyx1Q0FBdUMsS0FBSztBQUFBLFFBQzFDO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1Asb0JBQW9CO0FBQUEsTUFDbEIsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLElBQ0Q7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU0sVUFBVSxNQUFNLElBQUk7QUFDeEIsWUFBSSxDQUFDLGVBQWUsS0FBSyxFQUFFLEdBQUc7QUFDNUIsaUJBQU87QUFBQSxRQUNUO0FBSUEsZUFBTyxxQkFBcUIsTUFBTSxJQUFJO0FBQUEsVUFDcEMsUUFBUTtBQUFBLFVBQ1IsS0FBSztBQUFBLFFBQ1AsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osT0FBTztBQUFBLElBQ1AsZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixjQUFjLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3ZELFdBQVcsQ0FBQyx3QkFBd0IsbUJBQW1CO0FBQUEsVUFDdkQsT0FBTyxDQUFDLFNBQVMsV0FBVyxRQUFRO0FBQUEsVUFDcEMsb0JBQW9CO0FBQUEsWUFDbEI7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBLFVBQ0EsTUFBTTtBQUFBLFlBQ0o7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
