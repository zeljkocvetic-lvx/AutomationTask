export enum CategoryTabEnum {
    Shortage = 'i18n>WorklistFilterShortage',
    PlentyInStock = 'i18n>WorklistFilterInStock',
    AllProducts = 'i18n>WorklistFilterProductsAll'
}

export type CategoryDisplayName = 'Shortage' | 'Plenty in Stock' | 'All Products';

export const CategoryDisplayNameMap: Record<CategoryDisplayName, CategoryTabEnum> = {
    'Shortage': CategoryTabEnum.Shortage,
    'Plenty in Stock': CategoryTabEnum.PlentyInStock,
    'All Products': CategoryTabEnum.AllProducts
};

