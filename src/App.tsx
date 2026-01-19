import { useState } from 'react';
import './App.css'
import AppMenu from './components/ui/Menu/AppMenu'

const PeopleMenuItem = 'people';
const CategoriesMenuItem = 'categories';
const TransactionsenuItem = 'transactions';
const PerPersonTotalReportMenuItem = 'per-person-totals-report';
const PerCategoryTotalReportMenuItem = 'per-category-totals-report';

function App() {

  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);

  return (
    <div className="layout">
      <header>
        Header
      </header>
      <nav role="nav">
        <AppMenu
          onPeopleMenuItemClick={() => setActiveMenuItem(PeopleMenuItem)}
          onCategoriesMenuItemClick={() => setActiveMenuItem(CategoriesMenuItem)}
          onTransactionsMenuItemClick={() => setActiveMenuItem(TransactionsenuItem)}
          onPerPersonTotalsMenuItemClick={() => setActiveMenuItem(PerPersonTotalReportMenuItem)}
          onPerCategoryTotalsMenuItemClick={() => setActiveMenuItem(PerCategoryTotalReportMenuItem)} />
      </nav>
      <main>
        Content
      </main>
      <footer>
        Developed by Cristiano Dias :)
      </footer>
  </div>)
}

export default App
