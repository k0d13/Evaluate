import { Client } from '@buape/carbon';
import { CommandDataPlugin } from '@buape/carbon/command-data';
import { SayPlugin } from '@saykit/carbon';
import { EvaluateCommand } from '#/commands/evaluate.ts';
import { EditEvaluationButton } from '#/components/edit-evaluation-button.ts';
import { EvaluateModal, EvaluateModalEdit } from '#/components/evaluate-modal.ts';
import { ApplicationAuthorisedListener } from '#/events/application-authorised.ts';
import { catalogue } from '#/i18n.ts';

const view = catalogue.locale(catalogue.locales[0]);

const enabled = Boolean(process.env.DISCORD_TOKEN);
if (!enabled) console.warn('Missing Discord bot environment variables, bot will be disabled.');

const client = enabled
  ? new Client(
      {
        baseUrl: new URL('api/discord', process.env.WEBSITE_URL!).href,
        token: process.env.DISCORD_TOKEN!,
        deploySecret: process.env.DISCORD_CLIENT_SECRET!,
        requestOptions: { queueRequests: false },
      },
      {
        commands: [new EvaluateCommand()],
        listeners: [new ApplicationAuthorisedListener()],
        components: [new EditEvaluationButton(view)],
      },
      [new CommandDataPlugin(), new SayPlugin(catalogue)],
    )
  : null;
for (const modal of [new EvaluateModal(view), new EvaluateModalEdit(view)])
  client?.modalHandler.registerModal(modal);

export default client;
