<script setup lang="ts">
  import { useDarkMode } from '@/composables/useDarkMode'

  const { isDark, toggleDark } = useDarkMode()
</script>

<template>
  <label class="switch">
    <input :checked="isDark" type="checkbox" @click="toggleDark()">
    <span class="slider round" />
  </label>
</template>

<style>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1e2341;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "light_mode";
  font-family: 'Material Icons';
  font-size: 18px;
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  color: #1e2341;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 4px;
  transition: .4s;
}

.slider::after {
  content: "dark_mode";
  font-family: "Material Icons";
  font-size: 18px;
  color: white;
  position: absolute;
  right: 8px;
  top: 4px;
  pointer-events: none;
  transition: .4s;
}

input:checked + .slider {
  background-color: #1e2341;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1e2341;
}

input:checked + .slider:before {
  transform: translateX(26px);
  content: "dark_mode";
  background-color: white;
  color: #1e2341;
}

input:checked + .slider::after {
  transform: translateX(-26px);
  content: "light_mode";
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
