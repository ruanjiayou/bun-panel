
export default function getRealUrl(url) {
    return url ? process.env.PUBLIC_URL + url : '';
}