'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@evaluate/components/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import screenshot1 from './browser-extension-1.png';
import screenshot2 from './browser-extension-2.png';

export function ImageCarousel() {
  return (
    <div className="flex items-center justify-center">
      <Carousel
        className="max-w-xl"
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 4000, stopOnMouseEnter: true })]}
      >
        <CarouselContent>
          <CarouselItem className="flex items-center justify-center">
            <Image
              alt="Evaluate Browser Extension Screenshot 1"
              src={screenshot1}
              className="rounded-xl border"
            />
          </CarouselItem>
          <CarouselItem className="flex items-center justify-center">
            <Image
              alt="Evaluate Browser Extension Screenshot 2"
              src={screenshot2}
              className="rounded-xl border"
            />
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
