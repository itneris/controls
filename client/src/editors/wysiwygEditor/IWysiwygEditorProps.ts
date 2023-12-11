export interface ISunEditorProps {
    availableFonts?: string[];
    minHeight?: string;
    buttonList?: any[];
}

export default interface IWysiwygEditorProps extends ISunEditorProps {
    value: string | null;
    onChange?: ((value: string) => void) | null;
    onImageSave?: (data: File) => Promise<string>;
}