class WorldfarePreOrder < ApplicationRecord
	CREATION_TYPES = {
		rake: "Rake Task",
		cron: "Cron job",
		customer: "Customer"
	}
	validates :order_id, uniqueness: true
end
