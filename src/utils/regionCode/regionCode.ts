export const regionCode = ( region: string ): string => {
    return region && region.split("/")[1].replace("_", " ");
};