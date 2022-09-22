import { createApp } from "vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "dayjs/locale/zh-cn";
import locale from "element-plus/lib/locale/lang/zh-cn";
import "./assets/global.css"
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElementPlus, { locale });
app.mount("#app");
