
// const myPromise = new Promise((resolve, reject) => {
//     let success = true; // Let's assume this is a condition from your async task

  
//    setTimeout(()=>{
//       if (success){
//         console.log("Tsk is done")
//       }
//    },2000)

//    let fruits=["mango","grapes","cherry","orange"]
//    for(furt of fruits){
//     console.log(furt)

    
//    }

//    const newPrm=new Promise((resolve,reject)=>{
//     if (success){
//         console.log("Second promise executed");
        
//     }
//    })

//   });
  
//   myPromise
//     .then(result => {
    

//       console.log(result);  // "Task completed successfully!"
//     })
//     .catch(error => {
//       console.log(error);   // "Something went wrong."
//     });


const products = [
  { id: 1, name: 'Laptop', price: 1000, inStock: true },
  { id: 2, name: 'Phone', price: 500, inStock: false },
  { id: 3, name: 'Tablet', price: 300, inStock: true },
  { id: 4, name: 'Headphones', price: 150, inStock: false }
];

const filtername=products.filter(product=>product.name ==='Laptop')
console.log(filtername);
const filterinstock=products.filter(product=>product.inStock===false)
console.log(filterinstock);

const filter_name_price=products.filter(product=>product.price===100 || product.name==="Laptop")
console.log(filter_name_price);

const filter_id=products.filter(product=>product.id===2)
console.log("The id filter ",filter_id);

const filter_id_name=products.filter(product=>product.name.startsWith('L'))
console.log(filter_id_name);




const arrowfun=(num)=> num+2;
console.log(arrowfun(2));


let numbers = [1, 2, 3, 4, 5];

const num1=numbers.map(num=>num +4)
console.log(num1);

const addfun=numbers.map(num=>num+"Cool")
console.log(addfun);
console.log(numbers);




const users = [
  { firstName: "John", lastName: "Doe", age: 25, address: { city: "New York", state: "NY" } },
  { firstName: "Jane", lastName: "Smith", age: 17, address: { city: "Los Angeles", state: "CA" } },
  { firstName: "Alice", lastName: "Johnson", age: 30, address: { city: "Chicago", state: "IL" } },
  { firstName: "Bob", lastName: "Brown", age: 15, address: { city: "Houston", state: "TX" } }
];


const tranformer=users.map(user=>({
  fullName: `${user.firstName} ${user.lastName}`,
  dob:`${user.age+50} ${user.address.city==='New York'}`,
  
}))

console.log(tranformer);

// console.log(users);





const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);  // The initial value is 0

console.log(sum);

const add=numbers.reduce((accumulator,currentValue)=>{
  return accumulator * currentValue
},1)
console.log(add);



const x = [1, 2, 3, 4, 5];
const jas=x.reduce((acc,curr)=>{
  if(acc > curr){
    if (acc > curr){
      return acc * curr
    }
  }
 

    return acc + curr
  
},0)

console.log("iff-------",jas);



const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 30 },
];


const groupBy=people.reduce((acc,person)=>{
  const age=person.age;
  if(!acc[age]){
    acc[age]=[]
  }
  acc[age].push(person.name)
  return acc;
},{})

console.log(groupBy);

const arrays = [[1, 2], [3, 4], [5, 6]];

const flattened = arrays.reduce((accumulator, currentValue) => {
  return accumulator.concat(currentValue)
}, []);

console.log(flattened);  // Output: [1, 2, 3, 4, 5, 6]


const arr=[[1,2,"Wow"],[3,4,"Ohh"],[5,6,"LAIS"]]

const convert=arr.reduce((acc,current)=>{
  return acc.concat(current)
})

console.log(convert);


const convert1=arr.reduce((acc,curr)=>{
  return acc+curr.toString()
})

console.log(convert1);



let allarr=[[1,2,4,5],[6,7,8,9],[10,10,20,30]]

const mapfun=allarr.map(num=>num.map(num=>num * 2))
console.log(mapfun);

const filterFun=allarr.filter(num=>num.some(num=>num > 5))
console.log(filterFun);

const reduceFun=allarr.reduce((acc,curr)=>{
  return acc.concat(curr)
})
console.log(reduceFun);

const person = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 30 },
];


const mapfun1=person.map(num=>num.name.toUpperCase())
console.log(mapfun1);

const filterFun1=person.filter(num=>num.name==='Alice' && num.age ===25)
console.log(filterFun1);


const reduceFun1 = person.reduce((acc, curr) => {
  return acc.concat(curr.name);  // Concatenate the name of the current person
}, []);
console.log(reduceFun1);

