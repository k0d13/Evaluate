import type { Embed } from '@buape/carbon';

/**
 * Get the value of an embed field by name.
 *
 * @param embed The embed to get the field from
 * @param name The name of the field
 * @returns The value of the field, or `undefined` if the field does not exist
 */
export function getEmbedField(embed: Embed, name: string) {
  return embed.fields?.find((f) => f.name.includes(name));
}
