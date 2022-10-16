import HtmlCompile from './htmlCompile';

const element = document.body;
console.log('element: ', element);

const compiler = new HtmlCompile(element);
console.log('compiler: ', compiler);