type Props={

children:React.ReactNode;

};

export default function Button({

children

}:Props){

return(

<button

className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition"

>

{children}

</button>

);

}