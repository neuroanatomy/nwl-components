<template>
    <div class="area" @mouseup="drag = false" @mousleave="drag = false">
        <div class="content-wrapper">
            <slot name="content" />
        </div>
        <div class="tools" :style="{...position}">
            <button v-show="!toggled" class="show-tools"  @click="toggled = true"><img src="@/assets/bars.svg" alt="show tools" /></button>
            <div v-show="toggled" class="palette">
                <div class="header" @mousedown="handleMouseDown">
                    <button class="toggle" @click="toggled = false"><img src="@/assets/times-circle.svg" alt="hide tools" /></button>
                    <span class="title">{{title}}</span>
                    <button class="left" @mousedown.stop="placeLeft"><img src="@/assets/caret-square-o-left.svg" alt="place tools left" /></button>
                    <button class="right" @mousedown.stop="placeRight"><img src="@/assets/caret-square-o-right.svg" alt="place tools right" /></button>
                </div>
                <div class="content">
                    <slot name="tools" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const drag = ref(false);
const position = ref({top: 5, left: 5, right: 'auto'});
const relativeCoords = ref({ left: 0, top: 0 });
const toggled = ref(true);

const props = defineProps({ title: String  });

const handleMouseDown = (event) => {
    const headerRect = event.target.getBoundingClientRect();
    relativeCoords.value = {
        left: event.clientX - headerRect.left,
        top: event.clientY - headerRect.top,
    };
    drag.value = true;
}

const placeLeft = () => {
    drag.value = false;
    const areaRect = document.querySelector('.area').getBoundingClientRect();
    position.value = { left: `${areaRect.left + margin}px`, top: `${areaRect.top + margin}px`, right: 'auto'};
};

const placeRight = () => {
    drag.value = false;
    const areaRect = document.querySelector('.area').getBoundingClientRect();
    position.value = { left: 'auto', top: `${areaRect.top + margin}px`, right: `${margin}px`};
};

onMounted(() => {
    document.addEventListener('mousemove', handleMove);
    placeLeft();
});

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMove);
});

const handleMove = (event) => {
    if (!drag.value) return;
    position.value = { left: `${event.clientX - relativeCoords.value.left}px`, top: `${event.clientY - relativeCoords.value.top}px` };
};

const margin = 5;


</script>
<style scoped>
.show-tools {
    width: 32px;
    height: 32px;
    border: thin solid #777;
    border-radius: 50%;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
}

.show-tools img {
    width: 28px;
}

.tools {
    position: absolute;
    z-index: 11;
}

.tools .palette {
    min-width: 350px;
    background-color: rgba(0,0,0,0.7);
    box-shadow: 2px 2px 5px grey;
}

.tools .palette .content :deep(button),
.tools .palette .content :deep(.group) {
    flex: 1;
}

.tools .palette .content :deep(button) {
    padding: 5px 6px;
}

.tools .content {
    padding: 5px 10px;
}

.header {
    display: flex;
    background: #333;
    user-select: none;
    align-items: center;
}

.header button {
    padding: 0;
    appearance: none;
    border: 0;
    background: transparent;
    padding: 5px;
    display: flex;
    align-items: center;
}

.header button img {
    max-height: 14px;
}

.title {
    margin-left: 5px;
    margin-right: auto;
}

.content-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>