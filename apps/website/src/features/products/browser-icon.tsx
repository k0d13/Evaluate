import Image from 'next/image';
import brave from './browsers/brave.svg';
import chrome from './browsers/chrome.svg';
import edge from './browsers/edge.svg';
import firefox from './browsers/firefox.svg';
import opera from './browsers/opera.svg';

const icons = { brave, chrome, edge, firefox, opera };

export function BrowserIcon({ name }: { name: keyof typeof icons }) {
  return (
    <Image
      src={icons[name]}
      alt={name[0]!.toUpperCase() + name.slice(1)}
      className="aspect-square w-6"
      unoptimized
    />
  );
}
