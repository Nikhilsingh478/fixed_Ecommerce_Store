import Header from "@/components/Header/Header";
import BottomNav from "@/components/BottomNav/BottomNav";
import Carousel from "@/components/Carousel/Carousel";
import SectionGrid from "@/components/SectionGrid/SectionGrid";
import { useCategories } from "@/hooks/useCategories";
import { useSubCategories } from "@/hooks/useSubCategories";
import { brands } from "@/data/brands";
import { getProductImage } from "@/utils/imageHelper";

import banner1 from "@/assets/banner1.webp";
import banner2 from "@/assets/banner2.webp";
import banner3 from "@/assets/banner3.webp";

const bannerImages = [banner1, banner2, banner3];

const CategorySection = ({ category, idx }: { category: any; idx: number }) => {
  const subcategories = useSubCategories(category.primaryCategoryId);
  if (!subcategories || subcategories.length === 0) return null;
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
      <SectionGrid
        title={category.primaryCategoryName}
        items={subcategories.map((sub: any) => ({
          id: sub.subCategoryId?.toString(),
          name: sub.subCategoryName,
          image: getProductImage(sub.productImageId),
          link: `/category/${category.primaryCategoryId}/${sub.subCategoryId}`,
        }))}
      />
    </div>
  );
};

const Home = () => {
  const categories = useCategories();

  return (
    <div className="flex min-h-screen flex-col bg-background pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <Header />

      <main className="flex-1 w-full mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="mt-0 animate-fade-in">
          <Carousel images={bannerImages} />
        </div>

        <div className="flex flex-col gap-10 mt-8 md:gap-14 md:mt-12 pb-8">
          {categories.map((cat: any, idx: number) => (
            <CategorySection key={cat.primaryCategoryId} category={cat} idx={idx} />
          ))}

          <div
            className="animate-fade-up"
            style={{ animationDelay: `${categories.length * 50}ms` }}
          >
            <SectionGrid
              title="Popular Brands"
              items={brands.map((b) => ({
                id: b.id,
                name: b.name,
                image: b.image,
                link: `/category/${b.id}`,
              }))}
            />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
