export const metadata = {
  title: 'Privacy Policy - Islamic Stories',
  description: 'Learn how we protect your privacy and handle your data',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-gradient mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="glass rounded-3xl p-8 md:p-12 space-y-8 animate-fade-in-up">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>We collect minimal information to provide you with a better experience:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (email, name) when you register</li>
                <li>Listening history and preferences</li>
                <li>Device and browser information</li>
                <li>Usage analytics to improve our service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our service</li>
                <li>Save your listening progress and preferences</li>
                <li>Send you updates about new stories (if opted in)</li>
                <li>Improve our content and user experience</li>
                <li>Ensure content authenticity and quality</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We take data security seriously. Your password is encrypted, and we use 
              industry-standard security measures to protect your information. We never 
              sell or share your personal data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Children's Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              While our content is designed for children, we require parental consent 
              for users under 13. We do not knowingly collect personal information from 
              children without parental permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Cookies and Tracking
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We use essential cookies to keep you logged in and remember your preferences. 
              We do not use advertising or tracking cookies. You can disable cookies in 
              your browser settings, though this may limit some functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Your Rights
            </h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Update or correct your information</li>
                <li>Delete your account and data</li>
                <li>Opt out of email notifications</li>
                <li>Export your listening history</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We use Cloudinary for audio and image hosting. Audio files are streamed 
              directly from their servers. We do not share your personal information 
              with them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this privacy policy from time to time. We will notify you 
              of any significant changes by email or through our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about our privacy policy or how we handle your 
              data, please contact us:
            </p>
            <a 
              href="/contact" 
              className="btn-premium inline-flex"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}