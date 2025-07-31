import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Home.css'; 
import './Consult';

const Home = () => {
    const navigate = useNavigate();
    const IsLoggedIn = localStorage.getItem("IsLoggedIn") === "true";
    const handleBookSlot = () => {
        console.log("IsLoggedIn:", IsLoggedIn);

        if(!IsLoggedIn){
            navigate('/signin')
        }else{
            navigate('/consult')
        }
    }
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

    const testimonials = [
        {
            quote: "Finding a reliable doctor and booking an appointment has never been easier. This platform is a lifesaver!",
            author: "Ananya Sharma"
        },
        {
            quote: "The list of partner hospitals is impressive, and the service quality is exceptional. Highly recommend!",
            author: "Rohan Kapoor"
        },
        {
            quote: "My experience was seamless from start to finish. Grateful for such an efficient healthcare booking system.",
            author: "Priya Singh"
        },
        {
            quote: "Excellent user interface and quick response times. It truly simplifies healthcare access.",
            author: "Vikram Reddy"
        }
    ];

    // Effect for auto-advancing testimonials
    useEffect(() => {
        const testimonialInterval = setInterval(() => {
            setCurrentTestimonialIndex((prevIndex) =>
                (prevIndex + 1) % testimonials.length
            );
        }, 6000); // Change testimonial every 6 seconds

        return () => clearInterval(testimonialInterval); // Clean up the interval on unmount
    }, [testimonials.length]);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Your Health, Our Priority.</h1>
                    <p>Connecting you with top-rated doctors and hospitals for seamless healthcare experiences.</p>
                </div>
            </section>

            {/* Book Slot Section */}
            <section className="book-slot-section">
                <h2>Ready to Book Your Slot?</h2>
                <p>Easily find and schedule appointments with a doctor or hospital near you. Your health journey starts here.</p>
                <button onClick={handleBookSlot} className="btn btn-secondary">Search & Book Now</button>
            </section>

            {/* Patients Testimonies Slider */}
            <section className="patients-testimonies-section">
                <h2>What Our Patients Say</h2>
                <div className="testimonial-slider">
                    <div className="testimonial-card">
                        <p className="testimonial-quote">"{testimonials[currentTestimonialIndex].quote}"</p>
                        <p className="testimonial-author">- {testimonials[currentTestimonialIndex].author}</p>
                    </div>
                    <div className="slider-nav">
                        {testimonials.map((_, index) => (
                            <span
                                key={index}
                                className={`nav-dot ${index === currentTestimonialIndex ? 'active' : ''}`}
                                onClick={() => setCurrentTestimonialIndex(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Admin/User Specific Sections */}
            <section className="admin-sections">
                <div className="add-hospital-section">
                    <h2>For Adminstration Only</h2>
                    <h2>Want to Add Department?</h2>
                    <p>Add newly Added Department to Hospital Portal</p>
                    <Link to='/add-dept' className="btn btn-tertiary">Register Department</Link>
                </div>
                <div className="add-doctor-section">
                    <h2>Join Our Team as a Doctor!</h2>
                    <p>Become a part of our network and serve patients seeking quality healthcare.</p>
                    <Link to='/AddDoctor' className="btn btn-tertiary">Apply As Doctor</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;