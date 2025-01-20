export type FileImageProperties = {
    isAvatar?: boolean;
    compressToKb?: number;
    previewSize?: {
        width: number;
        height: number;
    };
    crop?: {
        width: number;
        height: number;
        dynamic?: boolean;
        previewSized?: [number, number];
    }
}