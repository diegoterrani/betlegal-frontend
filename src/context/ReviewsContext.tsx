import React, { createContext, useContext, useState } from 'react';
import { BrandReview } from '../data/mockData';
import { apiGet, apiSend } from '../lib/http';

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
  addReview: (input: NewReviewInput) => Promise<void>;
  addReply: (id: number, reply: string) => Promise<void>;
  loadBrand: (slug: string) => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<BrandReview[]>([]);

  const loadBrand = async (slug: string) => {
    const data = await apiGet<{ reviews?: { comment: string; created_at: string; reply: string | null }[] }>(
      `/api/v1/brands/${encodeURIComponent(slug)}/reviews`
    );
    const incoming: BrandReview[] = (data.reviews || []).map((row, index) => ({
      id: Date.parse(row.created_at) || index,
      brandSlug: slug,
      brand: slug,
      authorEmail: '',
      comment: row.comment || '',
      starsSafety: 0,
      starsPayout: 0,
      starsSupport: 0,
      starsSpeed: 0,
      starsResponsible: 0,
      reply: row.reply,
      createdAt: new Date(row.created_at).toLocaleDateString('pt-BR'),
    }));
    setReviews((list) => [...list.filter((item) => item.brandSlug !== slug), ...incoming]);
  };

  const addReview = async (input: NewReviewInput) => {
    await apiSend(`/marca/${encodeURIComponent(input.brandSlug)}/avaliar`, 'POST', {
      stars_safety: input.starsSafety,
      stars_payout: input.starsPayout,
      stars_support: input.starsSupport,
      stars_speed: input.starsSpeed,
      stars_responsible: input.starsResponsible,
      comment: input.comment,
    });
    await loadBrand(input.brandSlug);
  };

  const addReply = async (id: number, reply: string) => {
    await apiSend('/api/v1/operator/replies', 'POST', { reviewId: id, body: reply });
    setReviews((list) => list.map((item) => (item.id === id ? { ...item, reply } : item)));
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, addReply, loadBrand }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within a ReviewsProvider');
  return context;
};
