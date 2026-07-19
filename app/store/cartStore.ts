import { create } from "zustand";

type CartItem = {
  id:number;
  name:string;
  image:string;
  price:number;
  quantity:number;
};

type CartStore ={

cart:CartItem[];

addToCart:(item:CartItem)=>void;

};

export const useCart=create<CartStore>((set)=>({

cart:[],

addToCart:(item)=>

set((state)=>{

const exist=state.cart.find((i)=>i.id===item.id);

if(exist){

return{

cart:state.cart.map((i)=>

i.id===item.id

?{

...i,

quantity:i.quantity+1

}

:i

)

};

}

return{

cart:[...state.cart,item]

};

})

}));