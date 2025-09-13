type ChunkType = (array: any, size: number) => any

/**
 * Делит на несколько массивов
 * @param array
 * @param size
 */
export const chunk: ChunkType = (array, size) =>
    array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / size)
        if (!resultArray[chunkIndex]) resultArray[chunkIndex] = []
        resultArray[chunkIndex].push(item)
        return resultArray
    }, [])
