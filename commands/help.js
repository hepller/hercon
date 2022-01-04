/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Алиасы команды
const aliases = ['help', 'помощь', 'usage', 'использование']

// Описание команды
const description = 'Помощь по команде'

// Использование команды
const usage = '<команда>'

// Функция команды
function execute(ctx, {Keyboard, commands, config}) {

  // Создание клавиатуры
  const keyboard = Keyboard.keyboard([
    Keyboard.textButton({
      label: 'Список команд',
      payload: {
        command: 'commands'
      }
    })
  ])

  // Проверка на наличие аргумента
  if (!ctx.args[0]) return ctx.reply('⛔ Укажите команду о которой необходимо получить информацию', {keyboard: keyboard.inline(true)})

  // Получение объекта команды по алиасам
  const command = commands.find(cmd => cmd.aliases.includes(ctx.args[0]))

  // Ошибка при отсутствии указанной команды
  if (!command) return ctx.reply(`⚠ Команды <<${ctx.args[0]}>> не существует`, {keyboard: keyboard.inline(true)})

  // Отправка сообщения
  ctx.reply([
    `📄 Использование команды <<${command.aliases[0]}>>:`,
    '',
    `${config.general.command_symbols[0]}${command.aliases[0]} ${command?.usage}`,
  ].join('\n'))
}

// Экспорт команды
export default {aliases, description, usage, execute}