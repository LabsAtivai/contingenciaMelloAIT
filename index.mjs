// const cron = require("node-cron");

import cron from "node-cron";
import campanhas from "./relatoriocampanha1.mjs";

import contas from "./contas2.mjs";

import disparos from "./disparos4.mjs";

import ativos from "./ativosrestantes5.mjs";

import negativacao from "./negativacao";
cron.schedule("* * * * *", () => {
    console.log("Estamos ativos");
});

cron.schedule("00 16 * * *", () => {
    campanhas();
});

cron.schedule("30 17 * * *", () => {
    contas();
});

cron.schedule("30 20 * * *", () => {
    disparos();
});

cron.schedule("59 23 * * *", () => {
    ativos();
});


cron.schedule("0 17 * * *", () => {

    negativacao();
});