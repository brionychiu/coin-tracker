'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const imageList = [
  { src: '/saving-money.png', alt: 'Saving money image' },
  { src: '/investing-pana.png', alt: 'Investing image' },
  { src: '/coins-amico.png', alt: 'Coins image' },
  { src: '/revenue-bro.png', alt: 'Revenue image' },
  { src: '/invoice-cuate.png', alt: 'Invoice image' },
];

export const HomeHero = () => {
  const autoplay = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));

  return (
    <section className="flex h-screen w-full flex-col items-center justify-center bg-system-02 px-6">
      <div className="flex flex-col-reverse items-center justify-center pt-10 lg:flex-row lg:items-center lg:gap-10 lg:pt-0">
        <div className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[550px]">
          <Carousel plugins={[autoplay.current]} opts={{ loop: true }}>
            <CarouselContent>
              {imageList.map((img) => (
                <CarouselItem key={img.src}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={550}
                    height={550}
                    className="rounded-lg object-contain"
                    priority
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="max-w-xl text-center lg:text-left">
          <h2 className="mb-5 text-3xl font-bold lg:text-4xl">
            快樂輕鬆養成記帳習慣，原來理財可以很簡單！
          </h2>
          <h3 className="text-lg font-normal text-gray-600 lg:text-xl">
            簡易好用的記帳網站，協助使用者輕鬆紀錄日常生活中的收支明細，並以圖表、報表等方式追蹤財務狀況，讓每一筆花費都清楚透明，養成良好的金錢管理習慣。
          </h3>
        </div>
      </div>
    </section>
  );
};
