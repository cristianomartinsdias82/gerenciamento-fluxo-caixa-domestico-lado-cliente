import './AppMenu.css'

export type AppMenuProps = {
  onPeopleMenuItemClick?: () => void
  onCategoriesMenuItemClick?: () => void
  onTransactionsMenuItemClick?: () => void
  onPerPersonTotalsMenuItemClick?: () => void
  onPerCategoryTotalsMenuItemClick?: () => void
};

const AppMenu = ({
  onPeopleMenuItemClick,
  onCategoriesMenuItemClick,
  onTransactionsMenuItemClick,
  onPerPersonTotalsMenuItemClick,
  onPerCategoryTotalsMenuItemClick }: AppMenuProps) => {

  return (
    <div className="app-menu">
      <ul role="menu" >
        <li><a onClick={onPeopleMenuItemClick} href="#">People</a></li>
        <li><a onClick={onCategoriesMenuItemClick} href="#">Categories</a></li>
        <li><a onClick={onTransactionsMenuItemClick} href="#">Transactions</a></li>
        <li>
          <div>Reports</div>
          <ul className="sub-menu">
            <li><a onClick={onPerPersonTotalsMenuItemClick} href="#">Per-person totals</a></li>
            <li><a onClick={onPerCategoryTotalsMenuItemClick} href="#">Per-category totals</a></li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
export default AppMenu;