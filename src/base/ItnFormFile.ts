export default class ItnFormFile {
    /**
     * File data base64 or url
     * */
    data: string | null = null;
    /**
     * Indicated that user deleted file
     * */
    fileWasChanged?: boolean;
    /**
     * New uploaded file
     * */
    file?: File | null;
    /**
     * Name of the file
     * */
    fileName: string | null = null;

    constructor(file: File | null) {
        this.file = file;
        this.fileWasChanged = true;
    }
}