export enum BackendFormat {
    PLANTNET = 'pn',
    C4C = 'c4c',
    CARPESO = 'carp',
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
    taxonName: string | null
    author: string | null
    family: string | null
    commonNames: string[]
    additionalText?: string
    images: ImageType[]
    gbifUrl: string | null
    url?: string
    formatTaxonName: boolean
}

export type Results = {
    overallScore?: string
    results: ResultType[]
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

// Carpeso backend formats
export type CarpesoServerResult = {
    name: string
    authorship: string | null
    vernacularName: string
    score: number
    nutrition: number
    url: string | null
    images: {
        url: string
    }[]
}
export type IdentifyCarpesoSuccessResponse = {
    status: string
    results: {
        nutrition: number
        details: CarpesoServerResult[]
    }
}
export type IdentifyCarpesoErrorResponse = {
    status: string
}

export type SpeciesRank = 'SPECIES'

export type Species = {
    name: string
    species_id: string
    rank: SpeciesRank
    authorship: string
    vernacularName: string
    species: string
    genus: string
    family: string
}
