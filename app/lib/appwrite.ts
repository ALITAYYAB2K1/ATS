// src/lib/appwrite.ts
import { Client, Account, Databases, Storage, Functions } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // e.g. https://cloud.appwrite.io/v1
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export default client;

// Ensure we have an Appwrite session. If the user is not signed in,
// create an anonymous session so Storage/Database operations work
// without prompting a login.
export async function ensureAppwriteSession() {
  try {
    const me = await account.get();
    return me;
  } catch {
    try {
      await account.createAnonymousSession();
      const me = await account.get();
      return me;
    } catch (err) {
      console.error("Failed to create anonymous session:", err);
      throw new Error(
        "Authentication required: unable to create session. Please sign in."
      );
    }
  }
}
