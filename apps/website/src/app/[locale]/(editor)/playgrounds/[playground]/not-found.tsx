'use client';

import { Button } from '@evaluate/components/button';
import { Say } from '@saykit/react';
import { LocalisedLink } from '#/components/localised-link.tsx';

export default function PlaygroundNotFound() {
  return (
    <div className="mt-[20vh] flex flex-col items-center justify-center">
      <span className="text-8xl font-bold">404</span>
      <h1 className="text-4xl font-bold text-primary">
        <Say>Not Found</Say>
      </h1>
      <p className="text-center text-balance text-muted-foreground">
        <Say>Hmm, we couldn't find the playground you're looking for.</Say>
      </p>

      <div className="mt-2">
        <Button variant="secondary" asChild>
          <LocalisedLink href="/playgrounds">
            <Say>Browse Playgrounds</Say>
          </LocalisedLink>
        </Button>
      </div>
    </div>
  );
}
