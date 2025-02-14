import { useState, useEffect } from "react";

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

  // Go back to previous step
  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        {/* Step 1: Ticket Type & Email */}
        {step === 1 && (
          <div>

            <h2 className="text-xl font-bold mb-4">Step 1: Personal Info</h2>

            {/* Ticket Type Selection */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Regular", price: "Free" },
                { label: "VIP", price: "$150" },
                { label: "VVIP", price: "$150" },
              ].map((ticket) => (
                <div
                  key={ticket.label}
                  className={`p-4 rounded-lg border ${step1Data.ticketType === ticket.label
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-gray-300"
                    } cursor-pointer text-center`}
                  onClick={() => setStep1Data({ ...step1Data, ticketType: ticket.label })}
                >
                  <h3 className="font-bold">{ticket.price}</h3>
                  <p className="text-sm">{ticket.label} ACCESS</p>
                </div>
              ))}
            </div>


            {/* Email (Dropdown) Selection */}
            <div className="mb-4">
              <label className="block font-bold">Select Number (1-10):</label>
              <select
                name="emailNumber"
                value={step1Data.emailNumber}
                onChange={(e) =>
                  setStep1Data({ ...step1Data, emailNumber: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Select a number</option>
                {[...Array(10).keys()].map((i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Next
            </button>


          </div>
        )}

        {/* Step 2: Full Name, Email, and Avatar Upload */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 2: Fill Details</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block font-bold">Full Name:</label>
                <input
                  type="text"
                  value={step2Data.fullName}
                  onChange={(e) =>
                    setStep2Data({ ...step2Data, fullName: e.target.value })
                  }
                  className="w-full p-2 border border-blue-500 rounded text-white font-bold"
                />
                {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
              </div>

              <div className="mb-4">
                <label className="block font-bold">Email Address:</label>
                <input
                  type="email"
                  value={step2Data.email}
                  onChange={(e) =>
                    setStep2Data({ ...step2Data, email: e.target.value })
                  }
                  className="w-full p-2 border border-blue-500 rounded text-white font-bold"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>

              <div
                className="border-dashed border-2 border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700 transition"
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
                  <p className="text-gray-400">Drag & drop or click to upload</p>
                )}
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>


              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                Generate Ticket
              </button>
            </form>

            {/* Back Button */}
            <div className="flex justify-between mt-4">
              <button
                onClick={prevStep}
                className="bg-gray-400 text-white p-2 rounded w-full"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Display Ticket Details */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Ticket Generated</h2>
            <div>
              <h3 className="text-lg font-semibold">Ticket Type: {ticket.ticketType}</h3>
              <p className="font-bold">{ticket.fullName}</p>
              <p>{ticket.email}</p>
              <img src={ticket.avatar} alt="Avatar" className="w-32 h-32 rounded-full" />
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="bg-gray-400 text-white p-2 rounded">
                Back
              </button>
              <button className="bg-green-500 text-white p-2 rounded">Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardForm;
