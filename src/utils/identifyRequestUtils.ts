import { getBrowserLang } from './getBrowserLang.js'
import {
    C4CServerResult,
    CarpesoServerResult,
    IdentifyC4CErrorResponse,
    IdentifyC4CSuccessResponse,
    IdentifyCarpesoErrorResponse,
    IdentifyCarpesoSuccessResponse,
    IdentifyErrorResponse,
    IdentifySuccessResponse,
    Results,
    ServerResult,
} from './types.js'
import { round } from './round.js'

export const formatPlantNetRequest = (images: File[], apiUrl: string, apiKey: string | null): [FormData, URL] => {
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
    return [form, url]
}
export const formatC4CRequest = (images: File[], apiUrl: string, apiKey: string | null): [FormData, URL] => {
    const form = new FormData()
    form.append('info', 'true')

    for (let i = 0; i < images.length; i += 1) {
        form.append('image', images[i])
    }

    const url = new URL(`${apiUrl}/identify`)
    url.searchParams.append('lang', getBrowserLang())
    if (apiKey && apiKey.length) {
        url.searchParams.append('api-key', apiKey)
    }
    return [form, url]
}
export const formatCarpesoRequest = (images: File[], apiUrl: string, apiKey: string | null): [FormData, URL] => {
    const form = new FormData()

    for (let i = 0; i < images.length; i += 1) {
        form.append('image', images[i])
    }

    const url = new URL(apiUrl)
    url.searchParams.append('lang', getBrowserLang())
    if (apiKey && apiKey.length) {
        url.searchParams.append('api-key', apiKey)
    }
    return [form, url]
}
export const formatPlantNetResponse = async (response: Response): Promise<Results | string> => {
    const responseJson: IdentifySuccessResponse | IdentifyErrorResponse = await response.json()

    if ('error' in responseJson) {
        return responseJson.message
    }

    return {
        results: responseJson.results.map((result: ServerResult) => ({
            score: result.score,
            taxonName: result.species.scientificNameWithoutAuthor,
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
            formatTaxonName: true,
        })),
    }
}
export const formatC4CResponse = async (response: Response): Promise<Results | string> => {
    const responseJson: IdentifyC4CSuccessResponse | IdentifyC4CErrorResponse = await response.json()

    if ('status' in responseJson && responseJson.status === 'error') {
        return responseJson.status
    }

    // Force casting as the server does not return an error type or a species field in the response in case of errors.
    const responseJsonResults = (responseJson as IdentifyC4CSuccessResponse).results

    return {
        results: responseJsonResults.map((result: C4CServerResult) => ({
            score: result.score,
            taxonName: result.name,
            author: result.authorship,
            family: result.family,
            commonNames: [result.vernacularName],
            gbifUrl: `https://www.gbif.org/species/${result.gbif_id}`,
            images: result.images
                .map(image => ({
                    url: image.url,
                    alt: `${image.publisher ? `${image.publisher} - ` : ''}${image.rightsHolder} - ${image.license}`,
                }))
                .slice(0, 3),
            formatTaxonName: true,
        })),
    }
}

export const formatCarpersoResponse = async (response: Response, apiUrl: string): Promise<Results | string> => {
    const responseJson: IdentifyCarpesoSuccessResponse | IdentifyCarpesoErrorResponse = await response.json()

    if ('status' in responseJson && responseJson.status === 'error') {
        return responseJson.status
    }

    // Force casting as the server does not return an error type or a species field in the response in case of errors.
    const { results } = responseJson as IdentifyCarpesoSuccessResponse

    const origin = apiUrl.replace('classify', '')

    return {
        overallScore: `Valeur nutritive estimée : ${round(results.nutrition, 2)} ufl/kg MS`,
        results: results.details.map((result: CarpesoServerResult) => ({
            score: result.score,
            taxonName: result.name,
            author: result.authorship,
            family: null,
            gbifUrl: null,
            url: result.url ? result.url : undefined,
            commonNames: [result.vernacularName],
            additionalText: result.nutrition ? `Nutrition : ${result.nutrition} ufl/kg MS` : undefined,
            images: result.images
                .map(image => ({
                    url: `${origin}/${image.url}`,
                    alt: `${result.name} ${origin}/${image.url}`,
                }))
                .slice(0, 3),
            formatTaxonName: true,
        })),
    }
}
