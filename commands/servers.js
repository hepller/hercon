/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Алиасы команды
const aliases = ['servers', 'servs', 'сервера']

// Описание команды
const description = 'Список серверов'

// Функция команды
async function execute(ctx, { db }) {

  // Отправка сообщения пользователю
  ctx.reply([
    '⚙ Список серверов:',
    '',
    db.data.servers.map(server => `${server.name} -- ${server.host}:${server.port}`).join('\n') || ctx.fields_placeholder
  ].join('\n'))
}

// Экспорт команды
export default { aliases, description, execute }