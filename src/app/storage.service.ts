import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storagePromise: Promise<Storage>;

  constructor(private storage: Storage) {
    this.storagePromise = this.storage.create();
  }

  async get(key: string) {
    try {
      const storage = await this.storagePromise;
      const result = await storage.get(key);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async set(key: string, value: any) {
    try {
      const storage = await this.storagePromise;
      await storage.set(key, value);
    } catch (error) {
      console.error(error);
    }
  }

  async remove(key: string) {
    try {
      const storage = await this.storagePromise;
      await storage.remove(key);
    } catch (error) {
      console.error(error);
    }
  }

  async clear() {
    try {
      const storage = await this.storagePromise;
      await storage.clear();
    } catch (error) {
      console.error(error);
    }
  }
}
