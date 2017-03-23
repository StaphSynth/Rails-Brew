class CreateYeasts < ActiveRecord::Migration[5.0]
  def change
    create_table :yeasts do |t|
      t.string :name
      t.string :type
      t.string :temp_range
      t.text :description

      t.timestamps
    end
  end
end
