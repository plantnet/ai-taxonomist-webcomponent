import {IdentifyResponse, Result} from './types'
import {ResultType} from '../TaxonResults'

export const identifyRequest = async (images: File[], serverUrl: string): Promise<ResultType[] | string> => {
    const form = new FormData()

    for (let i = 0; i < images.length; i++) {
        form.append('organs', 'auto')
        form.append('images', images[i])
    }

    const url = new URL(serverUrl)
    url.pathname = '/v2/identify/all'
    url.searchParams.append("include-related-images", "true")

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: form,
        })

        const responseJson: IdentifyResponse = await response.json()

        return responseJson.results.map((result: Result) => ({
            score: result.score,
            speciesName: result.species.scientificNameWithoutAuthor,
            author: result.species.scientificNameAuthorship,
            family: result.species.family.scientificName,
            commonNames: result.species.commonNames,
            images: result.images.map(image => ({
                url: image.url.o,
                alt: `${image.citation} - ${image.date.string}`
            })).slice(0, 3),
        }))

    } catch (error: any) {
        console.error(error)
        return `Error: ${error.message}`
    }
}