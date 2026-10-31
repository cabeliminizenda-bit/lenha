'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Price from '@/components/Price';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface ShopFiltersProps {
  categories: Category[];
  brands: Brand[];
  globalMinPrice?: number;
  globalMaxPrice?: number;
}

export default function ShopFilters({
  categories,
  brands,
  globalMinPrice = 0,
  globalMaxPrice = 1000,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Shop');

  // Detect category from URL path if on /product-category/[slug]
  const pathCategorySlug = pathname.includes('/product-category/')
    ? decodeURIComponent(pathname.split('/product-category/')[1]?.split('/')[0]?.split('?')[0] || '')
    : null;

  // States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');
  const [sliderMin, setSliderMin] = useState<number>(globalMinPrice);
  const [sliderMax, setSliderMax] = useState<number>(globalMaxPrice);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);

  // Synchronize state from URL
  useEffect(() => {
    // Categories
    const queryCats = searchParams.getAll('category').map((c) => decodeURIComponent(c));
    if (queryCats.length > 0) {
      setSelectedCategories(queryCats);
    } else if (pathCategorySlug) {
      setSelectedCategories([pathCategorySlug]);
    } else {
      setSelectedCategories([]);
    }

    // Min price
    const minParam = searchParams.get('minPrice');
    if (minParam !== null && minParam !== '') {
      setMinInput(minParam);
      setSliderMin(Number(minParam));
    } else {
      setMinInput('');
      setSliderMin(globalMinPrice);
    }

    // Max price
    const maxParam = searchParams.get('maxPrice');
    if (maxParam !== null && maxParam !== '') {
      setMaxInput(maxParam);
      setSliderMax(Number(maxParam));
    } else {
      setMaxInput('');
      setSliderMax(globalMaxPrice);
    }

    // Brands
    const brandParams = searchParams.getAll('brand').map((b) => decodeURIComponent(b));
    setSelectedBrands(brandParams);

    // Ratings
    const ratingParams = searchParams.getAll('rating').map(Number).filter((n) => !isNaN(n));
    setSelectedRatings(ratingParams);
  }, [searchParams, pathname, pathCategorySlug, globalMinPrice, globalMaxPrice]);

  // Core navigation handler
  const updateFilters = (
    cats: string[],
    minVal: number | string,
    maxVal: number | string,
    brnds: string[],
    ratings: number[]
  ) => {
    const params = new URLSearchParams();

    // Preserve view and sort
    const currentView = searchParams.get('view');
    if (currentView) params.set('view', currentView);

    const currentSort = searchParams.get('sort');
    if (currentSort) params.set('sort', currentSort);

    // Price query params
    const minNum = typeof minVal === 'string' ? parseFloat(minVal) : minVal;
    const maxNum = typeof maxVal === 'string' ? parseFloat(maxVal) : maxVal;

    if (!isNaN(minNum) && minNum > globalMinPrice) {
      params.set('minPrice', minNum.toString());
    }
    if (!isNaN(maxNum) && maxNum < globalMaxPrice) {
      params.set('maxPrice', maxNum.toString());
    }

    // Brands
    brnds.forEach((b) => params.append('brand', b));

    // Ratings
    ratings.forEach((r) => params.append('rating', r.toString()));

    // Target route and category parameter logic
    let targetPath = '/shop';

    if (cats.length === 1) {
      const singleCat = cats[0];
      if (pathname.includes('/product-category/')) {
        // Stay on / navigate to /product-category/[slug]
        targetPath = `/product-category/${encodeURIComponent(singleCat)}`;
      } else {
        // Stay on /shop?category=[slug]
        targetPath = '/shop';
        params.append('category', singleCat);
      }
    } else if (cats.length > 1) {
      // Multiple categories -> shop page with multi-category parameters
      targetPath = '/shop';
      cats.forEach((c) => params.append('category', c));
    } else {
      // 0 categories -> general shop page
      targetPath = '/shop';
    }

    const qs = params.toString();
    const destination = qs ? `${targetPath}?${qs}` : targetPath;
    router.push(destination, { scroll: false });
  };

  const currentPriceMin = sliderMin > globalMinPrice ? sliderMin : '';
  const currentPriceMax = sliderMax < globalMaxPrice ? sliderMax : '';

  const handleCategoryChange = (slug: string) => {
    const newCats = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    setSelectedCategories(newCats);
    updateFilters(newCats, currentPriceMin, currentPriceMax, selectedBrands, selectedRatings);
  };

  const handleBrandChange = (slug: string) => {
    const newBrands = selectedBrands.includes(slug)
      ? selectedBrands.filter((b) => b !== slug)
      : [...selectedBrands, slug];
    setSelectedBrands(newBrands);
    updateFilters(selectedCategories, currentPriceMin, currentPriceMax, newBrands, selectedRatings);
  };

  const handleRatingChange = (rating: number) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter((r) => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(newRatings);
    updateFilters(selectedCategories, currentPriceMin, currentPriceMax, selectedBrands, newRatings);
  };

  const handlePriceApply = () => {
    const minVal = minInput.trim() !== '' ? parseFloat(minInput) : globalMinPrice;
    const maxVal = maxInput.trim() !== '' ? parseFloat(maxInput) : globalMaxPrice;
    const safeMin = isNaN(minVal) ? globalMinPrice : Math.max(globalMinPrice, minVal);
    const safeMax = isNaN(maxVal) ? globalMaxPrice : Math.min(globalMaxPrice, maxVal);

    setSliderMin(safeMin);
    setSliderMax(safeMax);
    updateFilters(
      selectedCategories,
      safeMin > globalMinPrice ? safeMin : '',
      safeMax < globalMaxPrice ? safeMax : '',
      selectedBrands,
      selectedRatings
    );
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePriceApply();
    }
  };

  const handleResetFilters = () => {
    if (pathCategorySlug) {
      router.push(`/product-category/${encodeURIComponent(pathCategorySlug)}`, { scroll: false });
    } else {
      router.push('/shop', { scroll: false });
    }
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedRatings.length > 0 ||
    sliderMin > globalMinPrice ||
    sliderMax < globalMaxPrice ||
    (!pathCategorySlug && selectedCategories.length > 0) ||
    (pathCategorySlug && selectedCategories.length !== 1) ||
    (pathCategorySlug && selectedCategories.length === 1 && selectedCategories[0] !== pathCategorySlug);

  // Helper for rendering stars
  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-orange-500 fill-orange-500' : 'text-gray-300 fill-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  return (
    <div className="w-full">
      {/* Header with optional Reset */}
      {hasActiveFilters && (
        <div className="mb-6 pb-4 border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t('items_selected', { count: selectedBrands.length + (pathCategorySlug ? 0 : selectedCategories.length) + (sliderMin > globalMinPrice || sliderMax < globalMaxPrice ? 1 : 0) + selectedRatings.length })}
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium underline"
          >
            {t('reset_filters')}
          </button>
        </div>
      )}

      {/* Price Filter */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">{t('filter_price')}</h3>

        <div className="relative pt-6 pb-2 mb-2">
          {/* Track background */}
          <div className="absolute top-7 left-0 right-0 h-1.5 bg-gray-200 rounded"></div>

          {/* Active track */}
          <div
            className="absolute top-7 h-1.5 bg-orange-500 rounded"
            style={{
              left: `${Math.max(
                0,
                ((sliderMin - globalMinPrice) / Math.max(1, globalMaxPrice - globalMinPrice)) * 100
              )}%`,
              right: `${Math.max(
                0,
                100 - ((sliderMax - globalMinPrice) / Math.max(1, globalMaxPrice - globalMinPrice)) * 100
              )}%`,
            }}
          ></div>

          <input
            type="range"
            min={globalMinPrice}
            max={globalMaxPrice}
            value={sliderMin}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), sliderMax - 1);
              setSliderMin(val);
              setMinInput(val.toString());
            }}
            onMouseUp={() =>
              updateFilters(
                selectedCategories,
                sliderMin > globalMinPrice ? sliderMin : '',
                sliderMax < globalMaxPrice ? sliderMax : '',
                selectedBrands,
                selectedRatings
              )
            }
            onTouchEnd={() =>
              updateFilters(
                selectedCategories,
                sliderMin > globalMinPrice ? sliderMin : '',
                sliderMax < globalMaxPrice ? sliderMax : '',
                selectedBrands,
                selectedRatings
              )
            }
            className="absolute top-5 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none shadow-sm"
            style={{ zIndex: sliderMin > globalMaxPrice - 100 ? 5 : 3 }}
          />
          <input
            type="range"
            min={globalMinPrice}
            max={globalMaxPrice}
            value={sliderMax}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), sliderMin + 1);
              setSliderMax(val);
              setMaxInput(val.toString());
            }}
            onMouseUp={() =>
              updateFilters(
                selectedCategories,
                sliderMin > globalMinPrice ? sliderMin : '',
                sliderMax < globalMaxPrice ? sliderMax : '',
                selectedBrands,
                selectedRatings
              )
            }
            onTouchEnd={() =>
              updateFilters(
                selectedCategories,
                sliderMin > globalMinPrice ? sliderMin : '',
                sliderMax < globalMaxPrice ? sliderMax : '',
                selectedBrands,
                selectedRatings
              )
            }
            className="absolute top-5 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none shadow-sm"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Inputs & Apply Button */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[11px] text-gray-500 block mb-1">{t('min_price')}</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">€</span>
              <input
                type="number"
                min={globalMinPrice}
                max={sliderMax}
                value={minInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setMinInput(val);
                  if (val !== '' && !isNaN(Number(val))) {
                    setSliderMin(Math.max(globalMinPrice, Math.min(Number(val), sliderMax)));
                  }
                }}
                onKeyDown={handlePriceKeyDown}
                placeholder={globalMinPrice.toString()}
                className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <span className="text-gray-400 self-end mb-2">—</span>
          <div className="flex-1">
            <label className="text-[11px] text-gray-500 block mb-1">{t('max_price')}</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">€</span>
              <input
                type="number"
                min={sliderMin}
                max={globalMaxPrice}
                value={maxInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setMaxInput(val);
                  if (val !== '' && !isNaN(Number(val))) {
                    setSliderMax(Math.min(globalMaxPrice, Math.max(Number(val), sliderMin)));
                  }
                }}
                onKeyDown={handlePriceKeyDown}
                placeholder={globalMaxPrice.toString()}
                className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePriceApply}
          className="mt-3 w-full bg-gray-900 hover:bg-orange-600 text-white text-xs font-semibold py-2 px-3 rounded transition-colors"
        >
          {t('apply_price')}
        </button>

        <div className="mt-3 text-xs text-gray-500 text-center">
          <Price amount={sliderMin} showTax={false} /> — <Price amount={sliderMax} showTax={false} />
        </div>
      </div>

      <hr className="border-gray-200 mb-8" />

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">{t('filter_categories')}</h3>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-orange-500 hover:border-orange-500 transition-colors"
          >
            <span className="text-gray-700 truncate font-medium">
              {selectedCategories.length > 0
                ? t('items_selected', { count: selectedCategories.length })
                : `-- ${t('filter_categories')} --`}
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isCategoriesOpen && (
            <div className="mt-2 bg-white border border-gray-200 rounded-md max-h-64 overflow-y-auto p-4 space-y-3 shadow-lg z-10">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => handleCategoryChange(cat.slug)}
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-orange-600 transition-colors flex-1 truncate">
                    {cat.name}
                  </span>
                  {cat._count !== undefined && (
                    <span className="text-xs text-gray-400 font-mono">({cat._count.products})</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-200 mb-8" />

      {/* Brands */}
      {brands.length > 0 && (
        <>
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">{t('filter_brand')}</h3>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-orange-500 hover:border-orange-500 transition-colors"
              >
                <span className="text-gray-700 truncate font-medium">
                  {selectedBrands.length > 0
                    ? t('items_selected', { count: selectedBrands.length })
                    : `-- ${t('filter_brand')} --`}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isBrandsOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md max-h-64 overflow-y-auto p-4 space-y-3 shadow-lg z-10">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        checked={selectedBrands.includes(brand.slug)}
                        onChange={() => handleBrandChange(brand.slug)}
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-orange-600 transition-colors flex-1 truncate">
                        {brand.name}
                      </span>
                      {brand._count !== undefined && (
                        <span className="text-xs text-gray-400 font-mono">({brand._count.products})</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <hr className="border-gray-200 mb-8" />
        </>
      )}

      {/* Ratings */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">{t('filter_rating')}</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                checked={selectedRatings.includes(rating)}
                onChange={() => handleRatingChange(rating)}
              />
              <div className="ml-3 flex items-center gap-1 flex-1">
                {renderStars(rating)}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
