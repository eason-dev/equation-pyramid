"use client";

import Link from "next/link";
import { Typography } from "@/components/Typography";
import { useButtonSound } from "@/hooks/useButtonSound";

export default function AboutPage() {
  const { playButtonSound } = useButtonSound();

  const handleLinkClick = () => {
    playButtonSound();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      {/* Close Button */}
      <div className="fixed top-6 right-6 z-20">
        <Link href="/" onClick={handleLinkClick}>
          <div className="w-12 h-12 bg-black bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-60 transition-colors cursor-pointer">
            <svg width="19.5" height="19.5" viewBox="0 0 20 20" fill="none">
              <title>Close</title>
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-24 max-w-4xl w-full">
        {/* Title */}
        <Typography variant="h1" className="text-white text-center">
          About
        </Typography>

        {/* Content Sections */}
        <div className="flex flex-col gap-6 w-full">
          {/* Inspiration Section */}
          <div className="bg-black bg-opacity-80 border border-blue-300 border-opacity-75 rounded-xl p-6">
            <Typography variant="h2" className="text-white text-center mb-4">
              Inspiration
            </Typography>
            <Typography variant="p2" className="text-white text-left">
              This is a game inspired by The Devil&apos;s Plan season 2 on
              Netflix. We played this game along with the participants in the
              show and really enjoyed it. So we decided to make it possible to
              let more people enjoy this game. Hope you like it :)
            </Typography>
          </div>

          {/* Contributors Section */}
          <div className="bg-black bg-opacity-80 border border-blue-300 border-opacity-75 rounded-xl p-6">
            <Typography variant="h2" className="text-white text-center mb-4">
              Contributors
            </Typography>
            <Typography variant="p2" className="text-white text-left mb-4">
              We are a couple who made this game together. Feel free to visit
              our LinkedIn or website down below!
            </Typography>

            {/* Contributors List */}
            <div className="flex flex-wrap gap-10 justify-center">
              {/* Eason */}
              <div className="flex items-center gap-4">
                <div className="w-18 h-18 bg-gray-300 rounded-full" />
                <div className="flex flex-col justify-center gap-2">
                  <Typography variant="p2" className="text-white text-center">
                    Eason
                  </Typography>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleLinkClick}
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="Website"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title>Website</title>
                        <path d="M2 2V18H18V2H2ZM16 16H4V4H16V16ZM6 6H14V8H6V6ZM6 10H14V12H6V10Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleLinkClick}
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="LinkedIn"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <title>LinkedIn</title>
                        <path d="M15.4 3H2.6C1.7 3 1 3.7 1 4.6V13.4C1 14.3 1.7 15 2.6 15H15.4C16.3 15 17 14.3 17 13.4V4.6C17 3.7 16.3 3 15.4 3ZM15 13H3V5H15V13ZM5 7H13V9H5V7ZM5 11H11V13H5V11Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Carol */}
              <div className="flex items-center gap-4">
                <div className="w-18 h-18 bg-gray-300 rounded-full" />
                <div className="flex flex-col justify-center gap-2">
                  <Typography variant="p2" className="text-white text-center">
                    Carol
                  </Typography>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleLinkClick}
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="Website"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <title>Website</title>
                        <path d="M2 2V18H18V2H2ZM16 16H4V4H16V16ZM6 6H14V8H6V6ZM6 10H14V12H6V10Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleLinkClick}
                      className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
                      title="LinkedIn"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="currentColor"
                      >
                        <title>LinkedIn</title>
                        <path d="M15.4 3H2.6C1.7 3 1 3.7 1 4.6V13.4C1 14.3 1.7 15 2.6 15H15.4C16.3 15 17 14.3 17 13.4V4.6C17 3.7 16.3 3 15.4 3ZM15 13H3V5H15V13ZM5 7H13V9H5V7ZM5 11H11V13H5V11Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
