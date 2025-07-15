
import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import { google } from 'googleapis';


function formatCookies(cookies) {
  return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
}


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

async function readClientDataFromSheet(auth) {
  console.log('Entrando em readClientDataFromSheet...');
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1u4rMoTUQz0w_g92xmV8_pjtVc8JtKLLH7v090V5lq40';
  const range = 'contas';

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;


    if (!rows.length) {
      console.log('No data found.');
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
          password: row[5]
        });
      }
    });

    console.log("Clientes extraídos:", clients.length);

    return clients;

  } catch (error) {
    console.error('Erro ao ler dados do Google Sheets:', error);
    throw error;
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function getCookiesFromCode2(client) {
  const browser = await puppeteer.launch({
       headless: false,
       executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
     });
  const page = await browser.newPage();

  const existingCookies = await page.cookies();
  await page.deleteCookie(...existingCookies);
  try {
    await Promise.race([
      page.goto('https://app.snov.io/login', { waitUntil: 'domcontentloaded', timeout: 30000 }),
      timeout(30000)
    ]);


    //await page.waitForSelector('#CybotCookiebotDialogPoweredbyImage'); // Esperar pelo botão de aceitar cookies
    //await page.click('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'); // Clicar no botão de aceitar cookies

    // await delay(1000); 

    await page.waitForSelector('#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(1) > input');
    await page.type('#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(1) > input', String(client.emailSnovio));

    await page.waitForSelector('#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(2) > input');
    await page.type('#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(2) > input', String(client.password));

    await page.click('#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > button');
    await page.waitForNavigation({ timeout: 60000 });
    
    await sleep(6000);



    const cookies = {};

    await Promise.race([
      page.goto('https://app.snov.io/pipelines/api/statistics/campaign-recipients', { waitUntil: 'domcontentloaded', timeout: 30000 }),
      timeout(30000)
    ]);


    const campaignCookiesList = await page.cookies();
    cookies.campaignCookies = campaignCookiesList;
    await browser.close();

    return {
      campaignCookies: campaignCookiesList,
    };

  } catch (error) {
    await browser.close();
    if (error.message.includes("Timed out after")) {
      console.warn("Timeout ao tentar login. Vamos tentar outro cliente.");
      return null;
    }
    console.error('Erro ao pegar cookies: ', error);
    throw error;
  }
}
// Função para criar um atraso em milissegundos
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


async function getAccessToken(clientId, clientSecret) {
  try {
    const response = await axios.post('https://api.snov.io/v1/oauth/access_token', {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      console.error('Erro ao obter o token de acesso:', response.data);
      throw new Error('Não foi possível obter o token de acesso');
    }

  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error);
    throw error;
  }
}

async function getCampaignData(sheets, email) {
  try {
    const spreadsheetId = '1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY';
    const range = 'campanhas';
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

    const campaignData = response.data.values
      .filter(row => row[1] == email)
      .map(row => ({
        id: row[2],
        name: row[3]
      }));

    return campaignData;
  } catch (error) {
    console.error('Erro ao obter os dados das campanhas:', error);
    throw error;
  }
}



async function addToGoogleSheets(auth, client, response, campaignInfo, sheets) {
  try {
    const spreadsheetId = '1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY';
    const range = 'dashsnov';

    const today = new Date();
    const dateWithoutTime = today.toISOString().split('T')[0];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [
          [campaignInfo.name, dateWithoutTime, client.email, response.data.total, response.data.totalAll, campaignInfo.id],
        ],
      },
    });

    console.log('Dados adicionados com sucesso ao Google Sheets');
  } catch (error) {
    console.error('Erro ao adicionar dados ao Google Sheets:', error);
  }
}

async function main() {
  const auth = await google.auth.getClient({
    credentials: credentials,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const clients = await readClientDataFromSheet(auth);
  const sheets = google.sheets({ version: 'v4', auth });
  let clientsWithTimeout = [];

  const MAX_TRIES = 1;

  for (const client of clients) {
    let tries = 0;
    let success = false;
    

    while (tries < MAX_TRIES && !success) {
      try {
        const campaignData = await getCampaignData(sheets, client.email);
        const accessToken = await getAccessToken(client.clientId, client.clientSecret);
        let cookies = await getCookiesFromCode2(client);

        if (!cookies || !cookies.campaignCookies) {
          throw new Error(`Cookies não foram obtidos para o cliente ${client.email}`);
        }

        const formattedCampaignCookies = formatCookies(cookies.campaignCookies);

        for (const campaign of campaignData) {
          try {
            console.log('ID da campanha a ser processado:', campaign.id);

            const response = await axios.post('https://app.snov.io/pipelines/api/statistics/campaign-recipients', {
              filter: {
                contacted: "0"
              },
              status: "active",
              perPage: 10,
              page: 1,
              campaignId: campaign.id,
              emailAccountIds: []
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Cookie': formattedCampaignCookies,
                'Accept': 'application/json, text/plain, */*',
                'Sec-Fetch-Mode': 'cors',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
              }
            });

            if (response.status === 200) {
              console.log('Dados obtidos com sucesso:', response.data);
              await addToGoogleSheets(auth, client, response, campaign, sheets);
              success = true;
            } else {
              console.error('Erro: A resposta retornou um status:', response.status);
              console.error('Dados da Resposta:', response.data);

              tries++;
            }
          } catch (error) {
            console.error('Erro durante a solicitação POST:', error);
            console.error('Detalhes da Resposta:', error.response.data);
            console.warn(`Erro ao processar a campanha ${campaign.id} do cliente ${client.email}.`);
            tries++;
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          console.error('Erro interno no servidor Snov.io. Verifique se os dados de entrada estão corretos.');
        } else {
          console.error('Erro ao obter os dados das campanhas:', error);
        }
        console.warn(`Erro ao processar o cliente ${client.email}. Tentativa ${tries + 1} de ${MAX_TRIES}.`);
        tries++;
      }
      await sleep(60000);
    }

    if (!success) {
      console.error(`Falha ao recuperar os dados do cliente ${client.email} após ${MAX_TRIES} tentativas.`);
      clientsWithTimeout.push(client);
    }
  
  }

  for (const client of clientsWithTimeout) {
    try {
      let cookies = await getCookiesFromCode2(client);
      if (cookies === null) {
        console.error(`Erro ao tentar novamente com o cliente ${client.email}. Timeout após duas tentativas.`);
        continue;
      }
      const formattedCampaignCookies = formatCookies(cookies.campaignCookies);
      const campaignData = await getCampaignData(sheets, client.email);
      const accessToken = await getAccessToken(client.clientId, client.clientSecret);

      for (const campaign of campaignData) {
        const response = await axios.post('https://app.snov.io/pipelines/api/statistics/campaign-recipients', {
          filter: {
            sent: "0"
          },
          status: "active",
          perPage: 10,
          page: 1,
          campaignId: campaign.id,
          emailAccountIds: []
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Cookie': formattedCampaignCookies,
            'Accept': 'application/json, text/plain, */*',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.status === 200) {
          console.log('Dados obtidos com sucesso:', response.data);
          await addToGoogleSheets(auth, client, response, campaign, sheets);

        } else {
          console.error('Erro: A resposta retornou um status:', response.status);
          console.error('Dados da Resposta:', response.data);
          fs.writeFileSync('response.html', response.data);
        }
      }
    } catch (error) {
      console.warn(`Erro ao processar novamente o cliente ${client.email} durante a retentativa. Continuando para o próximo cliente.`);
    }
  }
}

// main();

export default main;
