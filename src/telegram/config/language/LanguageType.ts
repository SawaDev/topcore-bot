// Настройки языка
export interface LanguageType {
    i18n: {
        locale: (lang: string) => void
        t: (key: string, templateData?: {[key: string]: string | undefined}) => string
        languageCode: "ru" | "uz"
    }
}
