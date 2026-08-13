"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { ThumbsUp, ThumbsDown, Sparkles, Smile } from "lucide-react";
import { StarRating } from "../ui/star-rating";
import { Avatar } from "../dashboard/avatar";

const TAG_ICONS = { sparkles: Sparkles, smile: Smile } as const;

export interface ReviewTag {
  label: string;
  icon: keyof typeof TAG_ICONS;
}

export interface ReviewData {
  name: string;
  location: string;
  timeAgo: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  date: string;
  price: number;
  crowdLevel: string;
  text: string;
  photos: StaticImageData[];
  tags: ReviewTag[];
  likes: number;
  dislikes: number;
}

export function ReviewCard({ review }: { review: ReviewData }) {
  const [likes, setLikes] = useState(review.likes);
  const [dislikes, setDislikes] = useState(review.dislikes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  function vote(direction: "up" | "down") {
    if (voted === direction) return;
    if (direction === "up") {
      setLikes((n) => n + 1);
      if (voted === "down") setDislikes((n) => n - 1);
    } else {
      setDislikes((n) => n + 1);
      if (voted === "up") setLikes((n) => n - 1);
    }
    setVoted(direction);
  }

  const extraPhotos = review.photos.length > 4 ? review.photos.length - 3 : 0;
  const visiblePhotos = extraPhotos > 0 ? review.photos.slice(0, 3) : review.photos;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <Avatar name={review.name} size={48} />
        <div>
          <p className="text-sm font-medium text-[#060606]">
            {review.name}, {review.location}
          </p>
          <p className="text-xs text-[#939393]">{review.timeAgo}</p>
        </div>
      </div>
      {review.verified && (
        <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          Verified User
        </span>
      )}

      <div className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
        <div>
          <p className="mb-1 text-xs text-[#939393]">Rating</p>
          <StarRating rating={review.rating} count={review.reviewCount} size={16} textClassName="text-[#060606]" />
        </div>
        <div>
          <p className="mb-1 text-xs text-[#939393]">Date</p>
          <p className="text-sm font-medium text-[#060606]">{review.date}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[#939393]">Price</p>
          <p className="text-sm font-medium text-[#060606]">{"¢".repeat(review.price)}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[#939393]">Crowd Level</p>
          <span className="inline-flex rounded-full border border-brand-red bg-brand-red/10 px-3 py-1 text-xs font-medium text-brand-red">
            {review.crowdLevel}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs text-[#939393]">Review</p>
        <p className="text-sm leading-relaxed text-[#060606]">{review.text}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {visiblePhotos.map((photo, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8]">
            <Image src={photo} alt="" fill className="object-cover" />
          </div>
        ))}
        {extraPhotos > 0 && (
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8]">
            <Image src={review.photos[3]} alt="" fill className="object-cover brightness-50" />
            <div className="absolute inset-0 flex items-center justify-center text-lg font-medium text-white">
              {extraPhotos}+
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#606060]">
        {review.tags.map((tag) => {
          const Icon = TAG_ICONS[tag.icon];
          return (
            <span key={tag.label} className="flex items-center gap-1.5">
              <Icon size={16} className="text-[#606060]" />
              {tag.label}
            </span>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => vote("up")}
          className={`flex items-center gap-1.5 text-sm font-medium ${voted === "up" ? "text-brand-red" : "text-[#606060]"}`}
        >
          <ThumbsUp size={16} />
          {likes}
        </button>
        <button
          type="button"
          onClick={() => vote("down")}
          className={`flex items-center gap-1.5 text-sm font-medium ${voted === "down" ? "text-brand-red" : "text-[#606060]"}`}
        >
          <ThumbsDown size={16} />
          {dislikes}
        </button>
      </div>
    </div>
  );
}
