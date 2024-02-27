import React from 'react';

const TermCondition = () => {
  return (
    <div className="container mx-auto w-[90%] sm:w-[80%] md:w-[50%] mt-10 p-5 text-black">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>

      <p className="mb-6 text-lg text-center">
        By using the Griha, you agree to comply with and be bound by the following terms
        and conditions of use. If you disagree with any part of these terms, please do not use our
        website.
      </p>

      <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4">
        Users must agree to abide by the terms and conditions outlined to use the services provided
        by the Room Finder site.
      </p>

      <h2 className="text-2xl font-bold mb-4">2. User Registration</h2>
      <p className="mb-4">
        Users may be required to create an account to access certain features. Users are responsible
        for maintaining the confidentiality of their account information.
      </p>

      <h2 className="text-2xl font-bold mb-4">3. Property Listings</h2>
      <p className="mb-4">
        Users are responsible for the accuracy of the information provided when listing a room or
        property. The Room Finder site reserves the right to remove or modify listings that violate
        the terms.
      </p>

      <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
      <p className="mb-4">
        Users must not engage in any unlawful or prohibited activities on the platform. Users should
        respect the privacy and rights of others.
      </p>

      <h2 className="text-2xl font-bold mb-4">5. Privacy Policy</h2>
      <p className="mb-4">
        Information collected from users is subject to the site's privacy policy. Details about the
        collection, use, and protection of user data should be outlined.
      </p>

      <h2 className="text-2xl font-bold mb-4">6. Liability and Disclaimers</h2>
      <p className="mb-4">
        The Room Finder site is not responsible for the accuracy of user-generated content. The site
        is not liable for any damages resulting from the use or inability to use the service.
      </p>

      <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
      <p className="mb-6">
        The terms and conditions may be updated, and users should regularly review them.
      </p>

      <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
      <p className="mb-6">
        These terms and conditions are governed by the laws of [Your Jurisdiction]. Any disputes
        arising out of or related to these terms shall be resolved through binding arbitration or
        the appropriate court.
      </p>

      <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
      <p className="mb-6">
        If you have any questions about these Terms and Conditions, please{' '}
        <a href="mailto:contactgriha@gmail.com" className="text-blue-500 hover:underline">
          contact us
        </a>
        .
      </p>
    </div>
  );
};

export default TermCondition;
