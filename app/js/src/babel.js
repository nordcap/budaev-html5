
"use strict";

function* generatorSeq(){
	yield 1;
	yield 2;
	return 3;

} 

let gen = generatorSeq();
for(let value of gen){
	console.log(value);
}