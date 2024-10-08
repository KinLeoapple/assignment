<script setup>
import jQuery from "jquery";
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import 'datatables.net-responsive';
import 'datatables.net-select';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';

DataTable.use(DataTablesCore);

const props = defineProps({
  columns: Array,
  data: Object
});

const options = {
  layout: {
    topStart: {
      buttons: ['pdf', 'print']
    }
  },
  responsive: true,
  select: true,
  bLengthChange: false,
  pageLength: 10,
};
</script>

<template>
  <DataTable
      :columns="props.columns"
      :options="options"
      :data="props.data"
      class="display nowrap"
      :class="{}"
  />
</template>

<style scoped>

</style>