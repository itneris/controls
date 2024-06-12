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

export default interface IFileControlProps {
    accept?: string;
    maxSizeKb?: number;
    image?: FileImageProperties
}