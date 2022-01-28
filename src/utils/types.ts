export type Result = {
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
    results: Result[]
}

export type IdentifyErrorResponse = {
    statusCode: number
    error: string
    message: string
}
