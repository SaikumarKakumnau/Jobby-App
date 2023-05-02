import Header from '../Header'
import AllJobsSection from '../AllJobsSection'

import './index.css'

const Jobs = () => (
  <>
    <Header />
    <div className="jobs-container">
      <div className="jobs-section">
        <AllJobsSection />
      </div>
    </div>
  </>
)

export default Jobs
