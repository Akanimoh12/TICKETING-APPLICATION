import { useState, useEffect } from 'react';

const TicketGenerator = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        avatar: '',
    });
    const [errors, setErrors] = useState({});
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('ticketForm'));
        if (savedData) {
            setFormData(savedData);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ticketForm', JSON.stringify(formData));
    }, [formData]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/dlpmkurv4/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!formData.avatar) {
            newErrors.avatar = 'Upload an image';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setTicket({ ...formData });
        }
    };

    

    return (
        <div className="lg:flex gap-4 lg:items-center justify-items-center justify-center h-[100vh] w-full p-4 bg-gray-900 text-white">
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md h-auto ">

                <h2 className="text-2xl font-bold mb-4 bg-gray-900 p-1 rounded-lg text-center ">CONFERENCE TICKET GENERATOR</h2>

                <form onSubmit={handleSubmit}>

                    {/* IMAGE UPLOAD */}
                    <div className="mb-4">
                        <label className="block"></label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="avatarUpload"
                        />
                        <label htmlFor="avatarUpload" className=" font-bold block cursor-pointer w-full py-10  border rounded text-center bg-gray-700 hover:bg-gray-600">
                            {formData.avatar ? 'Successfully Uploaded' : 'Upload Image' }
                        </label>
                        {errors.avatar && <p className="text-red-500">{errors.avatar}</p>}
                    </div>
                    {/* END FOR IMAGE UPLOAD */}

                    {/* USER FULL NAME */}
                    <div className="mb-4">
                        <label className="block font-bold">Full Name:</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full p-2 border border-blue-500 rounded text-white font-bold"
                        />
                        {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
                    </div>
                    {/* END FOR USER FULL NAME */}

                    {/* USER EMAIL ADDRESS */}
                    <div className="mb-4">
                        <label className="block font-bold">Email Address:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border border-blue-500 rounded text-white font-bold"
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    {/* END FOR USER ADDRESS */}

                    {/* SUBMIT BUTTON TO GENERATE CARD */}
                    <button
                        type="submit"
                        className="bg-blue-500 mt-3 px-4 py-2 rounded text-white hover:bg-blue-700 w-full font-bold">
                        Generate Ticket
                    </button>
                    {/* END FOR SUBMIT BUTTON TO GENERATE CARD */}

                </form>
            </div>

            {ticket && (
                <div className="mt-6 shadow-lg w-full max-w-md ">

                    <div className='bg-gray-700 items-center flex p-3 justify-between gap-2 w-full h-[auto] border-2 border-white rounded-2xl'>

                        {/* IMAGE POSITION */}
                        <div className='p'>
                            <img src={ticket.avatar} alt="Avatar" className="w-30 h-30 rounded-2xl mx-auto my-2 border-7 border-white " />
                        </div>
                        {/* END FOR IMAGE POSITION */}

                        {/* USER DETAILS */}
                        <div>
                            <h3 className="text-lg font-semibold flex">Booked 
                                {/* VERIFIED ICON */} 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400 mt-1 items-center" aria-hidden="true">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
            </svg>
            {/* END FOR VERIFIED ICON */}
                            </h3>
                            <p className="text-4xl font-bold w-fit">{ticket.fullName}</p>
                            <p className='font-bold text-[10px]'>{ticket.email}</p>
                        </div>
                        {/* END FOR USER DETAILS */}
                        
                        {/* CONFERENCE DETAILS */}
                        <div className='border-l-3 pl-2 '>

                            <h1 className='font-bold'>Date:</h1>
                            <h2 >2025</h2>
                            <h3 className='font-bold'>March 13th</h3>

                            <h1>8:00 PM</h1>

                        </div>
                        {/* END FOR CONFERENCE DETAILS */}

                        
                    </div>

                    
                   
                    
                    
                    
                </div>
            )}

        </div>
    );
};

export default TicketGenerator;
