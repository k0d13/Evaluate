import { Button, type ButtonInteraction, ButtonStyle } from '@buape/carbon';
import type { View } from 'saykit';
import { getEvaluateOptions } from '#/helpers/evaluate-helpers.ts';
import { resolveEmoji } from '#/helpers/resolve-emoji.ts';
import { getInteractionContext } from '#/helpers/session-context.ts';
import { withSay } from '#/i18n.ts';
import { captureEvent } from '#/services/posthog.ts';
import { EvaluateModalEdit } from './evaluate-modal';

export class EditEvaluationButton extends withSay(Button) {
  customId = 'evaluate,edit';
  constructor(say: View) {
    super({
      label: say`Edit`,
    });
  }
  style = ButtonStyle.Success;
  emoji = resolveEmoji('pencil', true);

  async run(interaction: ButtonInteraction) {
    captureEvent(getInteractionContext(interaction.rawData), 'clicked_button', {
      button_id: this.customId,
    });

    const embed = interaction.embeds?.[0];
    const options = embed && getEvaluateOptions(embed);
    return interaction.showModal(new EvaluateModalEdit(interaction.say, options));
  }
}
