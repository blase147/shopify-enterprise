class ReportLog < ApplicationRecord
	enum report_type: [:product, :customer, :analytic]
end
