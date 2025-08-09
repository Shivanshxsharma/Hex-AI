import astro from '../assets/horoscope.png';

function PersonalityCard({img ,name, pageChangeHandler}) {
    return ( 
        <div  onClick={()=>pageChangeHandler(name)} className="hover:bg-blue-700 bg-black  hover:scale-110  transition-transform duration-300 hover:cursor-pointer w-[20vw] h-[15vh] sm:w-[10vw] sm:h-[25vh] rounded-[20px]  p-[3px]">
            <div  className=" p-0 flex-col flex items-center   w-full h-full rounded-2xl bg-[#0d0d0d]">
              <div className=" w-full bg-[#d9d6d6] overflow-hidden rounded-t-2xl   flex justify-center items-center  h-[60%] ">
              <img className='w-full h-full object-contain mt-1' src={img} alt="" srcset="" />
              </div>
              <div className=' font-bold flex justify-center text-[70%] sm:text-[100%] items-center mt-2 sm:mt-10 text-xl'>
                <h1>{name}</h1>
              </div>
            </div>
        </div>
     );
}

export default PersonalityCard;