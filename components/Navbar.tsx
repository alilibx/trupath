// components/Navbar.tsx
import Link from 'next/link'

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-4">
        <li><Link href="/" className="text-white">Home</Link></li>
        <li><Link href="/explore" className="text-white">Explore Careers</Link></li>
        <li><Link href="/personalized" className="text-white">Personalized Path</Link></li>
        <li><Link href="/global-stats" className="text-white">Global Stats</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar