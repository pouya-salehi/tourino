import HeroBanner from "../modules/homepage/Banner";
import AnnouncementModal from "../modules/homepage/modal/AnnouncementModal";
import Banner from "../modules/homepage/Banner1";
import Category from "../modules/homepage/categories/Category";
import Features from "../modules/homepage/features/Features";
function HomePage() {
  return (
    <div className="px-0 md:px-4">
      <Banner />
      <AnnouncementModal />
      <Category />
      <Features />
    </div>
  );
}

export default HomePage;
