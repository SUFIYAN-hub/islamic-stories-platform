'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement actual email sending (using backend API or email service)
    // For now, just simulate submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gradient mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass rounded-3xl p-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary-600" />
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Have questions, suggestions, or feedback? We're here to help!
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Email
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      contact@islamicstories.com
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Response Time
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Within 24-48 hours
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Common Questions
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>How to request a specific story?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Report an error in content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Partnership opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Technical support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
