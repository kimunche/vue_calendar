/**
 * MVC
 * ^
 * model 관련 기능들
 *
 */
const ONE_DAY_MILLIS = 1 * 24 * 60 * 60 * 1000;
class Day {
  constructor(year, month, date) {
    this.year = year;
    this.month = month;
    this.date = date;
    const d = new Date();
    d.setFullYear(year);
    d.setMonth(month - 1);
    d.setDate(date);
    this.d = d;
  }
  get id() {
    const { year, month, date } = this;
    return `${year}-${month}-${date}`; // '2022-12-1'
  }
  get dateText() {
    const day = this.date;
    if (day < 10) {
      return "0" + day;
    } else {
      return day;
    }
  }
  /**
   * 현재 날짜의 이전 날을 반환함
   */
  prevDay() {
    // refactoring; 코드 손봐야 함 아래 메소드와 중복 코드가 있음!!
    const millis = this.d.getTime();
    const ysd = new Date(millis - ONE_DAY_MILLIS);
    const year = ysd.getFullYear();
    const month = ysd.getMonth() + 1;
    const date = ysd.getDate();
    return new Day(year, month, date);
  }
  /**
   * 현재 날짜의 다음 날을 반환함
   */
  nextDay() {
    const millis = this.d.getTime();
    const tmr = new Date(millis + ONE_DAY_MILLIS);
    const year = tmr.getFullYear();
    const month = tmr.getMonth() + 1;
    const date = tmr.getDate();
    return new Day(year, month, date);
  }
  // y:2022, m:12, d:19
  isAfter(y, m, d) {
    const { year, month, date } = this; // 2022, 12, 18
    if (year > y) {
      return false;
    }
    if (month > m) {
      return false;
    }
    return date >= d;
  }
  isBefore(y, m, d) {
    const { year, month, date } = this; // 2022, 12, 18
    if (year < y) {
      return false;
    }
    if (month < m) {
      return false;
    }
    return date <= d;
  }
}

class Week {
  constructor(sevenDays) {
    this.days = sevenDays;
  }
  get id() {
    // javascript 문법: 메소드가 아니에요. week.id() 로 쓰면 안됨!!
    const sunday = this.days[0];
    const { year, month, date } = sunday;
    return `${year}-${month}-${date}`; // '2022-12-1'
  }
  nextWeek() {
    // first day of next week
    const fdnw = this.days[this.days.length - 1].nextDay();
    const nextWeek = buildWeek(fdnw);
    return nextWeek;
  }
}

class Month {
  constructor(year, month, weeks) {
    this.year = year;
    this.month = month;
    this.weeks = weeks;
  }
  get monthText() {
    // yyyy-mm
    return this.year + "-" + (this.month < 10 ? "0" + this.month : this.month);
  }
  /**
   * 이전달의 달력 데이터를 반환해줌
   */
  prevMonth() {
    // return new Month(year, month, ddd);
    const fdlm = this.weeks[0].days[0];
    // last day of prev month
    const ldpm = fdlm.prevDay();
    const { year, month } = ldpm;
    const yyyymm = `${year}-${month}`;
    return buildCalendar(yyyymm);
  }
  nextMonth() {
    // return ...
    // 이번달의 마지막 날을 가져옴
    // 마지막 날로 첫번째 주를 가져옴
    // 6개를 채움
    // first day of next month;
    const fdnm = this.weeks[this.weeks.length - 1].days[6]; // Day
    const { year, month } = fdnm; // 2023, 1
    const yyyymm = `${year}-${month}`;
    return buildCalendar(yyyymm);
  }
}
/**
 * 주어진 day가 속한 일주일 데이터를 생성합니다.
 * @param {Day} day
 */
const buildWeek = (day) => {
  const days = [day]; // 7개를 채울겁니다.

  let offset = day.d.getDay(); // 앞에 있는 날짜 갯수
  while (offset > 0) {
    const prev = days[0].prevDay();
    days.unshift(prev); // 배열의 앞에 넣음!!
    offset--;
  }
  while (days.length < 7) {
    const next = days[days.length - 1].nextDay();
    days.push(next);
  }
  console.log(days);
  return new Week(days);
};
const buildCalendar = (ym) => {
  console.log("[달력 만들기]", ym);
  // ref: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  const [year, month] = ym.split("-").map((s) => parseInt(s));
  // const year = arr[0];
  // const month = arr[1];

  const firstDay = new Day(year, month, 1); // 12-01
  const firstWeek = buildWeek(firstDay);
  console.log(firstWeek);

  const weeks = [firstWeek]; // 6개를 담아야 함!!!
  while (weeks.length < 6) {
    const nextWeek = weeks[weeks.length - 1].nextWeek();
    weeks.push(nextWeek);
  }
  return new Month(year, month, weeks);
  // firstDay.prevDay().prevDay(); // 2022-11-29
};

export default {
  buildCalendar,
};
