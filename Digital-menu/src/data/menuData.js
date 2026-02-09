
// Import local images
import imgSnacks from '../assets/category/snacks.jpeg';
import imgRolls from '../assets/category/rolls.jpeg';
import imgMoms from '../assets/category/momo.jpeg';
import imgChineseChicken from '../assets/category/chicken_chilli.jpeg';
import imgLajwabChicken from '../assets/category/chicken_main.jpeg';
import imgBiryani from '../assets/category/biryani.jpeg';
import imgTandoori from '../assets/category/tandoori.jpeg';
import imgRice from '../assets/category/rice.jpeg';
import imgNoodles from '../assets/category/noodles.jpeg';
import imgSoup from '../assets/category/soup.jpeg';
import imgFish from '../assets/category/fish.jpeg';
import imgRoti from '../assets/category/roti.jpeg';
import imgThukpa from '../assets/category/thukpa.jpeg';
import imgMutton from '../assets/category/mutton.jpeg';

// Placeholder for missing images
const getPlaceholder = (text) => `https://placehold.co/100x100/1E1E1E/D4AF37?text=${text}`;

export const categories = [
  { id: 'snacks', name: 'Snacks', image: imgSnacks },
  { id: 'rolls', name: 'Rolls', image: imgRolls },
  { id: 'momos', name: 'Momos', image: imgMoms },
  { id: 'chinese_chicken', name: 'Chinese Chicken', image: imgChineseChicken },
  { id: 'lajwab_chicken', name: 'Lajwab Chicken', image: imgLajwabChicken },
  { id: 'mutton', name: 'Mutton', image: imgMutton },
  { id: 'biryani_pulao', name: 'Biryani & Pulao', image: imgBiryani },
  { id: 'tandoori', name: 'Tandoori & Kabab', image: imgTandoori },
  { id: 'rice', name: 'Rice', image: imgRice },
  { id: 'noodles', name: 'Noodles', image: imgNoodles },
  { id: 'soup', name: 'Soup', image: imgSoup },
  { id: 'fish', name: 'Fish & Prawn', image: imgFish },
  { id: 'thukpa', name: 'Thukpa', image: imgThukpa },
  { id: 'roti', name: 'Roti & Naan', image: imgRoti },
];

export const products = {
  snacks: [
    { id: 101, name: 'Tea', price: 20 },
    { id: 102, name: 'Coffee', price: 30 },
    { id: 103, name: 'Egg Pakora', price: 60 },
    { id: 104, name: 'Paneer Pakora (6 pcs)', price: 100 },
    { id: 105, name: 'Paneer Pakora (8 pcs)', price: 120 },
    { id: 106, name: 'Chicken Pakora (6 pcs)', price: 120 },
    { id: 107, name: 'Chicken Pakora (8 pcs)', price: 150 },
    { id: 108, name: 'French Fries', price: 120 },
    { id: 109, name: 'Honey Chilli Potato', price: 180 },
    { id: 110, name: 'Sweet Corn Soup', price: 80 },
    { id: 111, name: 'Veg Soup', price: 60 },
    { id: 112, name: 'Chicken Corn Soup', price: 100 },
  ],
  rolls: [
    { id: 201, name: 'Veg Roll', price: 80 },
    { id: 202, name: 'Egg Roll', price: 90 },
    { id: 203, name: 'Chicken Roll', price: 100 },
    { id: 204, name: 'Paneer Roll', price: 100 },
    { id: 205, name: 'Double Egg Roll', price: 120 },
    { id: 206, name: 'Chicken Cheese Roll', price: 120 },
    { id: 207, name: 'Egg Chicken Roll', price: 120 },
    { id: 208, name: 'Double Chicken Roll', price: 140 },
    { id: 209, name: 'Lajeez Special Roll', price: 150 },
  ],
  momos: [
    { id: 301, name: 'Veg Steamed Momo', price: 80 },
    { id: 302, name: 'Veg Fried Momo', price: 100 },
    { id: 303, name: 'Chicken Steamed Momo', price: 100 },
    { id: 304, name: 'Chicken Fried Momo', price: 120 },
    { id: 305, name: 'Paneer Momo', price: 120 },
  ],
  chinese_chicken: [
    { id: 401, name: 'Chicken Chilli', price: 200 },
    { id: 402, name: 'Chicken Manchurian', price: 200 },
    { id: 403, name: 'Chicken Chowmein', price: 180 },
    { id: 404, name: 'Chicken Fried Rice', price: 180 },
    { id: 405, name: 'Chicken Noodles', price: 180 },
    { id: 406, name: 'Chicken Lollipop', price: 220 },
  ],
  lajwab_chicken: [
    { id: 501, name: 'Chicken Curry (Half)', price: 200 },
    { id: 502, name: 'Chicken Curry (Full)', price: 350 },
    { id: 503, name: 'Chicken Masala (Half)', price: 220 },
    { id: 504, name: 'Chicken Masala (Full)', price: 380 },
    { id: 505, name: 'Chicken Kasha (Half)', price: 200 },
    { id: 506, name: 'Chicken Kasha (Full)', price: 350 },
    { id: 507, name: 'Chicken Bhuna (Half)', price: 220 },
    { id: 508, name: 'Chicken Bhuna (Full)', price: 380 },
    { id: 509, name: 'Chicken Do Pyaza (Half)', price: 200 },
    { id: 510, name: 'Chicken Do Pyaza (Full)', price: 350 },
    { id: 511, name: 'Chicken Handi (Half)', price: 250 },
    { id: 512, name: 'Chicken Handi (Full)', price: 450 },
    { id: 513, name: 'Butter Chicken (Half)', price: 250 },
    { id: 514, name: 'Butter Chicken (Full)', price: 450 },
    { id: 515, name: 'Chicken Kali Mirch (Half)', price: 260 },
    { id: 516, name: 'Chicken Kali Mirch (Full)', price: 480 },
  ],
  mutton: [
    { id: 601, name: 'Mutton Curry (Half)', price: 350 },
    { id: 602, name: 'Mutton Curry (Full)', price: 650 },
    { id: 603, name: 'Mutton Masala (Half)', price: 380 },
    { id: 604, name: 'Mutton Masala (Full)', price: 700 },
    { id: 605, name: 'Mutton Kasha (Half)', price: 380 },
    { id: 606, name: 'Mutton Kasha (Full)', price: 700 },
  ],
  biryani_pulao: [
    { id: 701, name: 'Chicken Dum Biryani (Half)', price: 150 },
    { id: 702, name: 'Chicken Dum Biryani (Full)', price: 250 },
    { id: 703, name: 'Chicken Biryani (Half)', price: 180 },
    { id: 704, name: 'Chicken Biryani (Full)', price: 300 },
    { id: 705, name: 'Mutton Biryani (Half)', price: 260 },
    { id: 706, name: 'Mutton Biryani (Full)', price: 500 },
    { id: 707, name: 'Veg Biryani (Half)', price: 120 },
    { id: 708, name: 'Veg Biryani (Full)', price: 220 },
    { id: 709, name: 'Egg Biryani (Half)', price: 130 },
    { id: 710, name: 'Egg Biryani (Full)', price: 230 },
    { id: 711, name: 'Chicken Pulao', price: 200 },
    { id: 712, name: 'Veg Pulao', price: 150 },
  ],
  tandoori: [
    { id: 801, name: 'Tandoori Chicken (Half)', price: 220 },
    { id: 802, name: 'Tandoori Chicken (Full)', price: 400 },
    { id: 803, name: 'Chicken Tikka', price: 180 },
    { id: 804, name: 'Chicken Malai', price: 180 },
    { id: 805, name: 'Chicken Reshmi', price: 180 },
    { id: 806, name: 'Chicken Tangdi', price: 180 },
    { id: 807, name: 'Chicken Afghani', price: 180 },
  ],
  rice: [
    { id: 901, name: 'Veg Fried Rice', price: 140 },
    { id: 902, name: 'Egg Fried Rice', price: 150 },
    { id: 903, name: 'Chicken Fried Rice', price: 160 },
    { id: 904, name: 'Garlic Fried Rice', price: 130 },
    { id: 905, name: 'Schezwan Fried Rice', price: 160 },
    { id: 906, name: 'Mixed Fried Rice', price: 180 },
    { id: 907, name: 'Prawn Fried Rice', price: 190 },
    { id: 908, name: 'Paneer Fried Rice', price: 150 },
    { id: 909, name: 'Lajeez Special Fried Rice', price: 180 },
  ],
  noodles: [
    { id: 1001, name: 'Veg Hakka Noodles', price: 140 },
    { id: 1002, name: 'Egg Noodles', price: 150 },
    { id: 1003, name: 'Chicken Noodles', price: 170 },
    { id: 1004, name: 'Schezwan Noodles', price: 160 },
    { id: 1005, name: 'Prawn Noodles', price: 190 },
    { id: 1006, name: 'Paneer Noodles', price: 150 },
    { id: 1007, name: 'Lajeez Special Noodles', price: 180 },
  ],
  soup: [
    { id: 1101, name: 'Veg Soup', price: 90 },
    { id: 1102, name: 'Hot & Sour Soup', price: 150 },
    { id: 1103, name: 'Manchow Soup', price: 150 },
    { id: 1104, name: 'Sweet Corn Soup', price: 140 },
    { id: 1105, name: 'Lemon Soup', price: 140 },
    { id: 1106, name: 'Lajeez Special Soup', price: 180 },
  ],
  fish: [
    { id: 1201, name: 'Fish Fry', price: 180 },
    { id: 1202, name: 'Fish Orly', price: 200 },
    { id: 1203, name: 'Chilli Fish (Dry / Gravy)', price: 220 },
    { id: 1204, name: 'Prawn Salt & Pepper Dry', price: 250 },
  ],
  thukpa: [
    { id: 1301, name: 'Veg Thupa', price: 150 },
    { id: 1302, name: 'Chicken Thupa', price: 150 },
  ],
  roti: [
    { id: 1401, name: 'Plain Roti', price: 10 },
    { id: 1402, name: 'Butter Roti', price: 15 },
    { id: 1403, name: 'Plain Naan', price: 20 },
    { id: 1404, name: 'Butter Naan', price: 25 },
  ],
};
