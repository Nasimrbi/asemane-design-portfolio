export interface PortfolioPage {
  id: number;
  title? : string;
  imageUrl? : string; 
  alt?: string;
}

export const PORTFOLIO_PAGES: PortfolioPage[] = [
  { id: 0, title: 'Portfolio' },
  { id: 1, imageUrl: '/Untitled-1 2.jpg', alt: 'Profile and Introduction' },
  { id: 2, imageUrl: '/کارت ویزیت.jpg', alt: 'Business Cards Showcase' },
  { id: 3, imageUrl: '/تراکت سربرگ پاکت.jpg', alt: 'Stationery and Flyers' },
  { id: 4, imageUrl: '/کاتالوگ و بروشور.jpg', alt: 'Catalogs and Brochures' },
  { id: 5, imageUrl: '/بسته بندی.jpg', alt: 'Packaging Designs' },
  { id: 6, imageUrl: '/لایت باکس و استند - Copy.jpg', alt: 'Lightboxes and Stands' },
  { id: 7, imageUrl: '/استند.jpg', alt: 'Rollup and Stands' },
  { id: 8, imageUrl: '/لیبل.jpg', alt: "labels" },
  { id: 9, imageUrl: '/ارتباط با من.jpg', alt: 'Contact Info' },
];