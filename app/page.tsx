import Hero from "./components/home/Hero";
import Categories from "./components/home/categories";
import FeaturedMenu from "./components/home/featuredMenu";
import Deals from "./components/home/deals";
import Gallery from "./components/home/gallery";
import About from "./components/home/about";
import Contact from "./components/home/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedMenu />
      <Deals />
      <Gallery />
      <About />
      <Contact />
    </>
  );
}