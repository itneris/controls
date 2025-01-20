export const DEFAULT_PASSWORD_LENGTH = 8;

export const generatePassword = (length?: number): string => {
    const small = "abcdefghijklmnopqrstuvwxyz";
    const nonAlpha = "!@#$%^&*()-+<>";
    const big = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "1234567890"
    const chars = small + nonAlpha + big + numbers;

    let pass = "";
    for (let i = 0; i < (length || DEFAULT_PASSWORD_LENGTH); i++) {
        const charPos = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(charPos);
    }

    if (/\d/.test(pass) && /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /[!@#$%^&*()\-+<>]/.test(pass)) {
        return pass;
    } else {
        return generatePassword(length);
    }
}
