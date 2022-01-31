export const getBrowserLang = () => {
    // @ts-ignore
    const lang = navigator.language || navigator.userLanguage
    return lang.substring(0, 2)
}
