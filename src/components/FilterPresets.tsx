export interface FilterStyle {
    name: string;
    cssFilter: string;
    icon: string;
  }
  
  export const FilterPresets: FilterStyle[] = [
    // Existing Filters with icons
    {
      name: "Black & White",
      cssFilter: "grayscale(100%) contrast(120%)",
      icon: "/icons/blackandwhite.jpeg"
    },
    {
      name: "Vintage",
      cssFilter: "sepia(60%) contrast(90%) brightness(90%)",
      icon: "/icons/vintage.jpeg"
    },
    {
      name: "Sunkiss",
      cssFilter: "brightness(110%) contrast(105%) saturate(120%) hue-rotate(10deg)",
      icon: "/icons/sunkiss.jpeg"
    },
    {
      name: "Cool Mist",
      cssFilter: "contrast(90%) brightness(110%) hue-rotate(200deg) saturate(80%)",
      icon: "/icons/coolmist.jpeg"
    },
    {
      name: "Moody",
      cssFilter: "brightness(85%) contrast(120%) saturate(60%)",
      icon: "/icons/moody.jpeg"
    },
    {
      name: "Cinematic",
      cssFilter: "contrast(130%) brightness(90%) hue-rotate(-10deg)",
      icon: "/icons/cenimatic.jpeg"
    },
    {
      name: "Creamy",
      cssFilter: "brightness(105%) contrast(95%) sepia(10%)",
      icon: "/icons/creamy.jpeg"
    },
    {
      name: "Desert Sun",
      cssFilter: "sepia(30%) brightness(110%) hue-rotate(-20deg)",
      icon: "/icons/desert.jpeg"
    },
    {
      name: "Ocean Fade",
      cssFilter: "brightness(105%) hue-rotate(180deg) saturate(80%)",
      icon: "/icons/oceanfade.jpeg"
    },
    {
      name: "Frostbite",
      cssFilter: "brightness(120%) contrast(85%) hue-rotate(240deg)",
      icon : "./icons/frostbite.jpeg"
    },
  
    // 📸 Instagram-Inspired Filters with icons
    {
      name: "Clarendon",
      cssFilter: "contrast(125%) saturate(120%)",
      icon: "/icons/clarendon.jpeg"
    },
    {
      name: "Juno",
      cssFilter: "contrast(115%) brightness(105%) saturate(120%) hue-rotate(-10deg)",
      icon: "/icons/juno.jpeg"
    },
    {
      name: "Lark",
      cssFilter: "brightness(115%) saturate(105%) contrast(95%)",
      icon: "/icons/lark.jpeg"
    },
    {
      name: "Gingham",
      cssFilter: "contrast(90%) sepia(20%) brightness(105%)",
      icon : "/icons/gingham.jpeg"
    },
    {
      name: "Ludwig",
      cssFilter: "brightness(105%) contrast(100%) saturate(90%)",
      icon: "/icons/ludwig.jpeg"
    },
    {
      name: "Aden",
      cssFilter: "hue-rotate(20deg) contrast(85%) saturate(80%)",
      icon: "/icons/aden.jpeg"
    },
    {
      name: "Perpetua",
      cssFilter: "brightness(115%) hue-rotate(30deg) saturate(120%)",
      icon: "/icons/perpetua.jpeg"
    },
    {
      name: "Reyes",
      cssFilter: "sepia(20%) brightness(105%) contrast(90%)",
      icon: "/icons/reyes.jpeg"
    },
    {
      name: "Valencia",
      cssFilter: "sepia(15%) brightness(110%) contrast(90%)",
      icon: "/icons/valencia.jpeg"
    },
    {
      name: "Willow",
      cssFilter: "grayscale(50%) sepia(10%) brightness(105%)",
      icon: "/icons/willow.jpeg"
    },
  
    // 👻 Snapchat-Inspired Filters with icons
    {
      name: "Glow Pop",
      cssFilter: "brightness(130%) contrast(110%) saturate(140%)",
      icon : "/icons/glowpop.jpeg"
    },
    {
      name: "Dreamy",
      cssFilter: "blur(1px) brightness(115%)",
      icon: "/icons/dreamy.jpeg"
    },
    {
      name: "Retro Flash",
      cssFilter: "sepia(40%) contrast(110%) brightness(95%)",
      icon: "/icons/retro.jpeg"
    },
    {
      name: "Twilight",
      cssFilter: "brightness(85%) contrast(120%) hue-rotate(220deg)",
      icon: "/icons/twilight.jpeg"
    },
    {
      name: "Neon Pulse",
      cssFilter: "contrast(140%) hue-rotate(270deg) saturate(160%)",
      icon : "./icons/neon.jpeg"
    },
    {
      name: "Fairy Dust",
      cssFilter: "brightness(120%) sepia(10%) saturate(130%)",
      icon: "/icons/fairydust.jpeg"
    },
    {
      name: "Cyber Cool",
      cssFilter: "brightness(110%) contrast(100%) hue-rotate(200deg)",
      icon: "/icons/cybercool.jpeg"
    },
    {
      name: "Warm Haze",
      cssFilter: "sepia(25%) brightness(110%) hue-rotate(-10deg)",
      icon: "/icons/warmhaze.jpeg"
    },
    {
      name: "Pink Vibe",
      cssFilter: "hue-rotate(330deg) brightness(110%) saturate(130%)",
      icon: "/icons/pinkvibe.jpeg"
    },
    {
      name: "Chill Frost",
      cssFilter: "brightness(125%) contrast(85%) hue-rotate(250deg)",
      icon: "/icons/chillfreeze.jpeg"
    },
  ];
  