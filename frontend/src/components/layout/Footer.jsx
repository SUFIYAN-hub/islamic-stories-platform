import Link from 'next/link';
import { Heart, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
              Islamic Stories
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Authentic Islamic stories for children in Hindi. Based on Ahle Sunnat Wal Jamaat teachings.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500" dir="rtl">
              قصص إسلامية للأطفال
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href="mailto:contact@islamicstories.com"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for the Muslim Ummah
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            © {new Date().getFullYear()} Islamic Stories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}