/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Алиасы команды
const aliases = ['add', 'добавить', 'доб']

// Описание команды
const description = 'Добавление сервера'

// Использование команды
const usage = '<название> <хост>:<порт> <пароль>'

// Функция команды
async function execute(ctx, { Keyboard, db }) {

  // Создание клавиатуры
  const keyboard = Keyboard.keyboard([
    Keyboard.textButton({
      label: 'Помощь',
      payload: {
        command: `help ${aliases[0]}`
      }
    })
  ])

  // Получение хоста и порта
  const host = ctx.args[1]?.split(':')[0]
  const port = ctx.args[1]?.split(':')[1]

  // Сообщение о некорректном использовании
  if (!ctx.args[0] || !ctx.args[2] || !host || !port) return ctx.reply('⛔ Недостаточно параметров', {keyboard: keyboard.inline(true)})

  // Чтение БД
  await db.read()

  // Поиск совпадающих названий серверов в БД
  if (db.data.servers.find(server => server.name == ctx.args[0])) return ctx.reply(`⚠ Сервер с названием <<${ctx.args[0]}>> уже добавлен`)

  // Добавление сервера в БД
  db.data.servers.push({ name: ctx.args[0], host: host, port: Number(port), password: ctx.args[2] })

  // Сохранение БД
  await db.write()

  // Сообщение о добавлении пользователю
  ctx.reply(`⚙ Сервер <<${ctx.args[0]}>> добавлен`)
}

// Экспорт команды
export default { aliases, description, usage, execute }