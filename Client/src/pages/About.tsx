import ParallaxImage from "@/components/ParallaxImage";

const sections = [
  {
    id: 0,
    src: "https://images.unsplash.com/photo-1528712306091-ed0763094c98?q=80&w=1600&auto=format&fit=crop",
    title: "Recipes | Stories",
    subtitle:
      "Discover how we turn ideas into dishes, and dishes into stories.",
  },
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1610415958584-11da4f652619?q=80&w=1600&auto=format&fit=crop",
    title: "IDEA",
    subtitle: "It all starts with fresh inspiration",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1554303487-3d3b64bbced9?q=80&w=1600&auto=format&fit=crop",
    title: "COOKING",
    subtitle: "Technique, timing, and a pinch of passion",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1616212171623-901340f85e98?q=80&w=1600&auto=format&fit=crop",
    title: "SHARE",
    subtitle: "Because food tastes better together",
  },
];

export default function About() {
  return (
    <>
      {sections.map((s) => (
        <ParallaxImage
          key={s.id}
          src={s.src}
          title={s.title}
          subtitle={s.subtitle}
        />
      ))}
    </>
  );
}
