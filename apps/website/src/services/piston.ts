import { Piston } from 'piston.ts';

export default typeof window !== 'undefined'
  ? new Piston({
      baseUrl: `${window.location.origin}/api/piston`,
    })
  : new Piston({
      apiKey: process.env.PISTON_API_KEY,
    });
