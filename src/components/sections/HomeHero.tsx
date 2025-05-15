'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';

import InvestingPanaImage from '@/assets/images/investing-pana.png';
import InvoiceCuateImage from '@/assets/images/invoice-cuate.png';
import SavingImage from '@/assets/images/saving-money.png';
import savingsCuateImage from '@/assets/images/savings-cuate.png';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export const HomeHero = () => {
  const autoplay = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));

  return (
    <section className="flex h-screen w-full flex-col items-center justify-center bg-system-02 px-6">
      <div className="flex flex-col-reverse items-center justify-center pt-10 lg:flex-row lg:items-center lg:gap-10 lg:pt-0">
        {/* Carousel Start */}
        <div className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[550px]">
          <Carousel plugins={[autoplay.current]} opts={{ loop: true }}>
            <CarouselContent>
              <CarouselItem>
                <Image
                  src={SavingImage}
                  alt="Saving money image"
                  className="rounded-lg object-contain"
                  priority
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src={InvestingPanaImage}
                  alt="Investing image"
                  className="rounded-lg object-contain"
                  priority
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src={savingsCuateImage}
                  alt="Savings image"
                  className="rounded-lg object-contain"
                  priority
                />
              </CarouselItem>
              <CarouselItem>
                <Image
                  src={InvoiceCuateImage}
                  alt="Invoice image"
                  className="rounded-lg object-contain"
                  priority
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        {/* Carousel End */}
        <div className="max-w-xl text-center lg:text-left">
          <h2 className="mb-5 text-3xl font-bold lg:text-4xl">
            懶人記帳首選，無痛養成記帳習慣，原來理財可以很簡單！
          </h2>
          <h3 className="text-lg font-normal text-gray-600 lg:text-xl">
            沒有複雜的功能，立志用最「簡單」的模式來幫助大家養成記帳習慣，
            讓使用者相信只要肯記帳，就能因此改變生活，邁向自由人生！
          </h3>
        </div>
      </div>
    </section>
  );
};
