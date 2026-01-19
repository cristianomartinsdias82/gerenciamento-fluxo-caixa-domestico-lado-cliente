import './AppMenu.css'

type AppMenuProps = {
  onPeopleListingFeatureClick?: () => void
  onCategoriesListingFeatureClick?: () => void
  onTransactionsListingFeatureClick?: () => void
  onPerPersonTotalsReportFeatureClick?: () => void
  onPerCategoryTotalsReportFeatureClick?: () => void
};

const AppMenu = ({
  onPeopleListingFeatureClick,
  onCategoriesListingFeatureClick,
  onTransactionsListingFeatureClick,
  onPerPersonTotalsReportFeatureClick,
  onPerCategoryTotalsReportFeatureClick }: AppMenuProps) => {

  return (
    <div className="app-menu">
      <ul role="menu" >
        <li><a onClick={onPeopleListingFeatureClick} href="#">People</a></li>
        <li><a onClick={onCategoriesListingFeatureClick} href="#">Categories</a></li>
        <li><a onClick={onTransactionsListingFeatureClick} href="#">Transactions</a></li>
        <li>
          <div>Reports</div>
          <ul className="sub-menu">
            <li><a onClick={onPerPersonTotalsReportFeatureClick} href="#">Per-person totals</a></li>
            <li><a onClick={onPerCategoryTotalsReportFeatureClick} href="#">Per-category totals</a></li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
export default AppMenu;