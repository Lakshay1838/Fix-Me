import '/src/styles/TopCategory.css';
import electrician from '../assets/homePage/electrician.jpg';
import plumber from '../assets/homePage/plumbing.jpg';
import carpenter from '../assets/homePage/carpenter.jpg';
import painting from '../assets/homePage/painting.jpg';

function TopCategory() {
  return (
    <div>
      <div className='heading'>
        <h1>Most Booked services</h1>
      </div>

      <div className='best_service'>

        <div className='services_content_1'>
          <div className='services_item_1'>
            <img src={carpenter} alt="Carpenter"></img>
          </div>
          <div className='services_name_1'>
            <h3>Carpentry Services</h3>
            <h4>Rs.450/-</h4>
          </div>
        </div>

        <div className='services_content_2'>
          <div className='services_item_2'>
            <img src={electrician} alt="electrician"></img>
          </div>
          <div className='services_name_2'>
            <h3>Electrical Services</h3>
            <h4>Rs.519/-</h4>
          </div>
        </div>

        <div className='services_content_3'>
          <div className='services_item_3'>
            <img src={plumber} alt="plumber"></img>
          </div>
          <div className='services_name_3'>
            <h3>Plumbing Services</h3>
            <h4>Rs.569/-</h4>
          </div>
        </div>

        <div className='services_content_4'>
          <div className='services_item_4'>
            <img src={painting} alt="Painting"></img>
          </div>
          <div className='services_name_4'>
            <h3>Painting Services</h3>
            <h4>Rs.484/-</h4>
          </div>
        </div>
        
      </div>
    </div>

  )
}

export default TopCategory
