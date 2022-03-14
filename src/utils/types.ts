export enum BackendFormat {
    PLANTNET = 'pn',
    C4C = 'c4c',
}

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
    taxonName: string
    author: string
    family: string
    commonNames: string[]
    images: ImageType[]
    gbifUrl: string | null
}

// Cos4Cloud backend formats
export type C4CServerResult = {
    name: string
    score: number
    gbif_id: string
    authorship: string
    vernacularName: string
    genus: string
    family: string
    images: {
        url: string
        license: string
        rightsHolder: string
        publisher: string
    }[]
}
export type IdentifyC4CSuccessResponse = {
    results: C4CServerResult[]
}
export type IdentifyC4CErrorResponse = {
    status: string
}
