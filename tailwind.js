/*

Tailwind - The Utility-First CSS Framework

A project by Adam Wathan (@adamwathan), Jonathan Reinink (@reinink),
David Hemphill (@davidhemphill) and Steve Schoger (@steveschoger).

Welcome to the Tailwind config file. This is where you can customize
Tailwind specifically for your project. Don't be intimidated by the
length of this file. It's really just a big JavaScript object and
we've done our very best to explain each section.

View the full documentation at https://tailwindcss.com.


|-------------------------------------------------------------------------------
| The default config
|-------------------------------------------------------------------------------
|
| This variable contains the default Tailwind config. You don't have
| to use it, but it can sometimes be helpful to have available. For
| example, you may choose to merge your custom configuration
| values with some of the Tailwind defaults.
|
*/

// eslint-disable-next-line no-unused-vars
const defaultConfig = require("tailwindcss/defaultConfig")();

/*
|-------------------------------------------------------------------------------
| Colors                                    https://tailwindcss.com/docs/colors
|-------------------------------------------------------------------------------
|
| Here you can specify the colors used in your project. To get you started,
| we've provided a generous palette of great looking colors that are perfect
| for prototyping, but don't hesitate to change them for your project. You
| own these colors, nothing will break if you change everything about them.
|
| We've used literal color names ("red", "blue", etc.) for the default
| palette, but if you'd rather use functional names like "primary" and
| "secondary", or even a numeric scale like "100" and "200", go for it.
|
*/

const colors = {
  transparent: "transparent",

  // V2 Colors
  "white-faint": "#F8F8F8",
  "green-500": "#A7C400",
  "purple-100": "rgba(139, 127, 219, 0.1)",
  "purple-200": "rgba(139, 127, 219, 0.3)",
  "purple-500": "#8B7FDB",
  "link-purple": "#6357B5",
  "lightest-purple": "#f3f2fb",
  "light-chartreuse": "#F2FFBF",
  "gray-lightest": "#E4ECF5",
  "gray-dark": "#DAD9D9",
  "middle-gray": "#888888",
  "matte-gray": "#515151",
  "faint-charcoal": "#f5f5f5",
  charcoal: "#3C3C3C",
  gray: "#E2E2E2",
  black: "#080808",

  // V1 Colors
  "grey-darkest": "#3b3e44",
  "grey-darker": "#545360",
  "grey-dark": "#8795a1",
  grey: "#b8c2cc",
  "grey-light": "#dfdfe0",
  "grey-lighter": "#f2f2f2",
  "grey-lightest": "#faf9f9",
  white: "#fdfdfe",

  "red-darkest": "#3b0d0c",
  "red-darker": "#621b18",
  "red-dark": "#cc1f1a",
  red: "#e3342f",
  "red-light": "#ef5753",
  "red-lighter": "#f9acaa",
  "red-lightest": "#fcebea",

  "orange-darkest": "#462a16",
  "orange-darker": "#613b1f",
  "orange-dark": "#de751f",
  orange: "#f6993f",
  "orange-light": "#faad63",
  "orange-lighter": "#fcd9b6",
  "orange-lightest": "#fff5eb",

  "yellow-darkest": "#453411",
  "yellow-darker": "#684f1d",
  "yellow-dark": "#f2d024",
  yellow: "#ffed4a",
  "yellow-light": "#fff382",
  "yellow-lighter": "#ffd787",
  "yellow-lightest": "#fcfbeb",

  "green-darkest": "#0f2f21",
  "green-darker": "#1b8548",
  "green-dark": "#1f9d55",
  green: "#38c172",
  "green-light": "#51d88a",
  "green-lighter": "#a2f5bf",
  "green-lightest": "#e3fcec",

  brown: "#877b72",

  "teal-darkest": "#0d3331",
  "teal-darker": "#20504f",
  "teal-dark": "#38a89d",
  teal: "#4dc0b5",
  "teal-light": "#64d5ca",
  "teal-lighter": "#a0f0ed",
  "teal-lightest": "#e8fffe",

  "blue-darkest": "#12283a",
  "blue-darker": "#1c3d5a",
  "blue-dark": "#493e8a",
  blue: "#6258a5",
  "blue-light": "#9080f2",
  "blue-lighter": "#bcdefa",
  "blue-lightest": "#eff8ff",

  "indigo-darkest": "#191e38",
  "indigo-darker": "#2f365f",
  "indigo-dark": "#5661b3",
  indigo: "#6574cd",
  "indigo-light": "#7886d7",
  "indigo-lighter": "#b2b7ff",
  "indigo-lightest": "#e6e8ff",

  "purple-darkest": "#21183c",
  "purple-darker": "#382b5f",
  "purple-dark": "#7569c3",
  purple: "#8f87c1",
  "purple-light": "#a779e9",
  "purple-lighter": "#d6bbfc",
  "purple-lightest": "#f3ebff",

  "pink-darkest": "#451225",
  "pink-darker": "#6f213f",
  "pink-dark": "#eb5286",
  pink: "#f66d9b",
  "pink-light": "#fa7ea8",
  "pink-lighter": "#ffbbca",
  "pink-lightest": "#ffebef",

  pistachio: "#a8c401",
  "pistachio-lighter": "#eaf1c0",
  "pistachio-lightest": "#eef8d3",
};

module.exports = {
  /*
  |-----------------------------------------------------------------------------
  | Colors                                  https://tailwindcss.com/docs/colors
  |-----------------------------------------------------------------------------
  |
  | The color palette defined above is also assigned to the "colors" key of
  | your Tailwind config. This makes it easy to access them in your CSS
  | using Tailwind's config helper. For example:
  |
  | .error { color: config('colors.red') }
  |
  */

  colors,

  /*
  |-----------------------------------------------------------------------------
  | Screens                      https://tailwindcss.com/docs/responsive-design
  |-----------------------------------------------------------------------------
  |
  | Screens in Tailwind are translated to CSS media queries. They define the
  | responsive breakpoints for your project. By default Tailwind takes a
  | "mobile first" approach, where each screen size represents a minimum
  | viewport width. Feel free to have as few or as many screens as you
  | want, naming them in whatever way you'd prefer for your project.
  |
  | Tailwind also allows for more complex screen definitions, which can be
  | useful in certain situations. Be sure to see the full responsive
  | documentation for a complete list of options.
  |
  | Class name: .{screen}:{utility}
  |
  */

  screens: {
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    print: { raw: "print" },
  },

  /*
  |-----------------------------------------------------------------------------
  | Fonts                                    https://tailwindcss.com/docs/fonts
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your project's font stack, or font families.
  | Keep in mind that Tailwind doesn't actually load any fonts for you.
  | If you're using custom fonts you'll need to import them prior to
  | defining them here.
  |
  | By default we provide a native font stack that works remarkably well on
  | any device or OS you're using, since it just uses the default fonts
  | provided by the platform.
  |
  | Class name: .font-{name}
  | CSS property: font-family
  |
  */

  fonts: {
    sans: [
      "Nunito Sans",
      "system-ui",
      "BlinkMacSystemFont",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ],
    serif: [
      "Constantia",
      "Lucida Bright",
      "Lucidabright",
      "Lucida Serif",
      "Lucida",
      "DejaVu Serif",
      "Bitstream Vera Serif",
      "Liberation Serif",
      "Georgia",
      "serif",
    ],
    mono: ["Source Code Pro", "Courier New", "monospace"],
  },

  /*
  |-----------------------------------------------------------------------------
  | Text sizes                         https://tailwindcss.com/docs/text-sizing
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your text sizes. Name these in whatever way
  | makes the most sense to you. We use size names by default, but
  | you're welcome to use a numeric scale or even something else
  | entirely.
  |
  | By default Tailwind uses the "rem" unit type for most measurements.
  | This allows you to set a root font size which all other sizes are
  | then based on. That said, you are free to use whatever units you
  | prefer, be it rems, ems, pixels or other.
  |
  | Class name: .text-{size}
  | CSS property: font-size
  |
  */

  textSizes: {
    xxs: ".6875rem", // 11px
    xs: ".8125rem", // 13px
    sm: ".875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "1xl": "1.45rem", // 23.2px
    "2xl": "1.5rem", // 24px
    "3xl": "1.75rem", // 28px
    "4xl": "2.25rem", // 36px
    "5xl": "2.6875rem", // 43px
    "6xl": "3.625rem", // 58px
    "7xl": "4rem",
    "8xl": "5rem", // 80px
    "9xl": "6.25rem", // 100px
  },

  /*
  |-----------------------------------------------------------------------------
  | Font weights                       https://tailwindcss.com/docs/font-weight
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your font weights. We've provided a list of
  | common font weight names with their respective numeric scale values
  | to get you started. It's unlikely that your project will require
  | all of these, so we recommend removing those you don't need.
  |
  | Class name: .font-{weight}
  | CSS property: font-weight
  |
  */

  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  /*
  |-----------------------------------------------------------------------------
  | Leading (line height)              https://tailwindcss.com/docs/line-height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your line height values, or as we call
  | them in Tailwind, leadings.
  |
  | Class name: .leading-{size}
  | CSS property: line-height
  |
  */

  leading: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    loose: 1.75,
  },

  /*
  |-----------------------------------------------------------------------------
  | Tracking (letter spacing)       https://tailwindcss.com/docs/letter-spacing
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your letter spacing values, or as we call
  | them in Tailwind, tracking.
  |
  | Class name: .tracking-{size}
  | CSS property: letter-spacing
  |
  */

  tracking: {
    tight: "-0.05em",
    normal: "0",
    wide: "0.05em",
  },

  /*
  |-----------------------------------------------------------------------------
  | Text colors                         https://tailwindcss.com/docs/text-color
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your text colors. By default these use the
  | color palette we defined above, however you're welcome to set these
  | independently if that makes sense for your project.
  |
  | Class name: .text-{color}
  | CSS property: color
  |
  */

  textColors: { ...colors, primary: "#3C3C3C" },

  /*
  |-----------------------------------------------------------------------------
  | Background colors             https://tailwindcss.com/docs/background-color
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your background colors. By default these use
  | the color palette we defined above, however you're welcome to set
  | these independently if that makes sense for your project.
  |
  | Class name: .bg-{color}
  | CSS property: background-color
  |
  */

  backgroundColors: colors,

  /*
  |-----------------------------------------------------------------------------
  | Background sizes               https://tailwindcss.com/docs/background-size
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your background sizes. We provide some common
  | values that are useful in most projects, but feel free to add other sizes
  | that are specific to your project here as well.
  |
  | Class name: .bg-{size}
  | CSS property: background-size
  |
  */

  backgroundSize: {
    auto: "auto",
    cover: "cover",
    contain: "contain",
  },

  /*
  |-----------------------------------------------------------------------------
  | Border widths                     https://tailwindcss.com/docs/border-width
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your border widths. Take note that border
  | widths require a special "default" value set as well. This is the
  | width that will be used when you do not specify a border width.
  |
  | Class name: .border{-side?}{-width?}
  | CSS property: border-width
  |
  */

  borderWidths: {
    default: "1px",
    0: "0",
    2: "2px",
    3: "3px",
    4: "4px",
    8: "8px",
  },

  /*
  |-----------------------------------------------------------------------------
  | Border colors                     https://tailwindcss.com/docs/border-color
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your border colors. By default these use the
  | color palette we defined above, however you're welcome to set these
  | independently if that makes sense for your project.
  |
  | Take note that border colors require a special "default" value set
  | as well. This is the color that will be used when you do not
  | specify a border color.
  |
  | Class name: .border-{color}
  | CSS property: border-color
  |
  */

  borderColors: global.Object.assign({ default: colors["grey-light"] }, colors),

  /*
  |-----------------------------------------------------------------------------
  | Border radius                    https://tailwindcss.com/docs/border-radius
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your border radius values. If a `default` radius
  | is provided, it will be made available as the non-suffixed `.rounded`
  | utility.
  |
  | If your scale includes a `0` value to reset already rounded corners, it's
  | a good idea to put it first so other values are able to override it.
  |
  | Class name: .rounded{-side?}{-size?}
  | CSS property: border-radius
  |
  */

  borderRadius: {
    none: "0",
    sm: ".125rem",
    default: ".25rem",
    lg: ".5rem",
    "2lg": "0.75rem",
    xl: "1.5rem",
    "2xl": "2.375rem",
    full: "9999px",
  },

  /*
  |-----------------------------------------------------------------------------
  | Width                                    https://tailwindcss.com/docs/width
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your width utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based numeric scale, a percentage
  | based fraction scale, plus some other common use-cases. You
  | can, of course, modify these values as needed.
  |
  |
  | It's also worth mentioning that Tailwind automatically escapes
  | invalid CSS class name characters, which allows you to have
  | awesome classes like .w-2/3.
  |
  | Class name: .w-{size}
  | CSS property: width
  |
  */

  width: {
    auto: "auto",
    px: "1px",
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    24: "6rem",
    30: "7.5rem",
    32: "8rem",
    36: "9rem",
    48: "12rem",
    64: "16rem",
    80: "20rem",
    100: "30rem",
    "1/2": "50%",
    "1/3": "33.33333%",
    "2/3": "66.66667%",
    "1/4": "25%",
    "3/4": "75%",
    "1/5": "20%",
    "2/5": "40%",
    "3/5": "60%",
    "4/5": "80%",
    "1/6": "16.66667%",
    "5/6": "83.33333%",
    full: "100%",
    screen: "100vw",
  },

  /*
  |-----------------------------------------------------------------------------
  | Height                                  https://tailwindcss.com/docs/height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your height utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based numeric scale plus some other
  | common use-cases. You can, of course, modify these values as
  | needed.
  |
  | Class name: .h-{size}
  | CSS property: height
  |
  */

  height: {
    auto: "auto",
    px: "1px",
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    30: "7.5rem",
    32: "8rem",
    36: "9rem",
    48: "12rem",
    64: "16rem",
    full: "100%",
    screen: "100vh",
    "half-screen": "50vh",
  },

  /*
  |-----------------------------------------------------------------------------
  | Minimum width                        https://tailwindcss.com/docs/min-width
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your minimum width utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | couple common use-cases by default. You can, of course, modify
  | these values as needed.
  |
  | Class name: .min-w-{size}
  | CSS property: min-width
  |
  */

  minWidth: {
    0: "0",
    "1/3": "33.33333%",
    "1/2": "50%",
    full: "100%",
  },

  /*
  |-----------------------------------------------------------------------------
  | Minimum height                      https://tailwindcss.com/docs/min-height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your minimum height utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | few common use-cases by default. You can, of course, modify these
  | values as needed.
  |
  | Class name: .min-h-{size}
  | CSS property: min-height
  |
  */

  minHeight: {
    0: "0",
    4: "1rem",
    64: "16rem",
    full: "100%",
    screen: "100vh",
  },

  /*
  |-----------------------------------------------------------------------------
  | Maximum width                        https://tailwindcss.com/docs/max-width
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your maximum width utility sizes. These can
  | be percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based scale and a "full width" size,
  | which is basically a reset utility. You can, of course,
  | modify these values as needed.
  |
  | Class name: .max-w-{size}
  | CSS property: max-width
  |
  */

  maxWidth: {
    xs: "20rem",
    sm: "30rem",
    md: "40rem",
    lg: "50rem",
    xl: "60rem",
    "2xl": "70rem",
    "3xl": "80rem",
    "4xl": "90rem",
    "5xl": "100rem",
    "1/4": "25%",
    "1/2": "50%",
    "3/4": "75%",
    90: "90%",
    full: "100%",
    none: "none",
  },

  /*
  |-----------------------------------------------------------------------------
  | Maximum height                      https://tailwindcss.com/docs/max-height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your maximum height utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | couple common use-cases by default. You can, of course, modify
  | these values as needed.
  |
  | Class name: .max-h-{size}
  | CSS property: max-height
  |
  */

  maxHeight: {
    0: "0",
    10: "2.5rem",
    32: "8rem",
    64: "16rem",
    full: "100%",
    screen: "100vh",
  },

  /*
  |-----------------------------------------------------------------------------
  | Padding                                https://tailwindcss.com/docs/padding
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your padding utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default we
  | provide a sensible rem based numeric scale plus a couple other
  | common use-cases like "1px". You can, of course, modify these
  | values as needed.
  |
  | Class name: .p{side?}-{size}
  | CSS property: padding
  |
  */

  padding: {
    px: "1px",
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    40: "10rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
  },

  /*
  |-----------------------------------------------------------------------------
  | Margin                                  https://tailwindcss.com/docs/margin
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your margin utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default we
  | provide a sensible rem based numeric scale plus a couple other
  | common use-cases like "1px". You can, of course, modify these
  | values as needed.
  |
  | Class name: .m{side?}-{size}
  | CSS property: margin
  |
  */

  margin: {
    auto: "auto",
    px: "1px",
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    48: "12rem",
    64: "16rem",
    80: "20rem",
  },

  /*
  |-----------------------------------------------------------------------------
  | Negative margin                https://tailwindcss.com/docs/negative-margin
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your negative margin utility sizes. These can
  | be percentage based, pixels, rems, or any other units. By default we
  | provide matching values to the padding scale since these utilities
  | generally get used together. You can, of course, modify these
  | values as needed.
  |
  | Class name: .-m{side?}-{size}
  | CSS property: margin
  |
  */

  negativeMargin: {
    px: "1px",
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    48: "12rem",
    64: "16rem",
    80: "20rem",
  },

  /*
  |-----------------------------------------------------------------------------
  | Shadows                                https://tailwindcss.com/docs/shadows
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your shadow utilities. As you can see from
  | the defaults we provide, it's possible to apply multiple shadows
  | per utility using comma separation.
  |
  | If a `default` shadow is provided, it will be made available as the non-
  | suffixed `.shadow` utility.
  |
  | Class name: .shadow-{size?}
  | CSS property: box-shadow
  |
  */

  shadows: {
    default: "0 2px 4px 0 rgba(0,0,0,0.10)",
    md: "0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)",
    lg: "0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)",
    xl: "10px 15px 15px 0 rgba(0, 0, 0, .1), 5px 10px 15px 0 rgba(0, 0, 0, .5)",
    inner: "inset 0 1px 2px 0 rgba(0,0,0,0.08)",
    outline: "0 0 0 3px rgba(52,144,220,0.5)",
    none: "none",
    "right-side": "10px 0 20px -10px rgba(0,0,0,.7)",
    "left-side": "-10px 0 20px -10px rgba(0,0,0,.7)",
  },

  /*
  |-----------------------------------------------------------------------------
  | Z-index                                https://tailwindcss.com/docs/z-index
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your z-index utility values. By default we
  | provide a sensible numeric scale. You can, of course, modify these
  | values as needed.
  |
  | Class name: .z-{index}
  | CSS property: z-index
  |
  */

  zIndex: {
    auto: "auto",
    0: 0,
    1: 1,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
  },

  /*
  |-----------------------------------------------------------------------------
  | Opacity                                https://tailwindcss.com/docs/opacity
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your opacity utility values. By default we
  | provide a sensible numeric scale. You can, of course, modify these
  | values as needed.
  |
  | Class name: .opacity-{name}
  | CSS property: opacity
  |
  */

  opacity: {
    0: "0",
    25: ".25",
    50: ".5",
    75: ".75",
    100: "1",
  },

  /*
  |-----------------------------------------------------------------------------
  | SVG fill                                   https://tailwindcss.com/docs/svg
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your SVG fill colors. By default we just provide
  | `fill-current` which sets the fill to the current text color. This lets you
  | specify a fill color using existing text color utilities and helps keep the
  | generated CSS file size down.
  |
  | Class name: .fill-{name}
  | CSS property: fill
  |
  */

  svgFill: {
    current: "currentColor",
    white: "#fff",
    charcoal: "#3C3C3C",
  },

  /*
  |-----------------------------------------------------------------------------
  | SVG stroke                                 https://tailwindcss.com/docs/svg
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your SVG stroke colors. By default we just provide
  | `stroke-current` which sets the stroke to the current text color. This lets
  | you specify a stroke color using existing text color utilities and helps
  | keep the generated CSS file size down.
  |
  | Class name: .stroke-{name}
  | CSS property: stroke
  |
  */

  svgStroke: {
    current: "currentColor",
    white: "#fff",
    charcoal: "#3C3C3C",
  },

  /*
  |-----------------------------------------------------------------------------
  | Modules                  https://tailwindcss.com/docs/configuration#modules
  |-----------------------------------------------------------------------------
  |
  | Here is where you control which modules are generated and what variants are
  | generated for each of those modules.
  |
  | Currently supported variants:
  |   - responsive
  |   - hover
  |   - focus
  |   - focus-within
  |   - active
  |   - group-hover
  |
  | To disable a module completely, use `false` instead of an array.
  |
  */

  modules: {
    appearance: ["responsive"],
    backgroundAttachment: ["responsive"],
    backgroundColors: ["responsive", "hover", "focus", "group-hover"],
    backgroundPosition: ["responsive"],
    backgroundRepeat: ["responsive"],
    backgroundSize: ["responsive"],
    borderCollapse: [],
    borderColors: ["responsive", "hover", "focus"],
    borderRadius: ["responsive"],
    borderStyle: ["responsive"],
    borderWidths: ["responsive"],
    cursor: ["responsive"],
    display: ["responsive"],
    flexbox: ["responsive"],
    float: ["responsive"],
    fonts: ["responsive"],
    fontWeights: ["responsive", "hover", "focus"],
    height: ["responsive"],
    leading: ["responsive"],
    lists: ["responsive"],
    margin: ["responsive"],
    maxHeight: ["responsive"],
    maxWidth: ["responsive"],
    minHeight: ["responsive"],
    minWidth: ["responsive"],
    negativeMargin: ["responsive"],
    objectFit: [],
    objectPosition: [],
    opacity: ["responsive"],
    outline: ["focus"],
    overflow: ["responsive"],
    padding: ["responsive"],
    pointerEvents: ["responsive"],
    position: ["responsive"],
    resize: ["responsive"],
    shadows: ["responsive", "hover", "focus"],
    svgFill: ["group-hover", "responsive", "hover"],
    svgStroke: ["group-hover", "focus"],
    tableLayout: ["responsive"],
    textAlign: ["responsive"],
    textColors: ["responsive", "hover", "focus"],
    textSizes: ["responsive"],
    textStyle: ["responsive", "hover", "focus"],
    tracking: ["responsive"],
    userSelect: ["responsive"],
    verticalAlign: ["responsive"],
    visibility: ["responsive"],
    whitespace: ["responsive"],
    width: ["responsive"],
    zIndex: ["responsive"],
  },

  /*
  |-----------------------------------------------------------------------------
  | Plugins                                https://tailwindcss.com/docs/plugins
  |-----------------------------------------------------------------------------
  |
  | Here is where you can register any plugins you'd like to use in your
  | project. Tailwind's built-in `container` plugin is enabled by default to
  | give you a Bootstrap-style responsive container component out of the box.
  |
  | Be sure to view the complete plugin documentation to learn more about how
  | the plugin system works.
  |
  */

  plugins: [
    // eslint-disable-next-line global-require
    require("tailwindcss/plugins/container")({
      center: true,
      padding: "2rem",
    }),
    function addOrder({ addUtilities }) {
      const orders = {
        ".order-1": {
          order: 1,
        },
        ".order-2": {
          order: 2,
        },
        ".order-3": {
          order: 3,
        },
      };

      addUtilities(orders, {
        variants: ["responsive"],
      });
    },
    function addGap({ addUtilities }) {
      const gaps = {
        ".gap-0": {
          gap: 0,
        },
        ".gap-1": {
          gap: "0.25rem",
        },
        ".gap-2": {
          gap: "0.5rem",
        },
        ".gap-3": {
          gap: "0.75rem",
        },
        ".gap-4": {
          gap: "1rem",
        },
        ".gap-5": {
          gap: "1.25rem",
        },
        ".gap-6": {
          gap: "1.5rem",
        },
        ".gap-7": {
          gap: "1.75rem",
        },
        ".gap-8": {
          gap: "2rem",
        },
        ".gap-9": {
          gap: "2.25rem",
        },
        ".gap-10": {
          gap: "2.5rem",
        },
        ".gap-11": {
          gap: "2.75rem",
        },
        ".gap-12": {
          gap: "3rem",
        },
      };

      addUtilities(gaps, {
        variants: ["responsive"],
      });
    },
  ],

  /*
  |-----------------------------------------------------------------------------
  | Advanced Options         https://tailwindcss.com/docs/configuration#options
  |-----------------------------------------------------------------------------
  |
  | Here is where you can tweak advanced configuration options. We recommend
  | leaving these options alone unless you absolutely need to change them.
  |
  */

  options: {
    prefix: "",
    important: false,
    separator: ":",
  },
};
