type Props={

children:React.ReactNode;

};

export default function Card({

children

}:Props){

return(

<div

className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"

>

{children}

</div>

);

}