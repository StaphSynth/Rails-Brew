class DropUnnecessaryTables < ActiveRecord::Migration[5.0]
  def change
    drop_table :recipe_ingredients
    drop_table :hops
    drop_table :malts
    drop_table :yeasts
  end
end
