import ArcGalleryHero from "@/components/ArcGalleryHero";
import FeaturesSection from "@/components/FeaturesSection";

const Index = () => {
  const images = [
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/40e58d92-2ef9-44c1-95e5-0eda2c165ce9.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/38ce97ca-d306-4277-9656-dd5e278efce7.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/49f3cac7-e52e-4dbf-9f79-10f0af961396.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/40e58d92-2ef9-44c1-95e5-0eda2c165ce9.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/38ce97ca-d306-4277-9656-dd5e278efce7.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/49f3cac7-e52e-4dbf-9f79-10f0af961396.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/40e58d92-2ef9-44c1-95e5-0eda2c165ce9.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/38ce97ca-d306-4277-9656-dd5e278efce7.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/49f3cac7-e52e-4dbf-9f79-10f0af961396.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/40e58d92-2ef9-44c1-95e5-0eda2c165ce9.jpg",
    "https://cdn.poehali.dev/projects/a2a41ba5-e011-4b5e-945c-ab520852129f/files/38ce97ca-d306-4277-9656-dd5e278efce7.jpg",
  ];

  return (
    <main className="relative min-h-screen bg-background">
      <ArcGalleryHero
        images={images}
        startAngle={20}
        endAngle={160}
        radiusLg={480}
        radiusMd={360}
        radiusSm={260}
        cardSizeLg={120}
        cardSizeMd={100}
        cardSizeSm={80}
        className="pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24"
      />
      <FeaturesSection />
    </main>
  );
};

export default Index;