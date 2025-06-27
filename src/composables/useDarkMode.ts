import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark({
  selector: 'html',
  valueDark: 'dark',
  valueLight: '',
})

const toggleDark = useToggle(isDark)

export const useDarkMode = () => {
  return {
    isDark,
    toggleDark,
  }
}
