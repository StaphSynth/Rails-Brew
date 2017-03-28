class CreateStocks < ActiveRecord::Migration[5.0]
  def change
    create_table :stocks do |t|
      t.integer :user_id
      t.integer :ingredient_id
      t.float :quantity

      t.timestamps
    end
  end
end
