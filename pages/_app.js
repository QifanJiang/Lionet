import '../styles/globals.css' // Make sure to update this file as described
import '../styles/globals.css' // Make sure to update this file as described
import 'bootstrap/dist/css/bootstrap.min.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
    return (
        <div className="container" style={{ position: "relative", textAlign: "center", paddingTop: '300px' }}>
            <div style={{ position: "absolute", top: 0, left: '50%', transform: 'translateX(-50%)' }}>
                <img src="/logo.png" style={{ width: "100%", height: "300px" }} alt="Image 1" className='rounded d-inline-block align-top' />
            </div>

            <div style={{ marginTop: '50px' }}>
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid justify-content-center">
                        <ul className="navbar-nav" style={{ width: '100%', justifyContent: 'space-around' }}>
                            <li className="nav-item">
                                <Link legacyBehavior href="/">
                                    <a className="btn btn-dark m-2">Home</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link legacyBehavior href="/create-nft">
                                    <a className="btn btn-dark m-2">Create NFT</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link legacyBehavior href="/dashboard">
                                    <a className="btn btn-dark m-2">Dashboard</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            <Component {...pageProps} />
        </div>
    )
}

export default MyApp;


