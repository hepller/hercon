/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Алиасы команды
const aliases = ['aliases', 'алиасы']

// Описание команды
const description = 'Алиасы для команд'

// Функция команды
async function execute(ctx, { commands, config }) {

  // Отправка сообщения
  ctx.reply([
    '💬 Алиасы команд:',
    '',
    commands.map(cmd => `${config.general.command_symbols[0]}${cmd.aliases[0]} -- ${cmd.aliases.slice(1).join(', ')}`).join('\n')
  ].join('\n'))
}

// Экспорт команды
export default { aliases, description, execute }