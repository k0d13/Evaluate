import { Piston } from 'piston.ts';

export default new Piston({
  baseUrl: new URL('api/piston', import.meta.env.VITE_PUBLIC_WEBSITE_URL).href,
});
