class AdditionalContact < ApplicationRecord
  belongs_to :customer
  default_scope { order(created_at: :asc) }
end
