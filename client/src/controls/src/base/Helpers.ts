export const dataURLtoFile = (src: string, name: string) => {
    const arr = src.split(',');
    const mime = arr[0]!.match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], name, { type: mime });
}