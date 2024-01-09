import React from "react";
import Slider from "react-slick";
import { FaQuoteLeft } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";

const TestimonialsComponent = () => {
  const testimonialsData = [
    {
      id: 1,
      content:
        "Working with this team was a fantastic experience. They delivered high-quality results on time and exceeded our expectations.",
      author: "John Doe, CEO",
      image:
        "https://media.licdn.com/dms/image/C4E22AQGtBPuqfy3gaQ/feedshare-shrink_2048_1536/0/1650972527479?e=1706140800&v=beta&t=YNhdkVG-0qwQYJxYUAVy1zUB2InuITJeoI-Zr508mBM",
    },
    {
      id: 2,
      content:
        "I highly recommend this service. The team is professional, and their attention to detail is commendable.",
      author: "Jane Smith, Marketing Manager",
      image:
        "https://media.licdn.com/dms/image/C4E22AQGtBPuqfy3gaQ/feedshare-shrink_2048_1536/0/1650972527479?e=1706140800&v=beta&t=YNhdkVG-0qwQYJxYUAVy1zUB2InuITJeoI-Zr508mBM",
    },
    {
      id: 3,
      content:
        "Exceptional work! The team is creative, responsive, and committed to delivering top-notch solutions.",
      author: "Alex Johnson, Product Manager",
      image:
        "https://media.licdn.com/dms/image/C4E22AQGtBPuqfy3gaQ/feedshare-shrink_2048_1536/0/1650972527479?e=1706140800&v=beta&t=YNhdkVG-0qwQYJxYUAVy1zUB2InuITJeoI-Zr508mBM",
    },
  ];

  const settings = {
    dots: true,
    customPaging: function (i) {
      return (
        <div className="custom-dot" key={i}>
          ●
        </div>
      );
    },
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const styles = `
  .slick-dots {
    display: flex !important;
    justify-content: center;
    align-items: center;
    bottom: 15px;
  }

  .slick-dots .custom-dot {
    font-size: 24px;
    color: #999999;
    margin: 0 5px;
  }

  .slick-dots .slick-active .custom-dot {
    color: #000000; 
  }
`;

  return (
    <section id="testimonials" className=" pt-2  sm:pt-14  ">
      <style>{styles}</style>
      <div className="testimonials text-center py-16">
        <div className="container mx-auto text-black">
          <h3 className="text-4xl font-bold mb-11">Testimonials</h3>
          <Slider {...settings} className="mx-auto max-w-4xl">
            {testimonialsData.map((testimonial) => (
              <div key={testimonial.id} className="mx-2">
                <div className="card border-light bg-light text-center p-4 relative">
                  <div className="flex">
                    <FaQuoteLeft className="text-black text-3xl mb-4 mt-6" />
                    <div
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-2 shadow-md bg-cover bg-center flex items-center justify-center text-4xl"
                      style={{ backgroundImage: `url(${testimonial.image})` }}
                    >
                      {/* <GrUserManager /> */}
                    </div>
                  </div>

                  <div className="card-body blockquote">
                    <p className="card-text text-gray-800">
                      {testimonial.content}
                    </p>
                    <footer className="blockquote-footer text-gray-600">
                      <cite title="Source Title">{testimonial.author}</cite>
                    </footer>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsComponent;
