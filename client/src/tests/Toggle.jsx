import React, { useState } from 'react'

const Toggle = () => {

  const arr = ["1", "2", "3", "4"];

  const [idx, setIdx] = useState(0);


  const nextFunc = () => {
       setIdx((idx + 1) % arr.length);
  }

  const prevFucn = () => {
    setIdx((idx - 1 + arr.length) % arr.length - 1); // 2 
          
  }


  function myItems () {

    const myObj = {
      name: String,
      userId: Number,
      rating: Number(1,2,3,4,5,-1,-2,-3,-4,-5),
      commnet: String

    }
  }

   function checkAverageScore () {
    // here according to the comment and rating this will return the thing 
   }
    

  return (
    <div className="flex gap-4 justify-center mt-4">
  <button onClick={nextFunc} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition">
    Next
  </button>
  <button onClick={prevFucn} className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500 transition">
    Prev
  </button>

  <p style={{fontSize: "20px"}}>{idx}</p>
</div>

  )
}

export default Toggle
