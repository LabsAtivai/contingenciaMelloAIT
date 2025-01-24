const puppeteer = require("puppeteer");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const { timeout } = require("puppeteer");
const { error, debug } = require("console");
const fs = require("fs");

const credentials = {
  type: "service_account",
  project_id: "negativa-422813",
  private_key_id: "5cce99cf8530253c1820ccb3c6223ac7dbd89a78",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKT0FbFTOqanVu\n6aXKmrZlfT3TSKfY/sF4VDbuppda0PJtDRQJXrexMVE0D4ln718DN3ZKEoTJ88jQ\nAzHhVPzXpSt08ytgCRvPx8sdo5mmiUk51AZICf37ZbSzeKBPWIhzUlwY/G7rMrpI\noeOXRmD8OFOKbDQhg/RijsXl1a6OGYI4fpnFZ5WEbBPrQwXtbVedqNiitdpXibqY\nsH00xSZmBRCjhxHYhky7a1q2ZmjMol+BrGKgnIKqoKmB6AlxdXyiD6EKDN++heDk\nV/+58KWwcr8FfFEvZZcd1uLt3WSF+lMM3PmpfQJHzaBd3EtDTLdfxG4siFmAhX0s\nOIDfudHrAgMBAAECggEAG0/Sy2iT1oRTwTrywmTbjdz4DT+IRV+zH7sCxXohAcYm\njDlRRKiQVPAK/ePBEZJ7ubPxmLNiUN9D820S/VAbaENol/vCFc90/TqEPcaZ1iU/\niPqKNIyAyMEkwXvd7IhPt33daBQgJ0lsY6TTVFdQfYxfHtdXvFSTmACdT9dmntEu\nN0w/1pFdGgHNMNGtH7Jg8iAcm+wgEbTkJxaUHJxVN4Ypeaju2ZXivzTlschh1WPT\nZeggnXAw3as1pRc+7lDS4KWvKAHokMfi+GwO42nXbWRP5oqNnaI4GiWabwXBfgQv\nc9T3802fCBcw/tLY6WgLEPb2tmSkUgELTGzHjt6CvQKBgQDx3FC3TSKkUprMb+NQ\n0Cp+xX5DiiLPmAFXoOAbOFT0iZykmJQUrCN2yjao4UEk9h5NHONO6airx5ElUphr\no6Dgy4VabMTz7fanLO+70LRYqN8WhB1vlJOdwx5IQdp3iFIoNXcEEfZcklzIhgiH\nsjZLLfs2QVYuls9+VDMf/dq9lwKBgQDWIwUKEoAB7DBaX3D0SFDgUuuVsCvNmXhj\nx17dtJwBxo0cfeyJRlkiCbHl6O9IrTiwRPEqWqu5qryqyh1tssEz0YwPnk5mgcWH\nVuFVattCKGkou90Pom9Qc6gqu/pYnsKkvi8XR01nm9O9Uu8+v78C+R3Rhds2bLs1\nnkAlNvAAzQKBgQCR1OHmZGAq7JPiCOTraVj2L2a+mp/6xBCrIZl/UCwJdqA4rrc6\n78BCdBMZKRj6jFwg6vY0Mrc9PIvMEU1OOc9bO9wgdc0bt7QtgO7cNC9J9ijtjqOh\nD9kiGvA7aVmtEUlYbURh8+K0VpwTXJ3wFAigtAzw3dx1IwHhjit1cr9d6QKBgQCo\nWo4KtjLH0C7PznuawwQ66VZosEIv+bnqEIQoIGgLCVRGE0aVQqavGRoxXKpL5ExO\nYVWN7A1ZAsAkMpVieohlOhk46khPVTW8SvUL1+AcKnNK4DBTq2yCvvt25aVUaTU0\nmoWhcqCLlbqp/Xs1RUFikAL+iJOpPWEOLaXW3FNi/QKBgHtnCMWlnfwGrNwuOMZY\nkunYpb62endObPq4SkNonn1j5Oa3tU0sJcHTMHhTspoaF+slAoD3fa0sE+oc5UC8\ncz5Y11YYU4Q54YzVHKxu0yMsJGfCJMBDVVCF76zmO+5O5ePlT6P1nVnREKNecBIW\nxn0hSkSr6Mu5eUyhjdp8LlKz\n-----END PRIVATE KEY-----\n",
  client_email: "negativacao@negativa-422813.iam.gserviceaccount.com",
  client_id: "102935698069952013491",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/negativacao%40negativa-422813.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

async function getGmailAccessToken(
  clientId,
  clientSecret,
  refreshToken,
  userEmail
) {
  const payload = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };
  const params = new URLSearchParams(payload);
  const tokenUrl =
    "https://accounts.google.com/o/oauth2/token?" + params.toString();

  try {
    const response = await axios.post(
      tokenUrl,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      console.error(
        `Failed to refresh Gmail access token for user: ${userEmail}`
      );
      return null;
    }
  } catch (error) {
    console.error(
      `Failed to refresh Gmail access token for user: ${userEmail}`
    );
    return null;
  }
}

async function loadUsersFromSpreadsheet(spreadsheetId) {
  const auth = await google.auth.getClient({
    credentials: credentials,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = "Todos5.0";
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
    const users = [];
    for (const data of rows) {
      try {
        const clientId = data[2];
        const clientSecret = data[3];
        const refreshToken = data[1];
        const userEmail = data[0];
        if (clientId) {
          const gmailToken = await getGmailAccessToken(
            clientId,
            clientSecret,
            refreshToken,
            userEmail
          );
          users.push({
            USER_ID: userEmail,
            GMAIL_TOKEN: gmailToken,
            CLIENT_ID: clientId,
            CLIENT_SECRET: clientSecret,
            LIST_ID: data[6],
            SNOVIO_EMAIL: data[8],
            SNOVIO_PASS: data[9],
            FOLDER_ID: data[7],
          });
        }
      } catch (error) {
        console.error(`Error processing row for user ${data[0]}: ${error}`);
      }
    }
    return users;
  } catch (error) {
    console.error("Error loading users from spreadsheet:", error);
    return [];
  }
}

async function fetchAndNegateEmails() {
  const spreadsheetId = "1d6SL3vBavlh4flFvnI-PweHrd3AJe9PMHh50PshkR8c";
  const users = await loadUsersFromSpreadsheet(spreadsheetId);

  const usersHasError = [];
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 1000);
  const startTimestamp = Math.floor(threeDaysAgo.getTime() / 1000);
  const endTimestamp = Math.floor(new Date().getTime() / 1000);

  for (const user of users) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    try {
      await processUser(user, startTimestamp, endTimestamp, page);
    } catch (error) {
      usersHasError.push({ user, error });
      console.error(`Error processing user ${user.USER_ID}:`, error);
    } finally {
      await page.close();
      await browser.close();
    }

    // Após finalizar o loop ou processamento dos usuários
    if (usersHasError.length) {
      console.warn("---------------------------------------------------------");
      console.warn("Usuários com erros: ");
      usersHasError.map((x) => {
        console.warn(`${x.user.USER_ID}:`, x.error);
      });
      console.warn("---------------------------------------------------------");

      // Escrevendo os erros no arquivo erro.txt
      const errorMessages = usersHasError
        .map((x) => `User ID: ${x.user.USER_ID}\nError: ${x.error}\n\n`)
        .join("");

      fs.writeFileSync("erro.txt", errorMessages, "utf8");
      console.log("Os erros foram salvos em erro.txt");
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processUser(user, startTimestamp, endTimestamp, page) {
  if (!user.GMAIL_TOKEN) {
    console.log("Missing GMAIL_TOKEN for user:", user.USER_ID);
    throw new Error(`Missing GMAIL_TOKEN for user: ${user.USER_ID}`);
    return;
  }
  const url = `https://gmail.googleapis.com/gmail/v1/users/${user.USER_ID}/messages?q=after:${startTimestamp}&before:${endTimestamp}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.GMAIL_TOKEN}`,
        Accept: "application/json",
      },
    });
    const data = response.data;

    if (data.messages && Array.isArray(data.messages)) {
      const emailList = [];

      for (const message of data.messages) {
        const messageId = message.id;
        const messageUrl = `https://gmail.googleapis.com/gmail/v1/users/${user.USER_ID}/messages/${messageId}`;
        try {
          const messageResponse = await axios.get(messageUrl, {
            headers: {
              Authorization: `Bearer ${user.GMAIL_TOKEN}`,
              Accept: "application/json",
            },
          });
          const messageData = messageResponse.data;
          const headers = messageData.payload.headers;
          headers.forEach(function (header) {
            if (header.name === "From") {
              const email = header.value.match(
                /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
              )[0];
              emailList.push(email);
            }
          });
        } catch (messageError) {
          console.error(
            `Error fetching individual message for user ${user.USER_ID}:`,
            messageError
          );
        }
      }

      const uniqueEmailList = [...new Set(emailList)];
      const existingCookies = await page.cookies();
      await page.deleteCookie(...existingCookies);

      try {
        await page.goto("https://app.snov.io/login", {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        });
        await page.waitForSelector(
          "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(1) > input"
        );
        await page.type(
          "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(1) > input",
          String(user.SNOVIO_EMAIL)
        );

        await page.waitForSelector(
          "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(2) > input"
        );
        await page.type(
          "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > div:nth-child(2) > input",
          String(user.SNOVIO_PASS)
        );

        await page.click(
          "#app > div > div > div > div.auth-wrapper__right > div.auth-wrapper__right-content > div > div > div.form-wrapper > form > button"
        );
        await page.waitForNavigation({
          waitUntil: "networkidle2",
          timeout: 120000,
        });
        try {
          await page.goto(
            `https://app.snov.io/account/do-not-email-list/${user.LIST_ID}`,
            {
              waitUntil: "domcontentloaded",
              timeout: 120000, // Aumente o tempo para 120 segundos.
            }
          );
        } catch (err) {
          console.error(
            "Erro ao navegar para a página de listas: Tentando novamente..."
          );
          await sleep(10000); // Aguarda 10 segundos e tenta novamente.
          await page.goto(
            `https://app.snov.io/account/do-not-email-list/${user.LIST_ID}`,
            {
              waitUntil: "networkidle2",
              timeout: 120000,
            }
          );
        }

        await sleep(20000);
        await page.waitForSelector(
          "#app > div > main > div.account.account--accountDnelInfo > section > div.di__top > div.di__import > div > div.dii__content > div > textarea",
          { timeout: 60000 }  // Aumenta o tempo de espera para 60 segundos.
        );
        
        

        await page.type(
          "#app > div > main > div.account.account--accountDnelInfo > section > div.di__top > div.di__import > div > div.dii__content > div > textarea",
          String(uniqueEmailList.join(",")),
          { delay: 1 }
        );
        

        await sleep(20000);
        await page.click(
          "#app > div > main > div.account.account--accountDnelInfo > section > div.di__top > div.di__import > div > div.dii__content > div > div > button"
        );
        await page.waitForNavigation({ timeout: 30000 });
      } catch (err) {
        console.error("Error during Snov.io operation:", err);
      }
    } else {
      console.error(
        "No messages found in Gmail API response for user:",
        user.USER_ID
      );
    }
  } catch (error) {
    console.error(`Error fetching messages for user ${user.USER_ID}:`, error);
    throw error;
  }
}


export default fetchAndNegateEmails;