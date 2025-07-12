export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SkillSwap</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Connect with others to exchange skills and learn together. Build your expertise while helping others grow theirs.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="/browse" className="text-gray-600 hover:text-blue-600">Browse Skills</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-blue-600">About</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-blue-600">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">GitHub</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Support</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © 2025 SkillSwap. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}