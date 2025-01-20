interface Contact {
    id: number;
    name: string;
    method(name:string) : void
}

function clone(source:Contact, func:(name:string)=>void) : Contact {
    return Object.apply({}, source);
}

const printHello = (name:string) => console.log(name);

let a : Contact = {
    id:1,
    name:"Hello",
    method:printHello
}

let b = clone(a,printHello);
