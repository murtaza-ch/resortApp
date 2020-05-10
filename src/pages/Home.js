import React,{Fragment} from 'react'
import Hero from '../component/Hero'
import Banner from '../component/Banner'
import { Link } from 'react-router-dom'
import Services from '../component/Services'
import FeaturedRoom from '../component/FeaturedRoom';

const Home = () => {
    return (
        <Fragment>
        <Hero>
            <Banner title="luxurious rooms" subtitle="delux rooms starting at $299">
                <Link to='/rooms' className="btn-primary">Our rooms</Link>
            </Banner>
        </Hero>
        <Services/>
        <FeaturedRoom/>
        </Fragment>
    )
}

export default Home; 