/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Экспорт функций
export default class Utils {

  /** Возвращает объект со временем */
  static getTime() {

    // Переменные
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()
    let seconds = new Date().getSeconds()

    // Исправление одиночных символов
    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    if (seconds < 10) seconds = `0${seconds}`

    // Возвращение строки
    return { hours: hours, minutes: minutes, seconds: seconds }
  }

  /** Возвращает объект с датой */
  static getDate() {

    // Переменные
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let day = new Date().getDate()

    // Исправление одинарных символов
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day

    // Возвращение строки
    return { day: day, month: month, year: year }
  }
}