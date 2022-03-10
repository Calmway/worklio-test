<template>
  <div class="list-wrapper">
    <div
      v-for="(item, index) in listItems"
      :id="`list-item-${index}`"
      :key="index"
      class="list-item"
      @mouseenter="highlight(index)"
      @mouseleave="unhighlight(index)">
      <div v-if="props.found == item.name" class="match-icon">
        <svg
          width="24"
          height="24"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14"
            stroke="currentColor"
            stroke-linecap="round" />

          <path d="M16 7L12 11" stroke="currentColor" stroke-linecap="round" />

          <path
            d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7"
            stroke="currentColor"
            stroke-linecap="round" />
        </svg>
      </div>

      <div class="item-name">
        <p style="margin: 0">{{ item.name }}</p>

        <p class="fs-12" style="margin: 0">
          <span v-if="found == item.name.toLocaleLowerCase()"
            ><span class="green">Exact match</span>, </span
          ><span class="gray">#{{ item.id }}</span>
        </p>
      </div>

      <div class="item-date fs-13">
        <span>{{ item.dateString }}</span>

        <Trash class="removeItem" @click="removeItem(item.name)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Item } from 'Interface';
import { defineComponent, ref, computed } from 'vue';
import Trash from 'components/icons/trash.vue';
import Checked from 'components/icons/check.vue';
export default defineComponent({
  name: 'List',
  components: {
    Trash,

    Checked,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    found: {
      type: String,
    },
  },

  emits: ['removeItem'],
  setup(props: any, { emit }) {
    const listItems = computed(() => props.list);
    function removeItem(name: string) {
      emit('removeItem', name);
    }
    function highlight(index: number) {
      const existElement = document.getElementById(`list-item-${index}`);
      if (!existElement) {
        return;
      }
      existElement.classList.add('active');
    }
    function unhighlight(index: number) {
      const existElement = document.getElementById(`list-item-${index}`);
      if (!existElement) {
        return;
      }
      existElement.classList.remove('active');
    }
    return { listItems, removeItem, props, highlight, unhighlight };
  },
});
</script>

<style lang="scss" scoped>
@import '../sass/_color.scss';
.list-item {
  border-bottom: 1px solid $borderColor;
  border-radius: 6px;
  padding: 17px 20px;

  color: $text;

  :last-child {
    border-bottom: none;
  }

  .active {
    box-shadow: 0px 0px 40px #0000000d;
  }

  div {
    display: inline-block;
  }
  .match-icon {
    width: 5%;
  }
  .item-name {
    width: 55%;
    .green {
      color: $green;
    }
    .gray {
      color: $smallText;
    }
  }
  .item-date {
    float: right;
    width: 30%;
    .removeItem {
      display: none;
      position: relative;
      top: 6px;
    }
  }
  .item-name {
    text-align: left;
  }

  .item-date {
    text-align: right;
  }
}
.list-item:last-child {
  border-bottom: none;
}
.active {
  background: $white;
  box-shadow: 0px 0px 40px #0000000d;
  .removeItem {
    display: inline !important;
  }
}
</style>
