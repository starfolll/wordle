// import type { TStoreItem, TStoreItemTheme } from './store/store.store'
// import twColors from 'tailwindcss/colors'
// import { ref } from 'vue'

// const tailwindColors = ['slate', 'gray', 'zinc', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']

// function hexToRgb(hex: string) {
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
//   return result
//     ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
//     : null
// }

// function twColorsToThemeVariables(colors: Record<string, string>) {
//   return Object.entries(colors).reduce((acc, [key, value]) => {
//     acc[`--color-current-${key}`] = hexToRgb(value)?.join(' ') ?? value
//     return acc
//   }, {} as Record<string, string>)
// }

// const allThemes = tailwindColors.reduce((acc, color) => {
//   acc[`theme_${color}`] = {
//     id: `theme_${color}`,
//     name: color.charAt(0).toUpperCase() + color.slice(1),
//     price: 10,
//     category: 'theme',
//     subCategory: 'tailwind',
//     purchased: false,
//     themeVariables: twColorsToThemeVariables(Object.fromEntries(Object.entries((twColors as any)[color]).map(([key, value]) => [key, value as string]))),
//   }

//   return acc
// }, {
//   theme_default: {
//     id: 'theme_default',
//     name: 'Default',
//     price: 0,
//     category: 'theme',
//     purchased: true,
//     themeVariables: twColorsToThemeVariables({
//       100: '245 245 245',
//       200: '229 229 229',
//       300: '212 212 212',
//       400: '163 163 163',
//       500: '115 115 115',
//       600: '82 82 82',
//       700: '64 64 64',
//       800: '38 38 38',
//       900: '23 23 23',
//     }),
//   },
// } as Record<string, Extract<TStoreItem, { category: 'theme' }>>)

// const allBackgrounds: Record<string, Extract<TStoreItem, { category: 'background' }>> = {
//   background_default: {
//     id: 'background_default',
//     name: 'Default',
//     price: 0,
//     category: 'background',
//     purchased: true,
//     background: '#171717',
//   },
//   background_fall: {
//     id: 'background_fall',
//     name: 'Fall',
//     price: 10,
//     category: 'background',
//     subCategory: '4 seasons',
//     purchased: false,
//     background: 'linear-gradient(to left top, #e9b91c, #ae1324)',
//   },
//   background_winter: {
//     id: 'background_winter',
//     name: 'Winter',
//     price: 10,
//     category: 'background',
//     subCategory: '4 seasons',
//     purchased: false,
//     background: 'linear-gradient(to left top, #E6DADA, #272846)',
//   },
//   background_spring: {
//     id: 'background_spring',
//     name: 'Spring',
//     price: 10,
//     category: 'background',
//     subCategory: '4 seasons',
//     purchased: false,
//     background: `linear-gradient(to left top, #fad0c4, #fad0c4, #ffd1ff)`,
//   },
//   background_summer: {
//     id: 'background_summer',
//     name: 'Summer',
//     price: 10,
//     category: 'background',
//     subCategory: '4 seasons',
//     purchased: false,
//     background: 'linear-gradient(to left top, #22c1c3, #fdbb2d)',
//   },
// }

// const allFonts: Record<string, Extract<TStoreItem, { category: 'font' }>> = {
//   font_default: {
//     id: 'font_default',
//     name: 'Default',
//     price: 10,
//     category: 'font',
//     purchased: true,
//     fontUrl: 'https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&display=swap',
//     fontName: '""',
//   },
//   font_bubbles: {
//     id: 'font_bubbles',
//     name: 'Bubbles',
//     price: 10,
//     category: 'font',
//     subCategory: 'fuzzy',
//     purchased: false,
//     fontUrl: 'https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&display=swap',
//     fontName: '"Fuzzy Bubbles"',
//   },
// }

// export const allStoreItems = ref<Record<TStoreItem['id'], TStoreItem>>({
//   ...allBackgrounds,
//   ...allThemes,
//   ...allFonts,
// })

// console.log(allStoreItems.value)
