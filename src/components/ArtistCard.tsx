// src/components/ArtistCard.tsx
import React, { type ReactElement, useState } from 'react';
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Chip } from "@nextui-org/chip";
import type { Artist, Platform } from '../types/artist';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const artistPath = artist.id.replace(/\.(mdx|md)$/, '');

  return (
    <Card 
      isPressable
      isHoverable
      className="w-full h-[300px] group relative overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
      as="div"
      onPress={() => window.location.href = `/artists/${artistPath}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景图片 */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={artist.background}
          alt={`${artist.name}'s background`}
          className="w-full h-full object-cover transform transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-80" />
      </div>

      {/* 内容区域 */}
      <CardBody className="relative z-10 flex flex-col justify-between h-full p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={artist.avatar}
              size="lg"
              className="ring-2 ring-white/50 group-hover:ring-white transition-all duration-300 w-16 h-16"
              isBordered
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                {artist.name}
              </h3>
            </div>
          </div>
        </div>

        {/* 社交链接和加入时间 */}
        <div className="flex justify-between items-end">
          <div className="flex gap-2">
            {artist.socialLinks.map((link) => (
              <Tooltip
                key={link.platform}
                content={`${link.platform}: ${link.username}`}
                placement="top"
              >
                <Link
                  href={link.url}
                  target="_blank"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PlatformIcon platform={link.platform} />
                </Link>
              </Tooltip>
            ))}
          </div>
          <div className="text-white/60 text-sm">
            {new Date(artist.joinDate).toLocaleDateString()}
          </div>
        </div>

      </CardBody>
    </Card>
  );
};

// PlatformIcon 组件保持不变
// 平台图标组件
const PlatformIcon: React.FC<{ platform: Platform }> = ({ platform }) => {
  const icons: Record<Platform, ReactElement> = {
    Fanbox: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.8 14.4h-4.8v4.8H7.2v-4.8H2.4V9.6h4.8V4.8h4.8v4.8h4.8v4.8zM21.6 0H2.4C1.08 0 0 1.08 0 2.4v19.2C0 22.92 1.08 24 2.4 24h19.2c1.32 0 2.4-1.08 2.4-2.4V2.4C24 1.08 22.92 0 21.6 0z"/>
      </svg>
    ),
    Patreon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z"/>
      </svg>
    ),
    Pixiv: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.935 0A4.924 4.924 0 0 0 0 4.935v14.13A4.924 4.924 0 0 0 4.935 24h14.13A4.924 4.924 0 0 0 24 19.065V4.935A4.924 4.924 0 0 0 19.065 0zm7.81 4.547c2.181 0 4.058.676 5.399 1.847a6.118 6.118 0 0 1 2.116 4.66c.005 1.854-.88 3.476-2.257 4.563-1.375 1.092-3.225 1.697-5.258 1.697-2.314 0-4.46-.842-4.46-.842v2.718c.397.116 1.048.365.635.779H5.79c-.41-.41.233-.66.633-.777V7.666c-1.294-.126-.633-.637-.633-.637h3.462v1.973s1.525-.714 3.493-.714c3.04 0 5.527 1.288 5.527 3.89 0 2.505-2.488 3.887-5.527 3.887-2.217 0-3.493-.866-3.493-.866v-6.88c-1.294-.125-.633-.636-.633-.636h3.462v2.063c.766-.591 2.19-.985 3.493-.985 2.217 0 3.493.866 3.493.866v1.973c0 .637-.436 1.026-1.164 1.026-.995 0-1.164-.39-1.164-1.026V9.933c-.766.591-2.19.985-3.493.985-2.217 0-3.493-.866-3.493-.866V6.642c.766-.591 2.19-.985 3.493-.985z"/>
      </svg>
    ),
    Twitter: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    ArtStation: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.164-1.333H9.03l14.97 25.94L24 17.748zm-19.886-7.41l5.443-9.44h-.001L6.664 5.239 2.038 13.21l2.076 3.129h.001z"/>
      </svg>
    )
  };

  return icons[platform] || null;
};
