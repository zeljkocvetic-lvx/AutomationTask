export enum CategoryTab {
    Shortage = 'i18n>WorklistFilterShortage',
    PlentyInStock = 'i18n>WorklistFilterInStock',
    AllProducts = 'i18n>WorklistFilterProductsAll'
}

export const CategoryDisplayNameMap: Record<string, CategoryTab> = {
    'Shortage': CategoryTab.Shortage,
    'Plenty in Stock': CategoryTab.PlentyInStock,
    'All Products': CategoryTab.AllProducts
};

