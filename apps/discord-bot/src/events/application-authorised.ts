import { ApplicationAuthorizedListener, type ListenerEventData } from '@buape/carbon';
import { getUserContext } from '#/helpers/session-context.ts';
import { captureEvent } from '#/services/posthog.ts';

export class ApplicationAuthorisedListener extends ApplicationAuthorizedListener {
  async handle(data: ListenerEventData[this['type']]) {
    if (data.guild)
      captureEvent(getUserContext(data.user), 'installed_app', {
        install_type: 'guild',
        guild_id: data.guild.id,
      });
    else if (data.user)
      captureEvent(getUserContext(data.user), 'installed_app', {
        install_type: 'user',
        user_id: data.user.id,
      });
  }
}
