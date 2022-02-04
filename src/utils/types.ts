export type ServerResult = {
    gbif: {
        id: string
    }
    images: {
        author: string
        citation: string
        date: {
            timestamp: number
            string: string
        }
        organ: string
        url: {
            o: string
            m: string
            s: string
        }
    }[]
    score: number
    species: {
        commonNames: string[]
        family: {
            scientificName: string
        }
        genus: {
            scientificName: string
        }
        scientificName: string
        scientificNameAuthorship: string
        scientificNameWithoutAuthor: string
    }
}

export type IdentifySuccessResponse = {
    results: ServerResult[]
}

export type IdentifyErrorResponse = {
    statusCode: number
    error: string
    message: string
}
export type ImageType = {
    url: string
    alt: string
}
export type ResultType = {
    score: number
    speciesName: string
    author: string
    family: string
    commonNames: string[]
    images: ImageType[]
    gbifUrl: string | null
}
