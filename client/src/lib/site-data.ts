// Static data for HAF Import & Supply Trade
import addisLogo from "@/assets/partnerWithUs/Addis.png";
import awashBankLogo from "@/assets/partnerWithUs/AwashBank.jpg";
import ecsuLogo from "@/assets/partnerWithUs/Ecsu.png";
import ataLogo from "@/assets/partnerWithUs/ethiopian_ata.png";
import gambellaLogo from "@/assets/partnerWithUs/gambellaUniversity.jpg";
import gizLogo from "@/assets/partnerWithUs/GIZ.jpg";
import mercyLogo from "@/assets/partnerWithUs/mercy.jpg";
import ministryLogo from "@/assets/partnerWithUs/Ministry.png";
import sameraLogo from "@/assets/partnerWithUs/samera.jpg";
import seeLogo from "@/assets/partnerWithUs/SEE.png";
import snvLogo from "@/assets/partnerWithUs/SNV.jpg";
import waterLogo from "@/assets/partnerWithUs/water.jpg";

export type Testimonial = {
  company: string;
  role: string;
  initials: string;
  color: string;
  quotes: string[];
};

export const testimonials: Testimonial[] = [
  {
    company: "GIZ Ethiopia",
    role: "International Development Partner",
    initials: "GIZ",
    color: "#D90000",
    quotes: [
      "We hereby confirm that HAF Import and Supply Trade has won orders from us and delivered as per the requirement and in a timely manner.",
    ],
  },
  {
    company: "Samera Industries",
    role: "Agricultural Solutions Provider",
    initials: "SI",
    color: "#2E8B57",
    quotes: [
      "We wholeheartedly recommend HAF Import and Supply Trade for any organization in need of high-quality cocopeat and seedling trays. Their commitment to quality and customer satisfaction is evident.",
      "HAF's consistent delivery of premium agricultural inputs has significantly improved our production quality and yield.",
      "Their customer support team is always responsive and helpful, making them a reliable partner for our business needs.",
    ],
  },
  {
    company: "Addis Ababa Science and Technology University",
    role: "Research Institution",
    initials: "AASTU",
    color: "#1B6CA8",
    quotes: [
      "The University is satisfied by the quality of the product supplied and we commend HAF Import and Supply Trade for their commitment.",
    ],
  },
  {
    company: "Ministry of Peace",
    role: "Government Agency",
    initials: "MOP",
    color: "#0D2137",
    quotes: [
      "We are extremely satisfied with the service provided by HAF Import and Supply Trade and would confidently recommend your company for future projects.",
    ],
  },
  {
    company: "SNV Netherlands",
    role: "Development Organization",
    initials: "SNV",
    color: "#E94E1B",
    quotes: [
      "We happily recommend HAF Import and Supply Trade for anyone looking to invest in reliable packing machinery. Their onion seed packing machine has not only enhanced our packing operations but has also contributed significantly to our overall productivity.",
      "They have delivered to us with our expectation. We are very happy to recommend their services.",
    ],
  },
  {
    company: "Ministry of Water and Energy",
    role: "Government Agency",
    initials: "MoWE",
    color: "#1B6CA8",
    quotes: [
      "We highly recommend HAF Import and Supply Trade for any organization seeking reliable laboratory furniture and outstanding service.",
    ],
  },
];

export const partners = [
  { name: "Ministry of Peace", logo: ministryLogo },
  { name: "Addis Ababa Science & Tech University", logo: addisLogo },
  { name: "Ethiopian Agricultural Transformation Agency", logo: ataLogo },
  { name: "Awash Bank", logo: awashBankLogo },
  { name: "Ethiopian Civil Service University", logo: ecsuLogo },
  { name: "GIZ", logo: gizLogo },
  { name: "Mercy Corps", logo: mercyLogo },
  { name: "Samara University", logo: sameraLogo },
  { name: "Ministry of Water and Energy", logo: waterLogo },
  { name: "SNV Ethiopia", logo: snvLogo },
  { name: "Save the Environment Ethiopia", logo: seeLogo },
  { name: "Gambella University", logo: gambellaLogo },
];

export const stories = [
  {
    title: "Science Museum Product Exhibition",
    year: "2024",
    partner: "MoWE Collaboration",
    location: "Addis Ababa, Ethiopia",
    category: "Exhibition",
    impact: "Empowered thousands of visitors to learn about clean water solutions",
    description:
      "Our Product Exhibition at the Science Museum, organized by the Ministry of Water and Energy (MoWE), showcased innovative water solutions to thousands of visitors, demonstrating LifeStraw's impact on clean water accessibility.",
    imageCount: 6,
  },
  {
    title: "Gode Catholic Mission",
    year: "2024",
    partner: "Eastern Ethiopia",
    location: "Gode, Somali Region",
    category: "Community Development",
    impact: "Transformed daily lives in rural communities with access to safe water",
    description:
      "Transforming lives in Gode, Somali Region, where LifeStraw provides clean drinking water by purifying raw water sources, significantly improving community health outcomes.",
    imageCount: 3,
  },
  {
    title: "Jewish Voice Ministry Collaboration",
    year: "2024",
    partner: "LifeStraw + Jewish Voice",
    location: "Multiple Locations",
    category: "Partnership",
    impact: "Distributed life-saving water filters and educated communities",
    description:
      "Our collaboration with Jewish Voice Ministry has brought clean water solutions to underserved communities, combining humanitarian efforts with innovative technology.",
    imageCount: 2,
  },
  {
    title: "Giveback Program in Ethiopia",
    year: "2024",
    partner: "LifeStraw First Campaign",
    location: "Rural Ethiopia",
    category: "Giveback Program",
    impact: "Created long-term clean water access and awareness programs",
    description:
      "LifeStraw's Giveback program's first campaign in Ethiopia created measurable impact, providing clean water access and education to rural communities in need.",
    imageCount: 5,
  },
  {
    title: "Gambella University Clean Water Supply Project",
    year: "2025",
    partner: "Gambella University Initiative",
    location: "Gambella, Ethiopia",
    category: "Clean Water Project",
    impact: "Ensured reliable access to clean water and improved health awareness for the university and local residents",
    description:
      "The Gambella University Clean Water Supply Project successfully implemented a sustainable water system, providing safe drinking water to the university and surrounding communities while promoting hygiene education.",
    imageCount: 9,
  },
];

export const PRODUCT_CATEGORIES = [
  "Water Purification",
  "Agricultural Inputs",
  "Laboratory Furniture & Equipment",
  "Industrial Machinery",
  "Renovation Services",
  "Other",
] as const;
