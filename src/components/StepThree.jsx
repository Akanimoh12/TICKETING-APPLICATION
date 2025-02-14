import React from 'react'

export default function StepThree() {
  return (
    <div>
      {/* TITLE SECTION FOR STEP 2 */}
      <div className="flex justify-between items-center ">
              <h1 className="text-2xl font-extralight font-[JejuMyeongjo] ">Ready</h1>
              <h4 className="">Step 3/3</h4>
            </div>
            {/* END FOR TITLE SECTION STEP 2 */}

            {/* PROGRESS BAR */}
            <div className="w-full h-[2.1px] bg-[#0E464F] mb-5">
              <div className="w-[100%] bg-[#24A0B5] h-full"></div>
            </div>
            {/* END FOR PROGRESS BAR */}
    </div>
  )
}
