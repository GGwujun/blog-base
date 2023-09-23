// Config for dumi
import { defineConfig } from "dumi";
import { getBookNavs } from "../scripts/navs";

const isDev = process.env.NODE_ENV === "development";
const isVercel = process.env.IS_VERCEL;

export default defineConfig({
  ...(isDev
    ? {
        dynamicImport: {},
      }
    : {
        ssr: {},
      }),

  logo: "/logo.png",
  base: isVercel ? "/" : "/blog-base",
  publicPath: isVercel ? "/" : "/blog-base/",
  favicon: "/logo.png",
  mode: "site",
  title: "大师兄",
  locales: [["zh-CN", "中文"]],
  resolve: {
    includes: ["./src", "./ssrc"],
    previewLangs: [],
  },
  navs: [...getBookNavs(process.env.PAGE)],
  polyfill: false,
  nodeModulesTransform: {
    type: "none",
  },
  outputPath: "docs",
  exportStatic: {},
  analytics: isDev
    ? false
    : {
        ga: "UA-149864185-1",
      },
});
