import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// 打开source map
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    // 把source map单独打包成一个文件，出错了会单独请求此文件
    sourcemapPathTransform: (relativeSourcePath) => {
      return `/${relativeSourcePath}`;
    }
  },
});
