
import campanhas from "./relatoriocampanha1.mjs"
import disparos from "./disparos4.mjs";
import ativos from "./relatorioListasv2.mjs";
import cron from "node-cron";

// Marca o início do tempo de execução
const startTime = Date.now();

// Função para calcular e exibir o tempo de execução
function logExecutionTime() {
  const endTime = Date.now();
  const timeElapsed = endTime - startTime;

  const seconds = Math.floor((timeElapsed / 1000) % 60);
  const minutes = Math.floor((timeElapsed / (1000 * 60)) % 60);
  const hours = Math.floor((timeElapsed / (1000 * 60 * 60)) % 24);

  console.log(`Tempo de execução total: ${hours}h ${minutes}m ${seconds}s`);
}

// Executa as funções em sequência e exibe o tempo de execução total ao final
 campanhas().then(() => {
     ativos().then(() => {
      disparos().then(() => {
        console.log("Finalizou");
        logExecutionTime(); // Loga o tempo total de execução aqui
      });
    });
    });
 
    

// Opcional: Configuração do cron para execução automática (se necessário)

