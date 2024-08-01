<template>
  <div class="terminal">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.terminal {
  background-color: #0c0c0c;
  color: #00ff00;
  font-family: 'Space Mono', sans-serif;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  input {
    background-color: transparent;
    border: none;
    color: #00ff00;
    font-family: inherit;
    font-size: inherit;
    flex-grow: 1;
    outline: none;
  }

}
</style>