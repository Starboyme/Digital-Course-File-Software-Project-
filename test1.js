var m1=require('./test.js');
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}  
x=getRndInteger(111111,999999)
console.log(m1.sendmail('rajpradeepkrr@gmail.com',x))