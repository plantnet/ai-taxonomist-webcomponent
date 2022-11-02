import { Species } from './types.js'

export const getSpeciesList = async (apiUrl: string): Promise<{ species: Species[]; error: string | null }> => {
    const response = await fetch(`${apiUrl}/taxa`)
    if (response.status === 200) {
        const speciesList: Species[] = await response.json()
        return {
            species: speciesList.sort((a, b) => a.name.localeCompare(b.name)),
            error: null,
        }
    }

    return {
        species: [],
        error: `Failed to load species list: ${response.statusText}`,
    }
}
