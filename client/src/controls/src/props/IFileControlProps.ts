export default interface IFileControlProps {
    accept?: string;
    maxSizeKb?: number;
    withImagePreview?: boolean;
    isAvatar?: boolean;
    cropImageToSize?: [number, number] | null;
}