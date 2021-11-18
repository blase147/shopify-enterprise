class BundleGroup < ApplicationRecord
  belongs_to :shop
  has_many :bundles
  accepts_nested_attributes_for :bundles, reject_if: :all_blank, allow_destroy: true
end
