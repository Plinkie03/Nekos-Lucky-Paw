import { argv } from "process";
import { NekoResources } from "../core/NekoResources.js";
NekoResources.init().then(() => import(`./${argv.slice(2).join("_")}.js`));
