import { Injectable } from '@angular/core';

declare const gapi: any;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  private tokenClient: any;

  constructor() { }

  /** Load Gmail API client */
  initClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            apiKey: 'AIzaSyDcZEOcaqvnLrQGWoyybA_80dvWxCFbQZE',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"]
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /** Initialize GIS token client */
  initGisClient() {
    if (!this.tokenClient) {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '765449572814-mt8uc9mnjha1s116072rllfvj2joa1vi.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/gmail.send',
        callback: (tokenResponse: any) => {
          console.log("Access token:", tokenResponse.access_token);
          gapi.client.setToken({ access_token: tokenResponse.access_token });
        },
      });
    }
  }

  /** Request login and wait for access token */
  signIn(): Promise<void> {
    return new Promise((resolve) => {
      this.initGisClient();

      // Override callback to resolve the promise when token is ready
      this.tokenClient.callback = (tokenResponse: any) => {
        console.log("Access token:", tokenResponse.access_token);
        gapi.client.setToken({ access_token: tokenResponse.access_token });
        resolve(); // ✅ Resolve only after token is ready
      };

      this.tokenClient.requestAccessToken();
    });
  }

  /** Send a simple email */
  sendEmail(to: string, subject: string, body: string) {
    const rawMessage = btoa(
      `To: ${to}
Subject: ${subject}
Content-Type: text/plain; charset=UTF-8

${body}`
    ).replace(/\+/g, '-').replace(/\//g, '_');

    return (gapi.client as any).gmail.users.messages.send({
      userId: 'me',
      resource: { raw: rawMessage }
    });
  }

// sendEmail(raw: string) {
//   return gapi.client.gmail.users.messages.send({
//     userId: 'me',
//     resource: { raw }
//   });
// }
}
