export interface FilterStyle {
    name: string;
    cssFilter: string;
  }
  
  export const FilterPresets: FilterStyle[] = [
    // Existing Filters
    {
      name: "Black & White",
      cssFilter: "grayscale(100%) contrast(120%)",
    },
    {
      name: "Vintage",
      cssFilter: "sepia(60%) contrast(90%) brightness(90%)",
    },
    {
      name: "Sunkiss",
      cssFilter: "brightness(110%) contrast(105%) saturate(120%) hue-rotate(10deg)",
    },
    {
      name: "Cool Mist",
      cssFilter: "contrast(90%) brightness(110%) hue-rotate(200deg) saturate(80%)",
    },
    {
      name: "Moody",
      cssFilter: "brightness(85%) contrast(120%) saturate(60%)",
    },
    {
      name: "Cinematic",
      cssFilter: "contrast(130%) brightness(90%) hue-rotate(-10deg)",
    },
    {
      name: "Creamy",
      cssFilter: "brightness(105%) contrast(95%) sepia(10%)",
    },
    {
      name: "Desert Sun",
      cssFilter: "sepia(30%) brightness(110%) hue-rotate(-20deg)",
    },
    {
      name: "Ocean Fade",
      cssFilter: "brightness(105%) hue-rotate(180deg) saturate(80%)",
    },
    {
      name: "Frostbite",
      cssFilter: "brightness(120%) contrast(85%) hue-rotate(240deg)",
    },
  
    // 📸 Instagram-Inspired Filters
    {
      name: "Clarendon",
      cssFilter: "contrast(125%) saturate(120%)",
    },
    {
      name: "Juno",
      cssFilter: "contrast(115%) brightness(105%) saturate(120%) hue-rotate(-10deg)",
    },
    {
      name: "Lark",
      cssFilter: "brightness(115%) saturate(105%) contrast(95%)",
    },
    {
      name: "Gingham",
      cssFilter: "contrast(90%) sepia(20%) brightness(105%)",
    },
    {
      name: "Ludwig",
      cssFilter: "brightness(105%) contrast(100%) saturate(90%)",
    },
    {
      name: "Aden",
      cssFilter: "hue-rotate(20deg) contrast(85%) saturate(80%)",
    },
    {
      name: "Perpetua",
      cssFilter: "brightness(115%) hue-rotate(30deg) saturate(120%)",
    },
    {
      name: "Reyes",
      cssFilter: "sepia(20%) brightness(105%) contrast(90%)",
    },
    {
      name: "Valencia",
      cssFilter: "sepia(15%) brightness(110%) contrast(90%)",
    },
    {
      name: "Willow",
      cssFilter: "grayscale(50%) sepia(10%) brightness(105%)",
    },
  
    // 👻 Snapchat-Inspired Filters
    {
      name: "Glow Pop",
      cssFilter: "brightness(130%) contrast(110%) saturate(140%)",
    },
    {
      name: "Dreamy",
      cssFilter: "blur(1px) brightness(115%)",
    },
    {
      name: "Retro Flash",
      cssFilter: "sepia(40%) contrast(110%) brightness(95%)",
    },
    {
      name: "Twilight",
      cssFilter: "brightness(85%) contrast(120%) hue-rotate(220deg)",
    },
    {
      name: "Neon Pulse",
      cssFilter: "contrast(140%) hue-rotate(270deg) saturate(160%)",
    },
    {
      name: "Fairy Dust",
      cssFilter: "brightness(120%) sepia(10%) saturate(130%)",
    },
    {
      name: "Cyber Cool",
      cssFilter: "brightness(110%) contrast(100%) hue-rotate(200deg)",
    },
    {
      name: "Warm Haze",
      cssFilter: "sepia(25%) brightness(110%) hue-rotate(-10deg)",
    },
    {
      name: "Pink Vibe",
      cssFilter: "hue-rotate(330deg) brightness(110%) saturate(130%)",
    },
    {
      name: "Chill Frost",
      cssFilter: "brightness(125%) contrast(85%) hue-rotate(250deg)",
    },
  ];
  