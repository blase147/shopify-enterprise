class CreateMemberships < ActiveRecord::Migration[6.0]
    def change
      create_table :memberships do |t|
        t.string :tag
        t.string :status
        t.references :shop, null: false, foreign_key: true
        t.references :selling_plan, null: false, foreign_key: true
        t.string :name
  
        t.timestamps
      end
    end
end