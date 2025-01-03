import { ShopItemFontName } from 'types'
import { fontGetLocalPath } from '../font-get-local-path'
import { fontGetStyleComponent } from '../font-get-style-component'

const fontFamily = ShopItemFontName.FuzzyBubbles

const fontComponentFuzzyBubbles = fontGetStyleComponent({
  fontFamily,
  localFonts: [{
    fontWeights: [100, 500],
    src: fontGetLocalPath(fontFamily, 'Regular.ttf'),
  }, {
    fontWeights: [600, 900],
    src: fontGetLocalPath(fontFamily, 'Bold.ttf'),
  }],
})

export default fontComponentFuzzyBubbles
