import React from 'react'
import { Link } from 'react-router-dom'
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-[#1B3C53] to-[#234C6A] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Dappworks</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              A decentralized platform connecting talented freelancers with exciting blockchain projects.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Discord"
              >
                <FaDiscord className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/mybids" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  My Bids
                </Link>
              </li>
              <li>
                <Link 
                  to="/myjobs" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  My Jobs
                </Link>
              </li>
              <li>
                <Link 
                  to="/myprojects" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  My Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © {currentYear} Dappworks. All rights reserved.
            </p>
            <p className="text-gray-300 text-sm">
              Built with ❤️ on the blockchain
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer