<template>
  <div
    class="access"
    :data-level="
      ['none', 'view', 'edit', 'add', 'remove'].indexOf(
        collaborator.access[type]
      )
    "
  >
    <button
      :small="true"
      @click="handleButtonClick(1)"
      class="view"
      :disabled="readonly"
      :title="`view ${type}`"
    />
    <button
      :small="true"
      @click="handleButtonClick(2)"
      class="edit"
      :disabled="readonly"
      :title="`edit ${type}`"
    />
    <button
      :small="true"
      @click="handleButtonClick(3)"
      class="add"
      :disabled="readonly"
      :title="`add ${type}`"
    />
    <button
      :small="true"
      @click="handleButtonClick(4)"
      class="remove"
      :disabled="readonly"
      :title="`remove ${type}`"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  collaborator: Object,
  type: String,
  readonly: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['updateAccess']);

const handleButtonClick = (level) => {
  if (props.readonly) { return; }
  emit('updateAccess', props.collaborator, props.type, level);
};
</script>

<style scoped>
button:disabled {
  pointer-events: none;
}
.access {
  text-decoration: none;
  border: none;
  display: flex;
}
.access button:hover {
  background: #666;
}

.access button:before {
  background-size: 15px 15px;
  width: 15px;
  height: 15px;
  content: "";
  display: inline-block;
  text-decoration: none;
}
button {
  margin-left: 0;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 2px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* view */
[data-level="0"] .view:before {
  background-image: url("~@/assets/eye.svg");
}
[data-level="1"] .view:before,
[data-level="2"] .view:before,
[data-level="3"] .view:before,
[data-level="4"] .view:before {
  background-image: url("~@/assets/eye-circle.svg");
}
/* edit */
[data-level="0"] .edit:before,
[data-level="1"] .edit:before {
  background-image: url("~@/assets/pencil.svg");
}
[data-level="2"] .edit:before,
[data-level="3"] .edit:before,
[data-level="4"] .edit:before {
  background-image: url("~@/assets/pencil-circle.svg");
}
/* add */
[data-level="0"] .add:before,
[data-level="1"] .add:before,
[data-level="2"] .add:before {
  background-image: url("~@/assets/plus-small.svg");
}
[data-level="3"] .add:before,
[data-level="4"] .add:before {
  background-image: url("~@/assets/plus-small-circle.svg");
}
/* remove */
[data-level="0"] .remove:before,
[data-level="1"] .remove:before,
[data-level="2"] .remove:before,
[data-level="3"] .remove:before {
  background-image: url("~@/assets/minus-small.svg");
}
[data-level="4"] .remove:before {
  background-image: url("~@/assets/minus-small-circle.svg");
}
</style>
