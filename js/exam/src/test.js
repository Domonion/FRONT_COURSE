// var apples = 5;
// console.log(apples);
//
//
// function a () {
//   apples = 10;
//
//   console.log(apples);
//   if (true) {
//     var apples = 50;
//     console.log(apples);
//   }
// }
// a();
// console.log(apples);
// // 5 10 50 5
//
// var apples = 5;
// console.log(apples);
//
//
// function a () {
//   apples = 10;
//
//   console.log(apples);
//   if (true) {
//     apples = 50;
//     console.log(apples);
//   }
// }
// a();
// console.log(apples);
//5 10 50 50


// let apples = 5;
// if (true) {
//   let apples = 10;
//   console.log(apples);
// }
// console.log(apples);

// for(let i = 0; i < 10; i++){
//   i += 100;
//   console.log(i);
// }

function makeArmy() {

  let shooters = [];
  let i;
  for ( i = 0; i < 10; i++) {
    shooters.push((function() {
        //let j = i;
        return () => console.log( i++ );
    })());
  }

  return shooters;
}

var army = makeArmy();

army[5]();
army[5]();
army[1]();
army[5]();


let a = {b : 10, c: () => this.b};
console.log(a.c());
let c = a.c;
console.log(c());

// var kek;
// kek(2,3);
// var // const
// kek = function(a, b){
//   return a + b;
// }
