import axios from "axios";
import { google } from "googleapis";

// Credenciais da conta de serviço
const credentials = {
  type: "service_account",
  project_id: "relatoriolistas",
  private_key_id: "e25ed131b297c4f1b9a88c500a6a92562ba9cab2",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpllxFoFzUmvIY\ncIx9QwYTQnSl68bJBy255ZU4Hd/tMJNlb7HDeACyp8X0V4ou2+bBczb1RZqEPtyi\n4kaKzPpz3e10mZfMBFIi37HtEi7IGi+IfrkUkVAXPKO68zT0nN63nGboErd91Dn4\nRvRgYxz0XDf1T74u7McGHjfhcsy5nu58SuHLhyxWZxlUlrdFSmSszdzKw1CKO8AZ\nq3HYId7iclyhmrZo360NDrPOVjDTy0Lb01K6dVw8TErVDgrxGwqMy/HXPmSZI+Tm\nX58oglkob/Iri3h7UODIxcR1MQ0IolRmkmvWw/RDL7MnnEpqTuV/FP7UTOWLSNun\n+7CUtBJpAgMBAAECggEAFBZG4WniWP3t41Jwd5VQ4sbeN3l3CyBuLHzauQID4C2+\n5bbOStl71q1762pTiCOcoGkP10s6Z0PlYSc1ZRMsrrz4l3UqZ1xTKMWPhwW+dA3y\n96NP85VXM9tnRtlwGjG7CStNvpsZ8B3rTGLGJyUSPMjwCV7bx2XdGJbLdmkhQfKV\nfHzlZPHTKSn37K9G9j1QvVTYqGvw020BzGgyfr5KoQcSsEFEE+Mu9p3HAwdSdty+\n8w56/NsDzan/D89zXEUlWhMEh8t0oTNXGrSWB7XiCHDXKVRYham+HE6kkVNL9qNj\neIWP+bMIjYt1p3N6DTzJwK1rJHFlyzzr4/+dMCxYcQKBgQDcHtwhHIWYDlnhkCxt\nLKRJ9oI7H7jjz+VglMx7S1KvxarIe+ue3RgRnntHV6aHaMPs8U5M2ria2pkscHDs\ny1QsoxGBerZ3gCB8LLlY6sT69iVUI+byVykgUDL/I6LRxw7TTBsNPesff+DCSdaL\nzU+ZNctUxkTq/2KBE8z4JBMj2QKBgQDFOtzVtFZcBC1zkZroRvuX+NsMGgS7XIGw\n92r8JFDMSjrPmc6XjR+Lk2vj+/ZIDAf7FECMv805EkLQs7RALaI9e03P+f3W21YR\nZpDxHi+uFaMmIG0BYbi6lBw7yne1wMEp4uiiZ5fgLM92y4oLi42Cj9TZDtNRCEeN\nxsrCr9KZEQKBgQCWA5ISHtYNIvqudwtP/DSbE5z9nkjrOSwh/ka9YEAh+pzBtXKG\n+jcFCvUJUfr0HbopKOssBYP6RTBO0PKk7o2XPisYCwF/v5pkBjbrGlTUlBwsk6s5\nTZ2BoCahKzAzt22rIxrsk15CQWxz/M5yyKGO0NKaG+WsIhCH127BThSdQQKBgCbD\nv/3c2RBy3cAWQT0gHnkrN1p0jrOIphDzQDrYpGzStiZxk5Jj8WxMiGsh7bERdEwc\nGefQFvT9qtY8S9RFY9rzrkKPXx3otEztPNW3WiW8KPnoa6RW4akCTV5PGCJIBW9H\nIvQwqkAsboZp0PMd9a1QucQDzvLhTrcF+Ho1do4RAoGAU5N2Lc9Ur3HYycoSZDGQ\nQ8i7dz549gYTOCeIRyxOKwaZe04yTHax6lrwWxThpSj9keP8d8Jjvu5gqtup9EAb\nTZgSKyoqmx3V02y4/+9FDxavoHVf/wVHMAzckQMcPAIkUkpsWOLNOI7pmetGaZEG\ng4P2NhbZYJNl7+QTbSfxQzU=\n-----END PRIVATE KEY-----\n",
  client_email: "ativarelatorio@relatoriolistas.iam.gserviceaccount.com",
  client_id: "101717739329184491985",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/ativarelatorio%40relatoriolistas.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Função para ler dados dos clientes da planilha "contas"
async function readClientDataFromSheet(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1u4rMoTUQz0w_g92xmV8_pjtVc8JtKLLH7v090V5lq40";
  const range = "contas";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows.length) {
      console.log("No data found.");
      return [];
    }

    const clients = [];
    rows.forEach((row, index) => {
      if (index !== 0 && row[0] === "TRUE") {
        clients.push({
          email: row[1],
          clientId: row[2],
          clientSecret: row[3],
          emailSnovio: row[4],
          senha: row[5],
        });
      }
    });

    console.log("Clientes extraídos:", clients.length);
    return clients;
  } catch (error) {
    console.error("Erro ao ler dados do Google Sheets:", error);
    throw error;
  }
}

// Função para obter o token de acesso
async function getAccessToken(clientId, clientSecret) {
  try {
    const response = await axios.post(
      "https://api.snov.io/v1/oauth/access_token",
      {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao obter o token de acesso:", error);
    throw error;
  }
}

  


// Função para obter dados das campanhas da planilha "campanhas"
async function getCampaignData(sheets, email) {
  try {

    const spreadsheetId = "1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY";
    const range = "campanhas";
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

    const campaignData = response.data.values
      .filter((row) => row[1] == email)
      .map((row) => ({
        id: row[2],
        name: row[3],
      }));

    return campaignData;
  } catch (error) {
    console.error("Erro ao obter os dados das campanhas:", error);
    throw error;
  }
}

async function getCampaignProgress(accessToken, campaignId) {
  try {
    const response = await axios.get(
      `https://api.snov.io/v2/campaigns/${campaignId}/progress`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
      console.log(response.data)
    return response.data
  } catch (error) {
    console.error(
      "Erro ao buscar progresso da campanha:",
      error.response?.data || error.message
    );
    throw error;
  }
}
// Função para adicionar campaignName, campaignID, unfinished e clientEmail às colunas A, B, C e D
async function appendToGoogleSheets(sheets, client, campaign, unfinished) {
  try {
    const spreadsheetId = "1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY";
    const sheetName = "unfinished";

    // Obter a última linha preenchida na coluna A
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`,
    });

    const nextRow = getRows.data.values ? getRows.data.values.length + 1 : 1;
    

    // Adicionar campaignName na coluna A, campaignID na coluna B, unfinished na coluna C e clientEmail na coluna D
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${nextRow}:D${nextRow}`,
      valueInputOption: "RAW",
      resource: {
        values: [[campaign.id, campaign.name,  unfinished, client.email]],
      },
    });

    console.log(`✅  campaignID ${campaign.id}, campaignName ${campaign.name}, unfinished ${unfinished}, clientEmail ${client.email} adicionados na linha ${nextRow}`);
  } catch (error) {
    console.error("Erro ao adicionar dados ao Google Sheets:", error);
  }
}

// Função para pausar a execução
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


  


// Função principal
async function main() {
    try {
      const auth = await google.auth.getClient({
        credentials,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
  
      const sheets = google.sheets({ version: "v4", auth });
      const clients = await readClientDataFromSheet(auth);
      const usersHasError = [];
  
      const batchSize = 59;
        
      for (let i = 0; i < clients.length; i += batchSize) {
        const batch = clients.slice(i, i + batchSize);
        console.log(`Processando lote de ${batch.length} clientes...`);
        //jogar para o kafka, 
        for (const client of batch) {
          try {
            const accessToken = await getAccessToken(client.clientId, client.clientSecret);
            const campaignData = await getCampaignData(sheets, client.email);
  
        
            for (const campaign of campaignData) {
              try {
                const progress = await getCampaignProgress(accessToken, campaign.id);
                const unfinished = progress.unfinished || 0;
  
               
                await appendToGoogleSheets(sheets, client, campaign, unfinished);

  
              } catch (error) {
                console.error(`Erro ao processar campanha ${campaign.id} do cliente ${client.email}:`, error);
              }
            }
          } catch (error) {
            usersHasError.push(client);
            console.error("Erro na execução para cliente:", client.email, error);
          }//fim da fila, erro = fim da fila
        }
  
        if (i + batchSize < clients.length) {
          console.log("Aguardando antes de processar o próximo lote...");
          await sleep(60000);
        }
      }
  
      if (usersHasError.length) {
        console.warn("---------------------------------------------------------");
        console.warn("Usuários com erros:");
        usersHasError.forEach((client) => {
          console.warn(`${client.emailSnovio}`);
        });
        console.warn("---------------------------------------------------------");
      }
    } catch (error) {
      console.error("Erro na execução principal:", error);
    }
  }
  
  

// Executar a função principal
 //main();

 export default main;
