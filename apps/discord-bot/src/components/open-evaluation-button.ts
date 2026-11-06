import { LinkButton } from '@buape/carbon';
import type { View } from 'saykit';
import { resolveEmoji } from '~/helpers/resolve-emoji';
import { withSay } from '~/i18n.js';

export class OpenEvaluationButton extends withSay(LinkButton) {
  public constructor(say: View, url?: string) {
    super({ label: say`Open Evaluation` });
    if (url) this.url = url;
  }
  url = process.env.WEBSITE_URL!;
  emoji = resolveEmoji('globe', true);
}
