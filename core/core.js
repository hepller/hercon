/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Импорт зависимостей
import { VK, Keyboard } from 'vk-io'
import { Low, JSONFile } from 'lowdb'
import Rcon from 'rcon'
import YAML from 'yaml'

// Импорт системных модулей
import { readFileSync, readdirSync } from 'fs'

// Импорт компонентов ядра
import Logger from './logger.js'

// Импорт конфигураций проекта
const config = YAML.parse(readFileSync('config.yml', 'utf8'))
const project = JSON.parse(readFileSync('package.json', 'utf8'))

// Инициализация vk-io
const vk = new VK({ token: config.longpoll.token, pollingGroupId: config.longpoll.group_id, v: config.longpoll.version })

// Инициализация lowdb
const adapter = new JSONFile('servers.json')
const db = new Low(adapter)

// Чтение БД
await db.read()

// Добавление массива серверов в БД (при отсутствии)
db.data ||= {servers: []}

// Сохранение БД
await db.write()

// Сообщение о запуске
Logger.logInfo(`Hercon v${project.version} is running`)

// Сообщение о записи логов в файл
if (config.logging.log_to_file) Logger.logInfo('* Logging to a file is enabled')

// Сообщение о сохранении логов в переменную
if (config.logging.array_length) Logger.logInfo('* Logging to the array is enabled')

// Массив команд
const commands = []

// Обработка найденных файлов
readdirSync('commands/').map(async file => {

  // Фильтрация файлов по расширению (".js")
  if (!file.endsWith('.js')) return

  // Импорт файла команды
  const command = await import(`../commands/${file}`)

  // Добавление команды в массив
  commands.push(command.default)
})

// Сообщение в лог о подключении к VK API
Logger.logInfo('Connecting to the VK API ...')

// Старт получения событий ВК
vk.updates.startPolling().then(() => Logger.logInfo('VK API are connected'))

// Обработка сообщений ВК
vk.updates.on('message_new', ctx => {

  // Игнорирование лишних сообщений
  if (!ctx.isUser || ctx.isOutbox || !ctx.text) return

  // Проверка на наличие у пользователя прав
  if (!config.general.users_ids.includes(ctx.senderId)) return

  // Деление текста на команду и аргументы
  if (config.general.command_symbols.includes(ctx.text[0])) [ctx.cmd, ...ctx.args] = ctx.text.slice(1).split(' ')

  // Деление текста из messagePayload на команду и аргументы (для поддержки клавиатур ВКонтакте)
  if (ctx.messagePayload?.command) [ctx.cmd, ...ctx.args] = ctx.messagePayload.command.split(' ')

  // Игнорирование сообщений без команд
  if (!ctx.cmd) return

  // Поиск команды по алиасам
  const command = commands.find(cmd => cmd.aliases.includes(ctx.cmd.toLowerCase()))

  // Проверка на существование команды
  if (!command) return

  // Проверка источника сообщения (беседа / личные сообщения) (для логирования)
  const is_from_chat = ctx.isChat ? `#${ctx.chatId}: ` : ''

  // Определение команды в payload (для логирования)
  const payload_command = ctx.messagePayload?.command ? `(${ctx.messagePayload?.command})` : ''

  // Сообщение в лог о написании команды
  Logger.logInfo(`${is_from_chat}${ctx.senderId} -> ${ctx.text} ${payload_command}`)

  // Выполнение команды
  command.execute(ctx, { Logger, vk, Keyboard, Rcon, db, config, commands, command })

    // Обработка возможных ошибок
    .catch(error => {

      // Сообщение ошибки в лог
      Logger.logError(error.stack)

      // Сообщение пользователю
      ctx.reply('⚠ При выполнении команды произошла неизвестная ошибка')
    })
})

// Обработка ошибок бота -> логирование
process.on('uncaughtException', (error, origin) => Logger.logError(`${origin} -> ${error.stack}`))