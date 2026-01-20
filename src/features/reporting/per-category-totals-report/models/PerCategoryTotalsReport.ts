import type { PerCategoryTotalsReportLineItem } from "./PerCategoryTotalsReportLineItem";

export type PerCategoryTotalsReport = {
	perCategoryReportLines: PerCategoryTotalsReportLineItem[];
	incomeTotal: number;
	expensesTotal: number;
	netTotal: number;
}