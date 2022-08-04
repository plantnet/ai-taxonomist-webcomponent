import { BackendFormat, Results } from './types.js'
import {
    formatC4CRequest,
    formatC4CResponse,
    formatCarpersoResponse,
    formatCarpesoRequest,
    formatPlantNetRequest,
    formatPlantNetResponse,
} from './identifyRequestUtils.js'

const formatRequest = (
    images: File[],
    apiUrl: string,
    apiKey: string | null,
    backendFormat: BackendFormat
): [FormData, URL] => {
    switch (backendFormat) {
        default:
        case BackendFormat.PLANTNET:
            return formatPlantNetRequest(images, apiUrl, apiKey)
        case BackendFormat.C4C:
            return formatC4CRequest(images, apiUrl, apiKey)
        case BackendFormat.CARPESO:
            return formatCarpesoRequest(images, apiUrl, apiKey)
    }
}

export const identifyRequest = async (
    images: File[],
    apiUrl: string,
    apiKey: string | null,
    backendFormat: BackendFormat
): Promise<Results | string> => {
    const [form, url] = formatRequest(images, apiUrl, apiKey, backendFormat)

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: form,
        })

        if (!response.ok) {
            return `Error: ${response.statusText}`
        }

        switch (backendFormat) {
            default:
            case BackendFormat.PLANTNET:
                return formatPlantNetResponse(response)
            case BackendFormat.C4C:
                return formatC4CResponse(response)
            case BackendFormat.CARPESO:
                return formatCarpersoResponse(response, apiUrl)
        }
    } catch (error: any) {
        return `Error: ${error.message}`
    }
}

type StatusResponse = {
    status: string
    gbif_doi: string
    queries: number
}
export const getGBIFDoi = async (apiUrl: string, backendFormat: BackendFormat): Promise<null | string> => {
    if (backendFormat !== BackendFormat.C4C) {
        return null
    }

    try {
        const response = await fetch(`${apiUrl}/status`)
        if (response.status === 200) {
            const responseJson: StatusResponse = await response.json()
            return `https://doi.org/${responseJson.gbif_doi}`
        }
        return null
    } catch (error: any) {
        return null
    }
}
