export declare class UploadService {
    private readonly uploadDir;
    private readonly baseUrl;
    constructor();
    uploadFile(buffer: Buffer, originalName: string, mimeType: string, folder?: string): Promise<string>;
    deleteFile(url: string): Promise<void>;
}
