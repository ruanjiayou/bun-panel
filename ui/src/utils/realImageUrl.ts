export default function getRealUrl(url: string) {
    return url ? '/panel' + url : '';
}