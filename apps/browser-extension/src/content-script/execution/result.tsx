import { Button } from '@evaluate/components/button';
import { Label } from '@evaluate/components/label';
import { Textarea } from '@evaluate/components/textarea';
import { cn } from 'cn';
import { ExternalLinkIcon } from 'lucide-react';
import type { ExecuteResult, Runtime } from 'piston.ts';
import { makeEditCodePathname, makePickRuntimePathname } from 'piston.ts/evaluate';
import { say } from '#/i18n.ts';

export function ResultDialog({
  runtime,
  options,
  result,
}: {
  runtime: typeof Runtime._output;
  options: { code: string };
  result: typeof ExecuteResult._output;
}) {
  let output = result.output;
  if (result.compile?.expired)
    output = say`Your code compilation exceeded the allotted time and was terminated. Consider optimising your code for faster compilation.`;
  else if (result.run.expired)
    output = say`Your code execution exceeded the allotted time and was terminated. Consider optimising it for better performance.`;

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="output">{say`Output`}</Label>
        <Textarea
          readOnly
          name="output"
          value={output}
          placeholder={say`Your code executed successfully; however, it did not generate any output for the console.`}
          className={cn(
            'min-h-[40vh] w-full resize-none border-2',
            !result.success && 'border-destructive',
            result.output && 'font-mono',
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        {options.code && (
          <Button variant="secondary" asChild>
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={new URL(
                makePickRuntimePathname(options),
                import.meta.env.VITE_PUBLIC_WEBSITE_URL,
              ).toString()}
            >
              <span>{say`Change Runtime`}</span>
              <ExternalLinkIcon size={16} className="ml-1" />
            </a>
          </Button>
        )}

        {options.code && runtime && (
          <Button variant="secondary" asChild>
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={new URL(
                makeEditCodePathname(runtime, options),
                import.meta.env.VITE_PUBLIC_WEBSITE_URL,
              ).toString()}
            >
              <span>{say`Edit Code`}</span>
              <ExternalLinkIcon size={16} className="ml-1" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
