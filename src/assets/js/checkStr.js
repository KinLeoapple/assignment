export const checkStr = (str) => {
    return str.replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', '&quot;');
}