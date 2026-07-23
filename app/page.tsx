import Hero from "./components/home/Hero";
import Categories from "./components/home/categories";
import FeaturedMenu from "./components/home/featuredMenu";
import About from "./components/home/about";
import Gallery from "./gallery/page";
export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedMenu />
      <About/>
      <Gallery/>
    </>
  );
}