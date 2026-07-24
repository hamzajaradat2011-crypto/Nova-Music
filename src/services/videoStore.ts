import { dbService } from './database';

class VideoStoreService {
  private fileMap = new Map<string, File | Blob>();
  private urlMap = new Map<string, string>();

  public registerVideo(id: string, file: File): string {
    this.fileMap.set(id, file);
    const url = URL.createObjectURL(file);
    this.urlMap.set(id, url);

    // Persist video file blob to IndexedDB so it survives browser reloads & site exits
    dbService.put('videoBlobs', { id, blob: file, name: file.name, type: file.type }).catch(err => {
      console.warn('Failed to persist video blob to IndexedDB:', err);
    });

    return url;
  }

  public getVideoUrl(id: string, defaultUrl: string): string {
    if (this.urlMap.has(id)) {
      return this.urlMap.get(id)!;
    }
    if (this.fileMap.has(id)) {
      const url = URL.createObjectURL(this.fileMap.get(id)!);
      this.urlMap.set(id, url);
      return url;
    }
    return defaultUrl;
  }

  public async getVideoUrlAsync(id: string, defaultUrl: string): Promise<string> {
    if (this.urlMap.has(id)) {
      return this.urlMap.get(id)!;
    }
    if (this.fileMap.has(id)) {
      const url = URL.createObjectURL(this.fileMap.get(id)!);
      this.urlMap.set(id, url);
      return url;
    }

    // Restore video blob from IndexedDB if app was restarted
    try {
      const storedBlob = await dbService.getBlob('videoBlobs', id);
      if (storedBlob) {
        this.fileMap.set(id, storedBlob);
        const url = URL.createObjectURL(storedBlob);
        this.urlMap.set(id, url);
        return url;
      }
    } catch (err) {
      console.warn('Failed to restore video blob from IndexedDB:', err);
    }

    return defaultUrl;
  }

  public getFile(id: string): File | Blob | undefined {
    return this.fileMap.get(id);
  }
}

export const videoStore = new VideoStoreService();
