import puppeteer from "puppeteer";
import axios from "axios";
import { google } from "googleapis";
import pLimit from "p-limit";

// Função para formatar cookies
function formatCookies(cookies) {
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

// Configurações do Google Sheets
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
  auth_provider_x509_cert_url: "https://www.googleapis.com/v1/certs",
};

// Função para obter dados de clientes do Google Sheets
async function readClientDataFromSheet(auth) {
  console.log("Lendo dados de clientes do Google Sheets...");
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1u4rMoTUQz0w_g92xmV8_pjtVc8JtKLLH7v090V5lq40";
  const range = "contas";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values || [];

    return rows
      .slice(1) // Ignorar cabeçalho
      .filter((row) => row[0] === "TRUE") // Filtrar clientes ativos
      .map((row) => ({
        email: row[1],
        clientId: row[2],
        clientSecret: row[3],
        emailSnovio: row[4],
        password: row[5],
      }));
  } catch (error) {
    console.error("Erro ao acessar dados do Google Sheets:", error.message);
    throw error;
  }
}

// Função para obter dados de campanhas do Google Sheets
async function readCampaignIdsFromSheet(auth) {
  console.log("Lendo IDs de campanhas do Google Sheets...");
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY";
  const range = "campanhas";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values || [];

    return rows.slice(1).map((row) => ({
      email: row[1],
      campaignId: row[2],
    }));
  } catch (error) {
    console.error("Erro ao obter IDs das campanhas:", error.message);
    throw error;
  }
}

async function getUserIdFromCampaign(client, campaignIds) {
  console.log(
    `Obtendo UserID para o cliente: ${
      client.emailSnovio
    }, Campanha: ${campaignIds.join(", ")}`
  );
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto("https://app.snov.io/login", {
      waitUntil: "domcontentloaded",
    });

    // Aguarda o carregamento do campo de entrada do e-mail
    await page.waitForSelector(
      "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(1) > input",
      { timeout: 20000 }
    );

    // Preenche o e-mail
    await page.type(
      "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(1) > input",
      client.emailSnovio
    );

    // Aguarda o carregamento do campo de entrada da senha
    await page.waitForSelector(
      "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(2) > input",
      { timeout: 20000 }
    );

    // Preenche a senha
    await page.type(
      "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(2) > input",
      client.password
    );

    // Clica no botão de login
    await page.click(
      "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > button"
    );

    // Aguarda a navegação após o login
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const emailsUser = [];

    for (const campaignId of campaignIds) {
      // Navega para a página de opções da campanha
      await page.goto(`https://app.snov.io/campaigns/${campaignId}/options`);

      // Aguarda o carregamento do seletor
      await page.waitForSelector("a[href*='/email-account/']", {
        timeout: 30000,
      });

      // Captura o UserID do href
      const href = await page.$eval(
        "a[href*='/email-account/']",
        (link) => link.href
      );
      const userId = href.split("/email-account/")[1];

      // Captura o texto do seletor (email)
      const email = await page.$eval("a[href*='/email-account/']", (element) =>
        element.textContent.trim()
      );
      console.log(`UserID encontrado: ${userId}, Email encontrado: ${email}`);
      emailsUser.push({ userId, email });
    }

    try {
      await browser.close();
    } catch (error) {}

    return emailsUser;
  } catch (error) {
    await browser.close();
    console.error("Erro ao obter UserID e Email:", error.message);
    throw error;
  }
}

// Função para adicionar dados ao Google Sheets
async function addToGoogleSheets(auth, users, campaignIds) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY";
  const range = "usuario";

  const px = [];
  users.map((x) => {
    campaignIds.map((y) => {
      px.push([x.userId, x.email, y]);
    });
  });
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: px,
      },
    });

    // console.log(
    //   `Dados adicionados ao Google Sheets: ${userId} | ${email} | ${campaignId}`
    // );
  } catch (error) {
    console.error("Erro ao adicionar dados ao Google Sheets:", error.message);
    throw error;
  }
}

// Processar campanhas de um cliente
async function processCampaignsForClient(auth, client, campaigns) {
  const clientCampaigns = campaigns.filter(
    (campaign) => campaign.email === client.email
  );

  try {
    const usersEmails = await getUserIdFromCampaign(client, clientCampaigns);

    usersEmails.map(async (x) => {
      clientCampaigns.map(async (campaign) => {
        try {
          await addToGoogleSheets(auth, x.userId, x.email, campaign.campaignId);
        } catch (error) {
          console.error(
            `Erro ao processar campanha ${campaign.campaignId} para cliente ${client.email}: ${error.message}`
          );
        }
      });
    });
  } catch (error) {
    debugger;
    if (error.response.status == 429) {
      await sleep(10000);
      const usersEmails = await getUserIdFromCampaign(client, clientCampaigns);

      usersEmails.map(async (x) => {
        clientCampaigns.map(async (campaign) => {
          try {
            await addToGoogleSheets(
              auth,
              x.userId,
              x.email,
              campaign.campaignId
            );
          } catch (error) {
            console.error(
              `Erro ao processar campanha ${campaign.campaignId} para cliente ${client.email}: ${error.message}`
            );
          }
        });
      });
    }
    console.error(
      `Erro ao processar campanha ${campaign.campaignId} para cliente ${client.email}: ${error.message}`
    );
  }
  const campaignPromises = clientCampaigns.map(async (campaign) => {});

  await Promise.all(campaignPromises); // Executa todas as campanhas simultaneamente
}

// Função principal
async function main() {
  console.log("Iniciando o script...");
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const clients = await readClientDataFromSheet(auth);
  const campaigns = await readCampaignIdsFromSheet(auth);

  for (const client of clients) {
    console.log(`Processando cliente: ${client.emailSnovio}`);

    // Filtra as campanhas associadas ao cliente atual
    const clientCampaigns = campaigns.filter((c) => c.email === client.email);
    try {
      // Obtem UserID e Email para a campanha
      const usersEmails = await getUserIdFromCampaign(
        client,
        clientCampaigns.map((campaign) => campaign.campaignId)
      );
      await addToGoogleSheets(
        auth,
        usersEmails,
        clientCampaigns.map((x) => x.campaignId)
      );

      console.log(
        `Cliente ${
          client.emailSnovio
        } processado com sucesso para a campanha ${clientCampaigns
          .map((x) => x.campaignId)
          .join(", ")}`
      );
    } catch (error) {
      console.error(
        `Erro ao processar campanha ${clientCampaigns
          .map((x) => x.campaignId)
          .join(", ")} para cliente ${client.emailSnovio}: ${error.message}`
      );
    }
  }

  console.log("Script concluído com sucesso!");
}

main().catch((error) => {
  console.error("Erro na execução principal:", error.message);
});
