import Header from "./Header"
import Footer from "./Footer"
function MainLayout({children}) {
  return (
    <div className="px-2">
        <Header />
        <div className="min-h-screen">{children}</div>
        <Footer />
    </div>
  )
}

export default MainLayout