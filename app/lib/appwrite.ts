import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT as string) // Your API Endpoint
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID as string); // Your project ID

const account = new Account(client);

export { client, account };
