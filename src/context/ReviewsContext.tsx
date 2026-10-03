import React, { createContext, useContext, useState } from 'react';
import { BrandReview, INITIAL_BRAND_REVIEWS } from '../data/mockData';

interface NewReviewInput {
  brandSlug: string;
  brand: string;
  authorEmail: string;
  comment: string;
  starsSafety: number;
  starsPayout: number;
  starsSupport: number;
  starsSpeed: number;
  starsResponsible: number;
}

interface ReviewsContextType {
  reviews: BrandReview[];
  addReview: (input: NewReviewInput) => void;
  addReply: (id: number, reply: string) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<BrandReview[]>(INITIAL_BRAND_REVIEWS);

  const addReview = (input: NewReviewInput) => {
    const review: BrandReview = {
      id: Date.now(),
      reply: null,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      ...input,
    };
    setReviews((list) => [review, ...list]);
  };

  const addReply = (id: number, reply: string) => {
    setReviews((list) => list.map((r) => (r.id === id ? { ...r, reply } : r)));
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, addReply }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
