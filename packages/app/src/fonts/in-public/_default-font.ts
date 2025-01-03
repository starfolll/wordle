import { ShopItemFontName } from 'types'
import { fontGetLocalPath } from '../font-get-local-path'
import { fontGetStyleComponent } from '../font-get-style-component'

const fontFamily = ShopItemFontName._default

const fontComponent_Default = fontGetStyleComponent({
  fontFamily,
  localFonts: [{
    fontWeights: [100],
    src: fontGetLocalPath(fontFamily, 'Lexend-Thin.ttf'),
  }, {
    fontWeights: [200],
    src: fontGetLocalPath(fontFamily, 'Lexend-ExtraLight.ttf'),
  }, {
    fontWeights: [300],
    src: fontGetLocalPath(fontFamily, 'Lexend-Light.ttf'),
  }, {
    fontWeights: [400],
    src: fontGetLocalPath(fontFamily, 'Lexend-Regular.ttf'),
  }, {
    fontWeights: [500],
    src: fontGetLocalPath(fontFamily, 'Lexend-Medium.ttf'),
  }, {
    fontWeights: [600],
    src: fontGetLocalPath(fontFamily, 'Lexend-SemiBold.ttf'),
  }, {
    fontWeights: [700],
    src: fontGetLocalPath(fontFamily, 'Lexend-Bold.ttf'),
  }, {
    fontWeights: [800],
    src: fontGetLocalPath(fontFamily, 'Lexend-ExtraBold.ttf'),
  }, {
    fontWeights: [900],
    src: fontGetLocalPath(fontFamily, 'Lexend-Black.ttf'),
  }],
})

export default fontComponent_Default
