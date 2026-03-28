export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  height: number | null;
  weight: number | null;
  gender: string | null;
  topSize: string | null;
  bottomSize: string | null;
  shoeSize: string | null;
  bodyType: string | null;
  bodyPhotoUrl: string | null;
}

export interface StyleTag {
  id: string;
  label: string;
  emoji: string;
}

export interface OutfitItem {
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  link: string;
}

export interface OutfitCard {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  items: OutfitItem[];
  tags: string[];
  liked: boolean;
}

export const STYLE_TAGS: StyleTag[] = [
  { id: "casual", label: "캐주얼", emoji: "👕" },
  { id: "minimal", label: "미니멀", emoji: "🤍" },
  { id: "street", label: "스트릿", emoji: "🧢" },
  { id: "classic", label: "클래식", emoji: "👔" },
  { id: "sporty", label: "스포티", emoji: "🏃" },
  { id: "romantic", label: "로맨틱", emoji: "🌸" },
  { id: "modern", label: "모던", emoji: "🖤" },
  { id: "retro", label: "레트로", emoji: "🕶️" },
  { id: "preppy", label: "프레피", emoji: "📚" },
  { id: "bohemian", label: "보헤미안", emoji: "🌻" },
];

export const TOP_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const BOTTOM_SIZES = ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "36"];
export const SHOE_SIZES = ["220", "225", "230", "235", "240", "245", "250", "255", "260", "265", "270", "275", "280", "285", "290"];
export const GENDERS = [
  { id: "male", label: "남성" },
  { id: "female", label: "여성" },
];
