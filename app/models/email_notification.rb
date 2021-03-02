class EmailNotification < ApplicationRecord
  belongs_to :setting
  default_scope { order(created_at: :asc) }
end
