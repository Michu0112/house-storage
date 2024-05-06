export const createOptions = (existingCollection, collection, titleKey, valueKey) => {
    const optionsCollection = [];

    collection.forEach((entity) => {
        const optionExists = existingCollection.find((option) => {
            const id = entity.id;
            return option.value === id;
        });

        const title = entity.attributes[titleKey].trim();

        if (!optionExists && title && entity[valueKey]) {
            optionsCollection.push({
                title: entity.attributes[titleKey],
                value: entity[valueKey]
            });
        }
    });

    return optionsCollection;
};
