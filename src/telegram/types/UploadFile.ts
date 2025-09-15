export interface AbonentRow {
  ["№"]: number;
  ["Л/С"]: number;
  ["ФИО абонента"]: string;
  ["Адрес"]: string;
  ["Номер кадастра"]: string;
  ["Общая площадь"]: number;
  ["Сальдо на начало периода"]: number;
  ["Начислено"]: number;
  ["Всего оплачено"]: number;
  ["Проче начисления(измененных салдо)"]: number;
  ["Сальдо на конец периода"]: number;
  phone?: string;
}