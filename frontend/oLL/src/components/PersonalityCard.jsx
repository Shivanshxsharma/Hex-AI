import astro from '../assets/horoscope.png';

function PersonalityCard({img ,name, pageChangeHandler}) {
    return ( 
        <div  onClick={()=>pageChangeHandler(name)} className="hover:bg-gradient-to-tr shadow-xl shadow-black  via-violet-700 to-yellow-500 hover:scale-110  transition-transform duration-300 hover:cursor-pointer w-[20vw] h-[15vh] sm:w-[12vw] sm:h-[25vh] rounded-2xl  p-[3px]">
            <div  className=" flex-col flex items-center  w-full h-full rounded-2xl bg-[#2E2E2E]">
              <div className="rounded-full flex justify-center items-center w-[40%] h-[40%] mt-5">
                <img src={img} alt="" />
              </div>
              <div className=' font-bold flex justify-center text-[70%] sm:text-[100%] items-center mt-2 sm:mt-10 text-xl'>
                <h1>{name}</h1>
              </div>
            </div>
        </div>
     );
}

export default PersonalityCard;