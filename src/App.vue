<script>
import MonthyCalendar from "./components/calendar/MonthyCalendar.vue";
export default {
  components: {
    MonthyCalendar,
  },
  data() {
    return {};
  },
};
</script>

<template>
  <div class="app-wrapper">
    <MonthyCalendar month="2022-12" />
  </div>
</template>

<style scoped>
.app-wrapper {
  height: 600px;
  padding: 8px;
}
</style>
