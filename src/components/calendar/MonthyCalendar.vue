<template>
  <div class="cal" v-if="calendar">
    <div class="head">
      <h4>{{ calendar.monthText }}</h4>
      <div class="ctrl">
        <button @click="showPrevMonth">이전</button
        ><button @click="showNextMonth">이후</button>
        <button @click="showCurrentMonth">오늘</button>
      </div>
    </div>
    <div class="seven-days">
      <div class="cell">일</div>
      <div class="cell">월</div>
      <div class="cell">화</div>
      <div class="cell">수</div>
      <div class="cell">목</div>
      <div class="cell">금</div>
      <div class="cell">토</div>
    </div>
    <div class="cal-body">
      <div v-for="week in calendar.weeks" :key="week.id" class="week">
        <div
          v-for="day in week.days"
          :key="day.id"
          class="cell"
          :class="{ other: calendar.month !== day.month }"
        >
          <span class="date">{{ day.dateText }}</span>
          <div class="schedules">
            <div
              v-for="scd in findSchedule(day)"
              :key="scd.seq"
              class="elem"
              :class="{ head: isStart(scd, day), tail: isEnd(scd, day) }"
            >
              {{ scd.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cal from "./index";
import api from "../../service/api";
export default {
  props: ["month"],
  data() {
    return {
      calendar: null,
      schedule: {
        all: [],
        current: [],
      },
    };
  },
  mounted() {
    console.log(this.month);
    this.calendar = cal.buildCalendar(this.month); // "2022-12"
    console.log("[month data]", this.calendar);
    /**
     * this.calendar
     *  [
     *  [day, day, day, ... day ] w0
     *  [day, day, day, ... day ] w0
     *  [day, day, day, ... day ] w0
     *  [day, day, day, ... day ] w0
     *  [day, day, day, ... day ] w0
     *  [day, day, day, ... day ] w0
     * ]
     */
    api.schedule.load().then((res) => {
      this.schedule.all = res;
      this.filterSchedule();
    });
  },
  methods: {
    filterSchedule() {
      const { all } = this.schedule;
      const currents = all.filter((schedule) => {
        const { startAt, endAt } = schedule;
        const [ymd] = startAt.split("T"); // yyyy-mm-dd
        const [yy, mm] = ymd.split("-").map((s) => parseInt(s));
        console.log(yy, mm, endAt);
        return this.calendar.year == yy && this.calendar.month == mm;
      });
      console.log("[schedule]", currents);
      this.schedule.current = currents;
    },
    showPrevMonth() {
      console.log("[이전달]");
      this.calendar = this.calendar.prevMonth();
      this.filterSchedule();
    },
    showNextMonth() {
      console.log("[다음달]");
      this.calendar = this.calendar.nextMonth();
      this.filterSchedule();
    },
    showCurrentMonth() {
      // 오늘 날짜의 달력을 보여줌
    },
    findSchedule(day) {
      const found = this.schedule.current.filter((scd) => {
        /*
          {
          seq: 87233393,
          title: "결혼식3",
          desc: "어쩌구 저쩌구 누구...",
          startAt: "2021-01-02T14:00:00",
          endAt: "2022-01-02T16:00:00",
        },
        */
        const [ymd0] = scd.startAt.split("T"); // start datetime
        const [ymd1] = scd.endAt.split("T"); // end datetime
        // eslint-disable-next-line no-unused-vars
        const [y0, month0, date0] = ymd0.split("-").map((s) => parseInt(s));
        const [y1, month1, date1] = ymd1.split("-").map((s) => parseInt(s));
        console.log(y0, month0, date0);
        console.log(y1, month1, date1);
        const valid =
          day.isAfter(y0, month0, date0) && day.isBefore(y1, month1, date1);
        return valid;
        // return month0 === day.month && date0 == day.date;
      });
      return found;
    },
    isStart(schedule, day) {
      const { year, month, date } = day;
      const [ymd0] = schedule.startAt.split("T"); // start datetime
      const [y0, month0, date0] = ymd0.split("-").map((s) => parseInt(s));
      return year === y0 && month && month0 && date === date0;
    },
    isEnd(schedule, day) {
      const { year, month, date } = day;
      const [ymd0] = schedule.endAt.split("T");
      const [y, m, d] = ymd0.split("-").map((s) => parseInt(s));
      return year === y && month === m && date === d;
    },
  },
};
</script>

<style lang="scss" scoped>
.cal {
  display: flex;
  flex-direction: column;
  height: 100%;
  .head {
    display: flex;
    h4 {
      margin: 0;
      flex: 1 1 auto;
    }
  }
  .seven-days {
    display: flex;
    .cell {
      flex: 1 1 auto;
    }
  }
  .cal-body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    .week {
      display: flex;
      flex: 1 1 auto;
      .cell {
        position: relative;
        flex: 1 1 auto;

        &.other {
          color: #aaa;
        }
        border-right: 1px solid #aaa;
        border-bottom: 1px solid #aaa;
        &:first-child {
          border-left: 1px solid #aaa;
        }
        .date {
          font-size: 12px;
          position: absolute;
          top: 8px;
          left: 8px;
        }
        .schedules {
          position: absolute;
          top: 24px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          .elem {
            background-color: darkgreen;
            color: white;
            font-size: 10px;
            padding: 2px 4px;
            &.head {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
              margin-left: 8px;
              margin-right: -1px;
            }
            &.tail {
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
              margin-right: 8px;
              margin-left: -1px;
            }
            &.head.tail {
              margin-left: 8px;
              margin-right: 8px;
            }
          }
        }
      }
      &:first-child {
        .cell {
          border-top: 1px solid #aaa;
        }
      }
    }
  }
}
</style>
