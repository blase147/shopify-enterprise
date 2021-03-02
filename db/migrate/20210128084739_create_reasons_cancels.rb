class CreateReasonsCancels < ActiveRecord::Migration[6.0]
  def change
    create_table :reasons_cancels do |t|
      t.string :title
      t.string :return_content
      t.integer :setting_id

      t.timestamps
    end
  end
end
