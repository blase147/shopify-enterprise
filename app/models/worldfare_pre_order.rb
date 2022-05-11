class WorldfarePreOrder < ApplicationRecord
	CREATION_TYPES = {
		rake: "Rake Task",
		cron: "Cron job",
		customer: "Customer"
	}
end
