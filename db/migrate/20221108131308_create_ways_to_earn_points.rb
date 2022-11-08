class CreateWaysToEarnPoints < ActiveRecord::Migration[6.0]
  def change
    create_table :ways_to_earn_points do |t|
      t.string :title
      t.integer :points_awarded
      t.boolean :status
      t.text :summary
      t.references :shop, null: false, foreign_key: true

      t.timestamps
    end
  end
end
