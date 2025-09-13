type CapitalizeFirstLetterType = (string: string) => string

/**
 * Первую букву заглавной
 * @param string
 */
export const capitalizeFirstLetter: CapitalizeFirstLetterType = (string) => {
    return (string?.charAt(0)?.toUpperCase() + string?.slice(1)) || string
}


type SelectLastWordType = (string: string) => string

/**
 * Взять последнее слово
 * @param string
 */
export const selectLastWord: SelectLastWordType = (string) => {
    return string?.trim()?.split(" ")?.pop() || string
}

type SelectFirstWordType = (string: string) => string

/**
 * Взять первое слово
 * @param string
 */
export const selectFirstWord: SelectFirstWordType = (string) => {
    return string?.trim()?.split(" ")?.shift() || string
}
