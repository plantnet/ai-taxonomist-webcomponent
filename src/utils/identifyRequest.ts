import { IdentifyErrorResponse, IdentifySuccessResponse, ServerResult, ResultType } from './types.js'
import { getBrowserLang } from './getBrowserLang.js'

export const identifyRequest = async (
    images: File[],
    apiUrl: string,
    apiKey: string | null
): Promise<ResultType[] | string> => {
    const form = new FormData()

    for (let i = 0; i < images.length; i += 1) {
        form.append('organs', 'auto')
        form.append('images', images[i])
    }

    const url = new URL(apiUrl)
    url.searchParams.append('include-related-images', 'true')
    url.searchParams.append('lang', getBrowserLang())
    if (apiKey && apiKey.length) {
        url.searchParams.append('api-key', apiKey)
    }

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: form,
        })

        const responseJson: IdentifySuccessResponse | IdentifyErrorResponse = await response.json()

        if ('error' in responseJson) {
            return responseJson.message
        }

        return responseJson.results.map((result: ServerResult) => ({
            score: result.score,
            speciesName: result.species.scientificNameWithoutAuthor,
            author: result.species.scientificNameAuthorship,
            family: result.species.family.scientificName,
            commonNames: result.species.commonNames,
            gbifUrl: result.gbif ? `https://www.gbif.org/species/${result.gbif.id}` : null,
            images: result.images
                .map(image => ({
                    url: image.url.m,
                    alt: `${image.citation} - ${image.date.string}`,
                }))
                .slice(0, 3),
        }))
    } catch (error: any) {
        return `Error: ${error.message}`
    }
}
