<template>
  <div class="container">
    <div class="side">
      <slot name="side" />
    </div>
    <div class="content">
      <slot name="content" />
    </div>
  </div>
</template>

<style>
.container {
  display: block;
  margin: 0 auto;
  max-width: 700px;
}

.side {
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.content {
  margin: 0 auto;
  max-width: 420px;
  flex: 1;
  width: 100%;
}

@media (min-width: 639px) {
  .content {
    max-width: 600px;
  }
}

@media (min-width: 739px) {
  .content {
    max-width: 700px;
    margin: 0;
  }

  .side {
    flex-direction: row;
  }
}

@media (min-width: 1023px) {
  .side {
    margin-right: 20px;
    max-width: 200px;
    flex-direction: column;
  }

  .content {
    max-width: 684px;
  }
  .container {
    display: flex;
    max-width: 984px;
  }
}
</style>
