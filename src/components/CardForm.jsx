import { useState, useEffect } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";


const CardForm = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState({
    ticketType: "Regular", // Default ticket type
    emailNumber: 1, // Default email selection (1)
  });
  const [step2Data, setStep2Data] = useState({
    fullName: "",
    email: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedStep1Data = JSON.parse(localStorage.getItem("step1Data"));
    const savedStep2Data = JSON.parse(localStorage.getItem("step2Data"));
    if (savedStep1Data) {
      setStep1Data(savedStep1Data);
    }
    if (savedStep2Data) {
      setStep2Data(savedStep2Data);
    }
  }, []);

  // Save data to localStorage whenever step1Data or step2Data changes
  useEffect(() => {
    localStorage.setItem("step1Data", JSON.stringify(step1Data));
    localStorage.setItem("step2Data", JSON.stringify(step2Data));
  }, [step1Data, step2Data]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dlpmkurv4/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setStep2Data((prev) => ({ ...prev, avatar: data.secure_url }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Validation function for Step 1
  const validateStep1 = () => {
    let newErrors = {};
    if (!step1Data.ticketType) newErrors.ticketType = "Ticket Type is required";
    if (!step1Data.emailNumber) newErrors.email = "Select a number from 1 to 10";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation function for Step 2
  const validateStep2 = () => {
    let newErrors = {};
    if (!step2Data.fullName) newErrors.fullName = "Full Name is required";
    if (!step2Data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step2Data.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!step2Data.avatar) newErrors.avatar = "Upload an image";
    if (!step2Data.specialRequest) newErrors.specialRequest = "Enter a special request";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Move to the next step if validation passes
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(step + 1);
    } else if (step === 2 && validateStep2()) {
      setTicket({
        ...step1Data,
        ...step2Data,
      });
      setStep(3);
    }
  };

  // Reset Form State to default
  const resetForm = () => {
    setStep1Data({ ticketType: "Regular", emailNumber: 1 });
    setStep2Data({ fullName: "", email: "", avatar: "", specialRequest: "" });
    setErrors({});
  };

  // Go back to previous step
  const prevStep = () => setStep(step - 1);

  return (
    <div className="bg-[#02191D] flex justify-center items-center min-h-screen   ">

      <div className=" p-6 rounded-xl shadow-lg w-96 border-2 text-white border-[#0E464F] bg-[#02191D] ">

        {/* Step 1: Ticket Type & Number */}
        {step === 1 && (
          <div className="">

            <StepOne />

            {/* LINE */}
            <div className="bg-[#08252B] border-2 border-[#0E464F] rounded-2xl w-full p-3 ">
              {/* END LINE */}

              {/* TITLE FOR IMAGE */}
              <div>
                <img src="/Step1_Title.png" />
              </div>
              {/* END FOR TITLE FOR IMAGE */}

              {/* LINE */}
              <div className="w-full h-[2px] bg-[#0E464F] my-4"></div>
              {/* END FOR LINE */}

              {/* Ticket Type Selection */}

              <h4 className="mb-2 text-sm text-extralight">Select Ticket Type:</h4>

              {/* CARD FOR THE SELECTION */}
              <div className="">

                <div className="grid grid-cols-3 gap-4 p-3 bg-[#052228] rounded-2xl border-2 border-[#07373F]">
                  {[
                    { label: "Regular", price: "Free" },
                    { label: "VIP", price: "$150" },
                    { label: "VVIP", price: "$150" },
                  ].map((ticket) => (
                    <div
                      key={ticket.label}
                      className={`p-3 rounded-lg border ${step1Data.ticketType === ticket.label
                        ? "bg-[#12464E] border-[#197686] text-white"
                        : "border-[#197686] text-gray-300"
                        } cursor-pointer text-center`}
                      onClick={() => setStep1Data({ ...step1Data, ticketType: ticket.label })}
                    >
                      <h3 className="font-bold">{ticket.price}</h3>
                      <p className="text-sm">{ticket.label} ACCESS</p>
                    </div>
                  ))}
                </div>

              </div>
              {/* CARD FOR THE SELECTION */}


              {/* Number (Dropdown) Selection */}
              <div className="my-4">
                <label className="block text-sm text-extralight border-[#197686]  ">Number of Tickets</label>
                <select
                  name="emailNumber"
                  value={step1Data.emailNumber}
                  onChange={(e) =>
                    setStep1Data({ ...step1Data, emailNumber: e.target.value })
                  }
                  className="w-full p-2 border border-[#197686] bg-[#041E23] rounded-xl my-2"
                >
                  <option value="">Select a number</option>
                  {[...Array(10).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className=" gap-3 grid grid-cols-2 ">

                <button
                  type="button"
                  onClick={resetForm}
                  className=" border-2 border-[#24A0B5] text-[#24A0B5] p-2 rounded "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#24A0B5] text-white p-2 rounded "
                >
                  Next
                </button>

              </div>


            </div>



          </div>
        )}



        {/* Step 2: Avatar Upload, Full Name and Email */}
        {step === 2 && (
          <div>

            <StepTwo />

            <form onSubmit={(e) => e.preventDefault()} className="p-4 bg-[#08252B] border-2 border-[#0E464F] rounded-2xl">

              {/* IMAGE UPLOAD */}
              <div
                className=" border-dashed border-2 border-[#0E464F] rounded-lg p-2  text-center cursor-pointer hover:bg-[#041E23] transition"
                onClick={() => document.getElementById("fileUpload").click()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {step2Data.avatar ? (
                  <img src={step2Data.avatar} alt="Uploaded" className="w-24 h-24 mx-auto rounded-full" />
                ) : (                  
                   <img src="/uploadImage.png" className="w-28 h-28 m-auto" />          
                )}
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              {/* END FOR IMAGE UPLOAD */}

              {errors.avatar && <p className="text-red-500">{errors.avatar}</p>}

              {/* LINE */}
              <div className="bg-[#08252B] border-2 border-[#0E464F] w-full my-3  "></div>
              {/* END LINE */}


              <div className="my-4">
                <label className="block">Enter your name</label>
                <input
                  type="text"
                  value={step2Data.fullName}
                  onChange={(e) =>
                    setStep2Data({ ...step2Data, fullName: e.target.value })
                  }
                  className="w-full p-2 border border-[#0E464F] rounded text-white mt-1"
                />
                {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
              </div>

              <div className="mb-4">
                <label className="block ">Enter your email*</label>
                <input
                  type="email"
                  value={step2Data.email}
                  onChange={(e) =>
                    setStep2Data({ ...step2Data, email: e.target.value })
                  }
                  className="w-full p-2 border border-[#0E464F] rounded text-white mt-1"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <label className="block ">Special request?</label>
                <input type="textarea" placeholder="Textarea"
                value={step2Data.specialRequest}
                onChange={(e) =>
                  setStep2Data({ ...step2Data, specialRequest: e.target.value })} 
                  className="w-full p-2 border border-[#0E464F] rounded text-white mt-1 h-22"
                />
                {errors.specialRequest && <p className="text-red-500">{errors.specialRequest}</p>}
              </div>


              {/* BUTTONS  */}
              <div className="grid grid-cols-2 gap-2">

                <button
                  onClick={prevStep}
                  className=" border-2 border-[#24A0B5] text-[#24A0B5] p-2 rounded w-full"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#24A0B5] text-white p-2 rounded w-full"
                >
                  Get Ticket
                </button>


              </div>



            </form>


          </div>
        )}



        {/* Step 3: Display Ticket Details */}
        {step === 3 && (
          <div>

            <StepThree/>

            <h2 className="text-xl font-bold text-center font-[Alatsi] ">Your Ticket is Booked!</h2>
            <p className="text-center font-[Alatsi] text-sm">Check your email for a copy or you can download</p>

            {/* CARD */}
            <div id='card' className=" w-[80%] bg-[#072C31] border-2 border-[#24A0B5] my-4 m-auto p-3 ">

              {/* SECTION FOR IMAGE AND DETAILS */}
              <div className="w-full bg-[#072C31] p-2 border-2 border-[#24A0B5] rounded-2xl border-dashed  ">

                <img src="/Event.png" className="m-auto" />

                {/* USER IMAGE */}
                  <img src={ticket.avatar} alt="Avatar" className="w-28 h-28 rounded-2xl m-auto my-5 border-4 border-[#24A0B5]" />
                {/* END FOR USER IMAGE */}

                {/* USER DETAILS FILL */}
                  <div className="bg-[#08343C] border-2 border-[#133D44] p-2 rounded-xl">

                    {/* FIRST DIV FOR NAME AND EMAIL */}
                    <div className="grid grid-cols-2 text-[10px]">

                      <div className="w-fit border-r-2 border-gray-500 pr-1">
                        <p className="text-gray-400">Enter your name</p>
                        <p className="font-bold">{ticket.fullName}</p>
                      </div>

                      <div className="w-full flex-wrap ">
                        <p className="text-gray-400">Enter your email</p>
                        <p className="font-bold break-words ">{ticket.email}</p>
                      </div>
                      
                    </div>
                    {/* END FOR FIRST DIV FOR NAME AND EMAIL */}

                    {/* SECOND DIV FOR TICKET TYP AND TICKET FOR */}
                    <div className="grid grid-cols-2 text-[10px] border-y-2 border-gray-500 py-1">

                      <div className="w-fit ">
                        <p className="text-gray-400">Ticket type:</p>
                        <p className="font-bold">{ticket.ticketType}</p>
                      </div>

                      <div className="w-fit">
                        <p className="text-gray-400">Ticket for:</p>
                        <p className="font-bold">{ticket.emailNumber}</p>
                      </div>
                      
                    </div>
                    {/* END FOR SECOND DIV FOR TICKET TYP AND TICKET FOR */}

                    {/* THIRD DIV FOR SPECIAL REQUEST */}
                    <div className="text-[10px]">
                      <p className="text-gray-400">Special request:</p>
                      <p className="font-bold ">{ticket.specialRequest}</p>
                    </div>
                    {/* END FOR THIRD DIV FOR SPECIAL REQUEST */}             

                  </div>
                {/* END FOR USER DETAILS FILL */}

              </div>
              {/* END FOR SECTION FOR IMAGE AND DETAILS */}



              {/* SECTION FOR QR CODE */} 
              <div className="w-full bg-[#072C31] border-2 border-[#24A0B5] rounded-2xl p-2 border-dashed ">
                <img src="/barCode.png" className="m-auto w-[70%]" />                
              </div>
              {/* END FOR SECTION FOR QR CODE */}

            </div>
            {/* END FOR CARD */}

            <div className="grid grid-cols-2 gap-3 justify-between mt-4">

              <button onClick={() => setStep(1)} className="border-2 border-[#24A0B5] font-bold text-[11px] text-[#24A0B5] p-2 rounded">
                Book Another Ticket
              </button>

              <button className="bg-[#24A0B5] text-[11px] font-bold text-white p-2 rounded">Download Ticket</button>

            </div>

          </div>

        )}
      </div>
    </div>
  );
};

export default CardForm;
