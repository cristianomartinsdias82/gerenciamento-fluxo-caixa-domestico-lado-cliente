import type { PerPersonTotalsReportLineItem } from "./PerPersonTotalsReportLineItem";

export type PerPersonTotalsReport = {
	perPersonReportLines: PerPersonTotalsReportLineItem[];
	incomeTotal: number;
	expensesTotal: number;
	netTotal: number;
}