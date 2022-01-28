export const round = (value: number, precision: number = 0) => {
    const multiplier = 10 ** precision
    return Math.round(value * multiplier) / multiplier
}
