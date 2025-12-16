// frontend/src/app/about/page.jsx
export const metadata = {
  title: 'About Us - Islamic Stories',
  description: 'Learn about our mission to provide authentic Islamic stories for children and families',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-gradient mb-4">
            About Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Preserving Islamic Heritage Through Stories
          </p>
        </div>

        {/* Content */}
        <div className="glass rounded-3xl p-8 md:p-12 space-y-6 animate-fade-in-up">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We created this platform to provide authentic Islamic stories for children and families. 
              In today's digital age, it's crucial to offer content that teaches Islamic values, 
              history, and morals in an engaging and accessible way.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What We Offer
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Authentic stories from Quran and Hadith</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Audio narrations in Hindi (more languages coming soon)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Content verified according to Ahle Sunnat Wal Jamaat</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>Age-appropriate content for all family members</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-bold">✓</span>
                <span>100% free, no advertisements</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Every story on our platform is carefully selected and verified by Islamic scholars 
              to ensure authenticity and adherence to the teachings of Ahle Sunnat Wal Jamaat. 
              We believe in providing content that not only entertains but also educates and 
              strengthens faith.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We're constantly adding new stories and features. Create an account to save your 
              favorite stories, track your listening progress, and get notified when new content 
              is added.
            </p>
            <div className="flex gap-4">
              <a 
                href="/register" 
                className="btn-premium"
              >
                Create Account
              </a>
              <a 
                href="/stories" 
                className="btn-glass"
              >
                Browse Stories
              </a>
            </div>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center glass rounded-2xl p-8 animate-fade-in-up">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Have Questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We'd love to hear from you
          </p>
          <a 
            href="/contact" 
            className="btn-premium inline-flex"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}