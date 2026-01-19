import { useState } from 'react';
import './App.css'
import AppMenu from './layout/menu/AppMenu';
import PeopleListing from './features/people/people-listing/components/PeopleListing';

const PeopleListingFeature = 'people-listing';
const PersonRegistrationFeature = 'person-registration';
const CategoriesFeature = 'categories';
const TransactionsenuItem = 'transactions';
const PerPersonTotalReportFeature = 'per-person-totals-report';
const PerCategoryTotalReportFeature = 'per-category-totals-report';

function App() {

  const [activeFeature, setActiveFeature] = useState<string>(PeopleListingFeature);
  const peopleListingSelected = activeFeature === PeopleListingFeature;

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
        {peopleListingSelected && <PeopleListing onNewPersonClick={() => setActiveFeature(PersonRegistrationFeature)} />}
      </main>
      <footer>
        Developed by Cristiano Dias :)
      </footer>
  </div>)
}

export default App;
