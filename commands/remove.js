/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Алиасы команды
const aliases = ['remove', 'rem', 'удалить']

// Описание команды
const description = 'Удаление сервера'

// Использование команды
const usage = '<название>'

// Функция команды
async function execute(ctx, { Keyboard, db }) {

  // Сообщение о некорректном использовании
  if (!ctx.args[0]) return ctx.reply('⛔ Вы не указали название сервера который необходимо удалить')

  // Чтение БД
  await db.read()

  // Создание клавиатуры
  const keyboard = Keyboard.keyboard([
    Keyboard.textButton({
      label: 'Список серверов',
      payload: {
        command: 'servers'
      }
    })
  ])

  // Сообщение об отсутстви сервера с указанным названием
  if (!db.data.servers.find(server => server.name == ctx.args[0])) return ctx.reply(`⚠ Сервера с названием <<${ctx.args[0]}>> не существует`, { keyboard: keyboard.inline(true) })

  // Фильтрация серверов (удаление)
  db.data.servers = db.data.servers.filter(server => server.name != ctx.args[0])

  // Сохранение БД
  await db.write()

  // Сообщение об удалении пользователю
  ctx.reply(`⚙ Сервер <<${ctx.args[0]}>> удален`)
}

// Экспорт команды
export default { aliases, description, usage, execute }