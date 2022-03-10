<template>
  <div class="container">
    <div class="center-side">
      <Search :list="list" @add-item="addItem" @found-matched="foundMatched" />

      <List :list="list" :found="found" @remove-item="removeItem" />
    </div>

    <div class="right-side">
      <div class="sorting-wrapper">
        <div
          v-for="option in sortOptions"
          :key="option.name"
          class="sort-item fs-13"
          :class="option.active ? 'active-sort' : ''"
          @click="changeSorting(option.name)">
          <span>{{ option.name }}</span>

          <div v-if="option.active" class="circle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

import Search from 'components/search.vue';

import List from 'components/list.vue';

import { Item } from 'Interface';

import { formatDistance, subDays } from 'date-fns';

import _ from 'lodash';

export default defineComponent({
  name: 'App',

  components: {
    Search,

    List,
  },

  setup() {
    const list = ref<Item[]>([]);

    const found = ref('');

    const refreshPerion = 5000;

    const sortOptions = ref([
      {
        id: 1,

        name: 'Sort by Value',

        active: true,
      },

      {
        id: 2,

        name: 'Sort by Added Date',

        active: false,
      },
    ]);

    if (localStorage.getItem('customList')) {
      list.value = _.sortBy(
        JSON.parse(localStorage.getItem('customList') || ''),

        [(item) => item.name.toLocaleLowerCase()],

        ['desc']
      );
    }

    function saveToLocalStorage(list: Item[]) {
      localStorage.setItem('customList', JSON.stringify(list));
    }

    function updatePersonDate() {
      if (list.value.length > 0) {
        list.value.forEach((item) => {
          item.dateString = formatDistance(new Date(item.date), new Date(), {
            addSuffix: true,
          });
        });
      }

      saveToLocalStorage(list.value);

      setTimeout(() => {
        updatePersonDate();

        console.log("items' dates updated");
      }, refreshPerion);
    }

    function addItem(item: string) {
      const newPerson = new Item();

      newPerson.name = item;

      let max = 0;

      if (list.value.length > 0) {
        max = list.value.reduce((p: Item, c: Item) => (p.id > c.id ? p : c)).id;
      }

      newPerson.id = max + 1;

      list.value.push(newPerson);

      updatePersonDate();

      saveToLocalStorage(list.value);
    }

    function removeItem(name: string) {
      list.value.splice(
        list.value.findIndex((x: Item) => x.name === name),

        1
      );

      if (list.value.length > 0) {
        saveToLocalStorage(list.value);
      } else {
        localStorage.removeItem('customList');
      }
    }

    function foundMatched(foundName: string) {
      found.value = foundName;
    }

    function changeSorting(name: string) {
      const foundOption = sortOptions.value.find((x) => x.name === name);

      if (!foundOption) {
        return;
      }

      sortOptions.value.forEach((option) => {
        option.active = false;
      });

      foundOption.active = true;

      if (foundOption.name === 'Sort by Value') {
        list.value = _.sortBy(
          list.value,

          [(item) => item.name.toLocaleLowerCase()],

          ['desc']
        );
      } else {
        list.value = list.value.sort(function (a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }
    }

    updatePersonDate();

    return {
      list,

      addItem,

      removeItem,

      foundMatched,

      found,

      sortOptions,

      changeSorting,
    };
  },
});
</script>

<style lang="scss">
button,
a,
input {
  outline: none;
}

svg {
  cursor: pointer;
}

body {
  font-family: 'Open Sans';
}

@import './sass/_color.scss';

.container {
  background: $backgroundGradient;

  opacity: 1;

  min-height: 100vh;

  padding: 100px 300px;

  font-size: 14px;

  display: flex;

  justify-content: center;

  .center-side {
    width: 60%;
  }

  .list-wrapper {
    margin-top: 30px;
  }

  .sorting-wrapper {
    min-width: 200px;

    margin-top: 90px;

    margin-left: 60px;

    .sort-item {
      cursor: pointer;

      margin-bottom: 5px;

      padding: 11px 15px;
    }

    .active-sort {
      position: relative;

      background: $white;

      border-radius: 6px;

      .circle {
        position: absolute;

        right: 15px;

        top: 18px;

        width: 4px;

        height: 4px;

        background: $green;

        border-radius: 50%;
      }
    }
  }
}

.fs-12 {
  font-size: 12px;
}

.fs-13 {
  font-size: 13px;
}

.fs-14 {
  font-size: 14px;
}
</style>
