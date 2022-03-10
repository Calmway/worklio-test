<template>
  <div class="search-bar">
    <input
      v-model.trim="searchText"
      type="text"
      placeholder="Search or Add..."
      @input="foundMatched" />

    <div class="input-icons">
      <Cancel v-if="searchText" @click="cancelSearch" />
      <Add v-if="searchText" :exist="exist" @click="addPerson" />
    </div>
  </div>
</template>

<script lang="ts">
import { Item } from 'Interface';
import { defineComponent, ref, computed } from 'vue';
import Add from 'components/icons/add.vue';
import Cancel from 'components/icons/cancel.vue';
export default defineComponent({
  name: 'Search',
  components: {
    Add,

    Cancel,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  emits: ['addItem', 'foundMatched'],

  setup(props: any, { emit }) {
    const searchText = ref('');
    const exist = computed(() =>
      props.list.some((x: Item) => x.name === searchText.value)
    );
    function addPerson() {
      if (!searchText.value) {
        return;
      }

      if (exist.value) {
        return;
      }
      emit('addItem', searchText.value);
      searchText.value = '';
    }
    function foundMatched() {
      if (props.list.some((x: Item) => x.name === searchText.value)) {
        emit('foundMatched', searchText.value);
      } else {
        emit('foundMatched', '');
      }
    }
    function cancelSearch() {
      searchText.value = '';
      emit('foundMatched', searchText.value);
    }
    return { searchText, addPerson, exist, foundMatched, cancelSearch };
  },
});
</script>

<style lang="scss" scoped>
@import '../sass/_color.scss';
.search-bar {
  position: relative;

  .input-icons {
    position: absolute;

    right: 20px;

    top: 20px;
  }

  input {
    width: 100%;

    padding: 20px;

    padding-top: 21px;

    color: $text;

    border-radius: 6px;

    border: none;

    background: $gray;

    ::placeholder {
      color: $placeHolder;
    }
  }
}
</style>
