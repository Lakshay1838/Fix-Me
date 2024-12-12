import '/src/styles/HomePage.css';
import barber from '/src/assets/homePage/barber.jpg'
import housekeeping from '/src/assets/homePage/housekeeping.jpg'
import carpenter from '/src/assets/homePage/carpenter.jpg'
import electrician from '/src/assets/homePage/electrician.jpg'
import plumber from '/src/assets/homePage/plumbing.jpg'
import wallpanels from '/src/assets/homePage/wallpanels.jpg'
import painting from '/src/assets/homePage/painting.jpg'
import acrepair from '/src/assets/homePage/acservice.jpeg'

import cleaning from '/src/assets/homePage/cleaning.jpeg'
import massage from '/src/assets/homePage/massage.jpeg'
import barberhome from '/src/assets/homePage/barberhome.jpeg'
import acservicehome from '/src/assets/homePage/acservicehome.jpeg'

function HomePage() {
  return (
    <div>
      <div className='home_page'>

        <div className='home_content'>
          <div className='home_ad_slogan'>
            <h1>Home services at your doorstep</h1>
          </div>
          <div className='home_ad_service'>

            <div className='home_ad_1'>
              <h2>What Are you Looking for?</h2>
            </div>

            <div className='home_ad_2'>
              <div className="home_content_1">
                <img src={barber} alt="Barber"></img>
              </div>

              <div className="home_content_2">
              <img src={housekeeping} alt="House Keeping"></img>

              </div>
              
              <div className="home_content_3">
                <img src={acrepair} alt="AC Service"></img>
              </div>
            </div>

            <div className='home_ad_3'>
              <div className="home_content_4">
                <img src={carpenter} alt="Carpenter"></img>
              </div>
              <div className="home_content_5">
                <img src={electrician} alt="electrician"></img>
              </div>
              <div className="home_content_6">
                <img src={plumber} alt="plumber"></img>
              </div>
            </div>

            <div className='home_ad_4'>
              <div className="home_content_7">
                <img src={painting} alt="Painting"></img>
              </div>
              <div className="home_content_8">
                <img src={wallpanels} alt="Wall Panels"></img>
              </div>
            </div>
          </div>
          
        </div>

        <div className='home_gallery'>
          <div className="home_image_1">
            <img src={cleaning} alt="Cleaning"></img>
          </div>
          <div className="home_image_2">
            <img src={massage} alt="Massage"></img>
          </div>
          <div className="home_image_3">
            <img src={barberhome} style={{backgroundSize:'cover'}} alt="Barber"></img>
          </div>
          <div className="home_image_4">
            <img src={acservicehome} alt="Ac Repair"></img>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HomePage