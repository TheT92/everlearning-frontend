import '../styles/pageHeader.scss';
import { Link, useLocation } from 'react-router-dom';
import PillNav from './PillNav';
import logo from '../assets/react.svg';

export default function PageHeader() {
    const location = useLocation();
    // console.log("Current location:", location.pathname);
    const email = localStorage.getItem('email');
    const links = [
        { href: '/', label: 'Home' },
        { href: '/problems', label: 'Problems' },
        { href: '/community', label: 'Community' },
        { href: '/todo', label: 'Todo List' },
        email ? { href: '/my', label: 'Mine' } : { href: '/login', label: 'Sign In/ Sign Up' }
    ];
    return (
        <header className="page-header">
            {/* <Link className='logo' to="/">EverLearning</Link>
            {
                links.map((link) => (
                    <Link key={link.to} className={`nav-link ${link.to == location.pathname ? 'active' : ''}`} to={link.to}>{link.label}</Link>
                ))
            }
            <Link className='login fs-1' to={email ? `/my` : '/login'}>{email || `Sign In/ Sign Up`}</Link> */}
            <PillNav
                logo={logo}
                logoAlt="Company Logo"
                items={links}
                activeHref="/"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
                initialLoadAnimation={false}
            />
        </header>
    );
}