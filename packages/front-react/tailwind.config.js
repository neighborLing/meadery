/** @type {import('tailwindcss').Config} */
const light = 'hsl(178 87% 50%)';
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ejs}"],
  theme: {
    extend: {
      colors: {
        /** 
         * 背景
        */
        // 基础背景颜色
        wrapper: 'hsl(217 41% 10%)',
        /** 
         * 字体
        */
        // 字体基础色
        tn: '#92abcf',
        // 发光字体
        light,
        // box标题
        title: 'hsl(216 41% 84%)',
        /** 
         * 输入框
        */
        // 输入框标题
        input: 'hsl(218 53% 6%)',
        placeholders: '#92abcf',
        /** 
         * 列表item
        */
        option: '#1a222e',
      },
      boxShadow: {
        default: 'hsl(0 0% 0% / 0.27) 0px 2px 3px 2px'
      },
      borderRadius: {
        default: '8px'
      },
      fontSize: {
        title: '1.4rem'
      },
      flex: {
        '1/4': '0 0 25%',
        '1/2': '0 0 50%'
      },
      height: {
        192: '48rem'
      },
      borderColor: {
        light
      }
    },
  },
  plugins: [],
}