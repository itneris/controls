export function compressImageToSize(sizeKb: number, canvas: HTMLCanvasElement) {
    let quality = 1.0; // Start with maximum quality
    let dataUrl: string;

    do {
        // Get the data URL of the image with the current quality
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Check the size of the data URL
        const sizeInKB = dataUrl.length * (3 / 4) / 1024;
        
        if (sizeInKB <= sizeKb) {
            break; // If the size is within the limit, exit the loop
        }
        
        // Reduce the quality for the next iteration
        quality -= 0.1;
    } while (quality > 0);
    
    return dataUrl;
}