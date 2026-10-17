export interface PortfolioPage {
  id: number;
  imageUrl: string;
  alt: string;
}

export const PORTFOLIO_PAGES: PortfolioPage[] = [
  { id: 0, imageUrl: '/Untitled-1 2.jpg', alt: 'Profile and Introduction' },
  { id: 1, imageUrl: '/کارت ویزیت.jpg', alt: 'Business Cards Showcase' },
  { id: 2, imageUrl: '/تراکت سربرگ پاکت.jpg', alt: 'Stationery and Flyers' },
  { id: 3, imageUrl: '/کاتالوگ و بروشور.jpg', alt: 'Catalogs and Brochures' },
  { id: 4, imageUrl: '/بسته بندی.jpg', alt: 'Packaging Designs' },
  { id: 5, imageUrl: '/لایت باکس و استند - Copy.jpg', alt: 'Lightboxes and Stands' },
  { id: 6, imageUrl: '/استند.jpg', alt: 'Rollup and Stands' },
  { id: 7, imageUrl: '/ارتباط با من.jpg', alt: 'Contact Info' },
];