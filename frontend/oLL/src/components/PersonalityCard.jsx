function PersonalityCard({ img, name, pageChangeHandler }) {
  // Helper to determine light accent background for the image based on personality name
  const getAccentColor = (cardName) => {
    const lower = cardName.toLowerCase();
    if (lower.includes("astro")) return "bg-[#e0f2fe]"; // soft sky blue
    if (lower.includes("therapist")) return "bg-[#e0f7fa]"; // soft teal/cyan
    if (lower.includes("code")) return "bg-[#ecfdf5]"; // soft mint/emerald
    if (lower.includes("movie")) return "bg-[#fff7ed]"; // soft orange/peach
    if (lower.includes("friend")) return "bg-[#fef9c3]"; // soft yellow
    if (lower.includes("study")) return "bg-[#f5f3ff]"; // soft violet/lavender
    if (lower.includes("career")) return "bg-[#e0e7ff]"; // soft indigo/blue
    return "bg-neutral-100"; // fallback light grey
  };

  return (
    <div
      onClick={() => pageChangeHandler(name)}
      className="personality-card group relative cursor-pointer w-full max-w-[105px] h-[130px] sm:w-[165px] sm:max-w-none sm:h-[190px] md:w-[195px] md:h-[205px] rounded-[16px] sm:rounded-[20px] p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden mx-auto"
    >
      {/* Dynamic light accent background for black illustrations */}
      <div className={`${getAccentColor(name)} w-full overflow-hidden flex justify-center items-center h-[56%] sm:h-[62%] rounded-[11px] sm:rounded-[14px] p-2 sm:p-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300`}>
        <img
          className="w-full h-full object-contain transform group-hover:scale-103 transition-all duration-300"
          src={img}
          alt={name}
        />
      </div>

      {/* Bottom section with title and arrow indicator */}
      <div className="w-full flex items-center justify-between mt-1 px-0.5 pb-0.5">
        <h1 className="personality-card-title text-[10px] sm:text-xs md:text-sm font-semibold tracking-tight truncate mr-1">
          {name}
        </h1>
        {/* Explore Arrow Box - Blue Hover Accent */}
        <div className="flex-shrink-0 w-4.5 h-4.5 sm:w-6.5 sm:h-6.5 rounded-[6px] sm:rounded-[8px] bg-[#222222] text-neutral-400 flex items-center justify-center group-hover:bg-[#3b82f6] group-hover:text-white transition-all duration-300">
          <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default PersonalityCard;