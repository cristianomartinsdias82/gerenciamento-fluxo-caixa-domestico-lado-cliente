import { useState } from 'react';
import './App.css'
import AppMenu from './layout/menu/AppMenu';
import PeopleListing from './features/people/people-listing/components/PeopleListing';
import PersonRegistrationForm from './features/people/people-registration/components/PersonRegistrationForm';

import CategoryRegistrationForm from './features/categories/category-registration/components/CategoryRegistrationForm';
import PerCategoryTotalsReport from './features/reporting/per-category-totals-report/components/PerCategoryTotalsReport';
import PerPersonTotalsReport from './features/reporting/per-person-totals-report/components/PerPersonTotalsReport';
import CategoriesListing from './features/categories/category-listing/components/CategoriesListing';
import TransactionsListing from './features/transactions/transactions-listing/components/TransactionsListing';
import TransactionRegistrationForm from './features/transactions/transaction-registration/components/TransactionRegistrationForm';

const PeopleListingFeature = 'people-listing';
const PersonRegistrationFeature = 'person-registration';
const CategoriesListingFeature = 'categories';
const CategoriesRegistrationFeature = 'categories-registration';
const TransactionsListingFeature = 'transactions-listing';
const TransactionRegistrationFeature = 'transaction-registration';
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
          onCategoriesListingFeatureClick={() => setActiveFeature(CategoriesListingFeature)}
          onTransactionsListingFeatureClick={() => setActiveFeature(TransactionsListingFeature)}
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

        {activeFeature === CategoriesListingFeature &&
        <CategoriesListing onNewCategoryClick={() => setActiveFeature(CategoriesRegistrationFeature)} />}
        {activeFeature === CategoriesRegistrationFeature &&
        <CategoryRegistrationForm
          onNewCategoryRegistered={() => setActiveFeature(CategoriesListingFeature)}
          onCancelCategoryRegistration={() => setActiveFeature(CategoriesListingFeature)} />}

        {activeFeature === TransactionsListingFeature &&
        <TransactionsListing onNewTransactionClick={() => setActiveFeature(TransactionRegistrationFeature)} />}
        {activeFeature === TransactionRegistrationFeature &&
        <TransactionRegistrationForm
          onNewTransactionRegistered={() => setActiveFeature(TransactionsListingFeature)}
          onCancelTransactionRegistration={() => setActiveFeature(TransactionsListingFeature)} />}

        {activeFeature === PerCategoryTotalReportFeature &&
        <PerCategoryTotalsReport />}
        {activeFeature === PerPersonTotalReportFeature &&
        <PerPersonTotalsReport />}
        {activeFeature === PerCategoryTotalReportFeature &&
        <PerCategoryTotalsReport />}
      </main>
      <footer>
        Developed by Cristiano Dias :)
      </footer>
  </div>)
}

export default App;
