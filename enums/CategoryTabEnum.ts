import type { ProductCategory } from '../types/productCategory.js';

export enum CategoryTabEnum {
    Shortage = 'i18n>WorklistFilterShortage',
    PlentyInStock = 'i18n>WorklistFilterInStock',
    AllProducts = 'i18n>WorklistFilterProductsAll'
}

export const CategoryDisplayNameMap: Record<ProductCategory, CategoryTabEnum> = {
    'Shortage': CategoryTabEnum.Shortage,
    'Plenty in Stock': CategoryTabEnum.PlentyInStock,
    'All Products': CategoryTabEnum.AllProducts
};

