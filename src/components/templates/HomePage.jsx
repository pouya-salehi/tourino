import HeroBanner from "../modules/homepage/Banner";
import AnnouncementModal from "../modules/homepage/modal/AnnouncementModal";
import Banner from "../modules/homepage/Banner1";
import Category from "../modules/homepage/categories/Category";
function HomePage() {
  return (
    <div className="px-4">
      <Banner />
      <AnnouncementModal />
      <Category />
    </div>
  );
}

export default HomePage;
