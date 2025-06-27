import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'vueuse-color-scheme',
})

const toggleDark = useToggle(isDark)

export const useDarkMode = () => {
  return {
    isDark,
    toggleDark,
  }
}
