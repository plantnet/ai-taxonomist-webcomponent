import { BackendFormat, ResultType } from './types.js'
import {
    formatC4CRequest,
    formatC4CResponse,
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
    }
}

export const identifyRequest = async (
    images: File[],
    apiUrl: string,
    apiKey: string | null,
    backendFormat: BackendFormat
): Promise<ResultType[] | string> => {
    const [form, url] = formatRequest(images, apiUrl, apiKey, backendFormat)

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: form,
        })

        switch (backendFormat) {
            default:
            case BackendFormat.PLANTNET:
                return formatPlantNetResponse(response)
            case BackendFormat.C4C:
                return formatC4CResponse(response)
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
export const getGBIFDoi = async (backendFormat: BackendFormat): Promise<null | string> => {
    if (backendFormat !== BackendFormat.C4C) {
        return null
    }

    try {
        const response = await fetch('https://c4c.inria.fr/ai-taxonomist/status')
        if (response.status === 200) {
            const responseJson: StatusResponse = await response.json()
            return `https://doi.org/${responseJson.gbif_doi}`
        }
        return null
    } catch (error: any) {
        return null
    }
}
