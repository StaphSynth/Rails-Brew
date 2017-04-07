class DeleteTables < ActiveRecord::Migration[5.0]
  def change
    drop_table :recipe_ingredients
    drop_table :ingredients
  end
end
