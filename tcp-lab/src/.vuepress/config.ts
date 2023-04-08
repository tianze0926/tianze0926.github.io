import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/tcp-lab/",
  lang: "zh-CN",
  title: "TCP 实验报告",
  description: "TCP 实验报告",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
