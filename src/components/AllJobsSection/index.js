import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProfilesSection from '../ProfilesSection'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobsSection extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    employmentTypes: [],
    salaryRange: '',
    allJobsData: [],
  }

  componentDidMount() {
    this.getAllJobsData()
  }

  getAllJobsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const {searchInput, employmentTypes, salaryRange} = this.state

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        allJobsData: updateData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => this.getAllJobsData()

  renderSearchBar = () => {
    const {searchInput} = this.state
    return (
      <div className="search-bar">
        <input
          type="search"
          className="input-element"
          placeholder="Search"
          value={searchInput}
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          className="search-button"
          onClick={this.onClickSearch}
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  selectEmploymentType = event => {
    const {value, checked} = event.target
    const {employmentTypes} = this.state

    if (checked === true) {
      this.setState(
        prevState => ({
          employmentTypes: [...prevState.employmentTypes, value],
        }),
        this.getAllJobsData,
      )
    } else {
      const updatedTypes = employmentTypes.filter(
        eachType => eachType !== value,
      )
      this.setState({employmentTypes: updatedTypes}, this.getAllJobsData)
    }
  }

  selectSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getAllJobsData)
  }

  renderSuccessView = () => {
    const {allJobsData} = this.state
    const jobsList = allJobsData.length > 0

    return jobsList ? (
      <div className="job-success-view">
        <ul className="job-cards-container">
          {allJobsData.map(jobCard => (
            <JobItem key={jobCard.id} jobDetails={jobCard} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-job-image"
        />
        <h1 className="no-job-heading">No Jobs Found</h1>
        <p className="no-job-desc">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getAllJobsData()
  }

  renderFailureView = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something went wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderAllJobsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {salaryRange, employmentTypes} = this.state
    return (
      <div className="all-jobs-container">
        <div className="profile-filters-container">
          {this.renderSearchBar()}
          <ProfilesSection />
          <hr className="horizontal-line" />
          <FiltersGroup
            employmentTypes={employmentTypes}
            salaryRange={salaryRange}
            selectEmploymentType={this.selectEmploymentType}
            selectSalaryRange={this.selectSalaryRange}
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
          />
        </div>
        <div className="jobs-section-container">{this.renderAllJobsView()}</div>
      </div>
    )
  }
}

export default AllJobsSection
