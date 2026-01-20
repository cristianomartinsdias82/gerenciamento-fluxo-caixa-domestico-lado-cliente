import { useState } from 'react';
import './App.css'
import AppMenu from './layout/menu/AppMenu';
import PeopleListing from './features/people/people-listing/components/PeopleListing';
import PersonRegistrationForm from './features/people/people-registration/components/PersonRegistrationForm';
import PerCategoryTotalsReport from './features/reporting/per-category-totals-report/components/PerCategoryTotalsReport';
import PerPersonTotalsReport from './features/reporting/per-person-totals-report/components/PerPersonTotalsReport';

const PeopleListingFeature = 'people-listing';
const PersonRegistrationFeature = 'person-registration';
const CategoriesFeature = 'categories';
const TransactionsenuItem = 'transactions';
const PerPersonTotalReportFeature = 'per-person-totals-report';
const PerCategoryTotalReportFeature = 'per-category-totals-report';

function App() {

  const [activeFeature, setActiveFeature] = useState<string>(PeopleListingFeature);

  return (
    <div className="layout">
      <header>
        Header
      </header>
      <nav role="nav">
        <AppMenu
          onPeopleListingFeatureClick={() => setActiveFeature(PeopleListingFeature)}
          onCategoriesListingFeatureClick={() => setActiveFeature(CategoriesFeature)}
          onTransactionsListingFeatureClick={() => setActiveFeature(TransactionsenuItem)}
          onPerPersonTotalsReportFeatureClick={() => setActiveFeature(PerPersonTotalReportFeature)}
          onPerCategoryTotalsReportFeatureClick={() => setActiveFeature(PerCategoryTotalReportFeature)} />
      </nav>
      <main>
        {activeFeature === PeopleListingFeature &&
        <PeopleListing onNewPersonClick={() => setActiveFeature(PersonRegistrationFeature)} />}
        {activeFeature === PersonRegistrationFeature &&
        <PersonRegistrationForm
          onNewPersonRegistered={() => setActiveFeature(PeopleListingFeature)}
          onCancelPersonRegistration={() => setActiveFeature(PeopleListingFeature)} />}
        {activeFeature === PerPersonTotalReportFeature && <PerPersonTotalsReport />}
        {activeFeature === PerCategoryTotalReportFeature && <PerCategoryTotalsReport />}
      </main>
      <footer>
        Developed by Cristiano Dias :)
      </footer>
  </div>)
}

export default App;
