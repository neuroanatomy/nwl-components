<template>
    <div
        class="access"
        :data-level="
        ['none', 'view', 'edit', 'add', 'remove'].indexOf(
            collaborator.access[type]
        )
        "
    >
        <button @click="$emit('updateAccess', collaborator, type, 1)" class="view" :title="`view ${type}`"></button>
        <button @click="$emit('updateAccess', collaborator, type, 2)" class="edit" :title="`edit ${type}`"></button>
        <button @click="$emit('updateAccess', collaborator, type, 3)" class="add" :title="`add ${type}`"></button>
        <button @click="$emit('updateAccess', collaborator, type, 4)" class="remove" :title="`remove ${type}`"></button>
    </div>
</template>

<script setup>
//FIXME use AccessLevel and AccessType
defineProps({
  collaborator: Object,
  type: String
});
defineEmits(['updateAccess']);
</script>

<style scoped>
.access {
  padding-top: 5px;
  text-decoration: none;
  border: none;
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