function Header({Headline}) {

    return (  
        <div className="w-full flex items-center  h-10 bg-[#141414] border-b-2 border-[#2e2e2e] pl-0.5">
         <div className='w-[95%]  h-full  flex items-center justify-center'><p>{(Headline||"HEX")+" AI"}</p></div>
        </div>
    );
}

export default Header;